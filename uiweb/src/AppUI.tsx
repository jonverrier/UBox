/*! Copyright TXPCo, 2020, 2021 */

// Core React
import * as ReactDOM from 'react-dom';
import * as React from 'react';


// Additional packages
import { BrowserRouter, Route, Navigate, Routes } from 'react-router-dom'; 

   //<Route path = "/" >
   //<Navigate to="/cohorts" />  
   //</Route > 
export class Cohorts extends React.Component {
   render() {
      return (
         <p>Cohorts</p>);
   }
}

export class Cohort extends React.Component {
   render() {
      return (
         <p>Cohort</p>);
   }
}

export class PageSwitcher extends React.Component {
   render() {
      return ( 
         <BrowserRouter>   
            <Routes>
               <Route path="/">
                  <Route path="cohorts" element={<Cohorts />} />
                  <Route path="cohort" element={<Cohort />} />
               </Route>
            </Routes>  
         </BrowserRouter>  
      );
   }
}


// This allows code to be loaded in node.js for tests, even if we dont run actual React methods
if (document !== undefined && document.getElementById !== undefined) {
   ReactDOM.render(<PageSwitcher />, document.getElementById('root'));
}