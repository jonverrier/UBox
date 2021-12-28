/*! Copyright TXPCo, 2020, 2021 */

import { Persona } from './Persona';

// Represents a member or coach plus all the cohorts to which they belong - used to present summary information in UI
export class PersonCohorts {
   readonly _persona: Persona;
   readonly _cohorts: Array<Persona>;


   /**
    * Create a PersonCohortsMemento object
    * @param persona - agrregate of information to represent a Persona 
    * @param cohorts - personas of the cohorts to which the person belongs
    */
   constructor(
      persona: Persona,
      cohorts: Array<Persona>) {

      var i: number = 0;

      this._persona = persona;
      this._cohorts = cohorts;
   }
}

