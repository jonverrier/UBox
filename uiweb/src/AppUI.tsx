/*! Copyright TXPCo, 2020, 2021 */

// React
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'; 

// Fluent-UI
import { Provider, teamsTheme, mergeThemes } from '@fluentui/react-northstar';

import { PersistenceDetails } from '../../core/src/Persistence'; 
import { Persona, PersonaDetails } from '../../core/src/Persona';
import { CohortsPresenter} from '../../core/src/CohortsPresenter';

// Server URLs
import { EAppUrls } from '../../apisrv/src/AppUrls';

// Local App 
import { appTheme } from './Theme';
import { CohortsPage } from './CohortsPage';
import { CohortPage} from './CohortPage';
import { LoginPage } from './LoginPage';

export interface IAppProps {

}

interface IAppState {
   presenter: CohortsPresenter;
}

export class PageSwitcher extends React.Component<IAppProps, IAppState> {

   constructor(props: IAppProps) {

      super(props);

      // Initial status is the user not logged in, no cohorts
      var user: PersonaDetails = PersonaDetails.notLoggedIn();
      var cohorts = new Array<Persona>();

      var persona: Persona = new Persona(
         PersistenceDetails.newPersistenceDetails(),
         user);

      var personaCohorts: CohortsPresenter = new CohortsPresenter(persona, cohorts);

      this.state = { presenter: personaCohorts };
   }

   onSignIn(presenter: CohortsPresenter) : void {

      this.setState({ presenter: presenter });
   }

   render(): JSX.Element {
      // URLs need to be relative in switcher, so trim the leading '/'
      return ( 
         <Provider theme={mergeThemes(teamsTheme, appTheme)}>
            <BrowserRouter>   
               <Routes>
                  <Route path="/">
                     <Route path={EAppUrls.Cohorts.substr(1)} element={<CohortsPage presenter={this.state.presenter} onSignIn={this.onSignIn.bind (this)} />} />
                     <Route path={EAppUrls.Cohort.substr(1)} element={<CohortPage presenter={this.state.presenter} onSignIn={this.onSignIn.bind(this)}/>} />
                     <Route path={EAppUrls.Login.substr(1)} element={<LoginPage persona={this.state.presenter.persona} />} />
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