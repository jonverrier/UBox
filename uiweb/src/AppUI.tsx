/*! Copyright TXPCo, 2020, 2021 */

// React
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'; 

// Fluent-UI
import { Flex, Provider, teamsTheme, mergeThemes } from '@fluentui/react-northstar';

// Server URLs
import { EAppUrls } from '../../apisrv/src/AppUrls';

// Local App 
import { appTheme } from './Theme';
import { Navbar } from './Navbar';
import { PersonaDetails } from '../../core/src/Persona';
import { CohortCard } from './CohortCard';
import { CohortView } from './Cohort';
import { LoginView } from './Login';

export class Cohorts extends React.Component {
   _cohortPersona: PersonaDetails;
   _athletePersona: PersonaDetails;

   constructor(props) {
      super(props);

      this._cohortPersona = new PersonaDetails("Olympic Lifting", "/assets/img/weightlifter-b-128x128.png");
      this._athletePersona = new PersonaDetails("Joe", "/assets/img/person-w-512x512.png");
   }

   render() {
      return (
         <div>
            <Navbar personaDetails={this._athletePersona}/>
            <Flex gap="gap.medium" column={true}>
               <CohortCard personaDetails={this._cohortPersona}></CohortCard>
               <CohortCard personaDetails={this._cohortPersona}></CohortCard>
            </Flex>
         </div>
      );
   }
}

export class Cohort extends React.Component {
   _cohortPersona: PersonaDetails;
   _athletePersona: PersonaDetails;

   constructor(props) {
      super(props);

      this._cohortPersona = new PersonaDetails("Olympic Lifting", "/assets/img/weightlifter-b-128x128.png");
      this._athletePersona = new PersonaDetails("Joe", "/assets/img/person-w-512x512.png");
   }

   render() {
      return (
         <div>
            <Navbar personaDetails={this._athletePersona}/>
            <Flex gap="gap.medium" column={true}>
               <CohortView personaDetails={this._cohortPersona}></CohortView>
            </Flex>
         </div>);
         
   }
}

export class Login extends React.Component {
   _cohortPersona: PersonaDetails;
   _athletePersona: PersonaDetails;

   constructor(props) {

      super(props);

      this._cohortPersona = new PersonaDetails("Joe", "/assets/img/weightlifter-b-128x128.png");
      this._athletePersona = new PersonaDetails("Joe", "/assets/img/person-w-512x512.png");
   }

   render() {
      return (
         <div>
            <Navbar personaDetails={this._athletePersona}/>
            <Flex gap="gap.medium" column={true}>
               <LoginView personaDetails={this._cohortPersona}></LoginView>
            </Flex>
         </div>);

   }
}

export class PageSwitcher extends React.Component {
   render() {
      // URLs need to be relative in switcher, so trim the leading '/'
      return ( 
         <Provider theme={mergeThemes(teamsTheme, appTheme)}>
            <BrowserRouter>   
               <Routes>
                  <Route path="/">                    
                     <Route path={EAppUrls.Cohorts.substr(1)} element={<Cohorts />} />
                     <Route path={EAppUrls.Cohort.substr(1)} element={<Cohort />} />
                     <Route path={EAppUrls.Login.substr(1)} element={<Login />} />
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