/*! Copyright TXPCo, 2020, 2021 */

// Core React
import * as ReactDOM from 'react-dom';
import * as React from 'react';


// Additional packages
import { BrowserRouter, Route, Routes } from 'react-router-dom'; 
import { Provider, teamsTheme, mergeThemes } from '@fluentui/react-northstar';
import { ComposeIcon } from '@fluentui/react-icons-northstar';

import { appTheme } from './Theme';
import { Navbar } from './Navbar';
import { PersonaDetails } from '../../core/src/Persona';
import { CohortCard } from './CohortCard';

export class Cohorts extends React.Component {
   _personaDetails: PersonaDetails;

   constructor(props) {
      super(props);

      this._personaDetails = new PersonaDetails("Olympic Lifting", "assets/img/weightlifter-b-128x128.png");

   }

   render() {
      return (<div>
         <Navbar />
         <CohortCard personaDetails={this._personaDetails}></CohortCard>
         <CohortCard personaDetails={this._personaDetails}></CohortCard>
         </div>);
   }
}

export class Cohort extends React.Component {
   render() {
      return (
         <div>
            <Navbar />
            <p>Cohort</p> <ComposeIcon />
         </div>);
         
   }
}

export class PageSwitcher extends React.Component {
   render() {
      return ( 
         <Provider theme={mergeThemes(teamsTheme, appTheme)}>
            <BrowserRouter>   
               <Routes>
                  <Route path="/">
                     <Route path="cohorts" element={<Cohorts />} />
                     <Route path="cohort" element={<Cohort />} />
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