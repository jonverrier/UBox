/*! Copyright TXPCo, 2020, 2021 */

// React
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'; 

// Fluent-UI
import { Provider, teamsTheme, mergeThemes } from '@fluentui/react-northstar';

import { PersonaDetails, PersonaDetailsMemento } from '../../core/src/Persona';
import { PersonCohortsMemento } from '../../core/src/PersonCohorts';

// Server URLs
import { EAppUrls } from '../../apisrv/src/AppUrls';

// Local App 
import { appTheme } from './Theme';
import { CohortsPage, ICohortsPageProps } from './CohortsPage';
import { CohortPage} from './CohortPage';
import { LoginPage } from './LoginPage';

export interface IAppProps {

}

interface IAppState {
   personaCohorts: PersonCohortsMemento;
}

export class PageSwitcher extends React.Component<IAppProps, IAppState> {

   constructor(props: IAppProps) {

      super(props);

      var user: PersonaDetails = PersonaDetails.notLoggedIn();
      var cohort1: PersonaDetails = new PersonaDetails("Olympic Lifting", "/assets/img/weightlifter-b-128x128.png");
      var cohort2: PersonaDetails = new PersonaDetails("Power Lifting", "/assets/img/weightlifter-b-128x128.png");
      var cohorts = new Array<PersonaDetailsMemento>();
      cohorts.push(cohort1.memento());
      cohorts.push(cohort2.memento());

      var personaCohorts: PersonCohortsMemento = new PersonCohortsMemento(user.memento(), cohorts);

      this.state = { personaCohorts: personaCohorts };
   }

   onSignIn (persona: PersonaDetails) : void {

      this.setState({ personaCohorts: new PersonCohortsMemento(persona.memento(), this.state.personaCohorts._cohorts) });
      this.forceUpdate();
   }

   render(): JSX.Element {
      // URLs need to be relative in switcher, so trim the leading '/'
      return ( 
         <Provider theme={mergeThemes(teamsTheme, appTheme)}>
            <BrowserRouter>   
               <Routes>
                  <Route path="/">
                     <Route path={EAppUrls.Cohorts.substr(1)} element={<CohortsPage personaCohorts={this.state.personaCohorts} onSignIn={this.onSignIn.bind (this)} />} />
                     <Route path={EAppUrls.Cohort.substr(1)} element={<CohortPage personaCohorts={this.state.personaCohorts} />} />
                     <Route path={EAppUrls.Login.substr(1)} element={<LoginPage personaDetails={new PersonaDetails(this.state.personaCohorts._personaDetails)}/>} />
                  </Route>
               </Routes>  
            </BrowserRouter>  
         </Provider>
      );
   }
}


// This allows code to be loaded in node.js for tests, even if we dont run actual React methods
if (document !== undefined && document.getElementById !== undefined) {
   ReactDOM.render(<PageSwitcher />, document.getElementById('root'));
}