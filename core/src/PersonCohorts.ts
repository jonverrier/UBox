/*! Copyright TXPCo, 2020, 2021 */


import { PersonaDetailsMemento } from './Persona';

// Represents a member or coach plus all the cohorts to which they belong - used to present summary information in UI
export class PersonCohortsMemento {
   readonly _personaDetails: PersonaDetailsMemento;
   readonly _cohorts: Array<PersonaDetailsMemento>;


   /**
    * Create a PersonCohortsMemento object
    * @param personaDetails - agrregate of information to represent a Persona 
    * @param cohorts - personas of the cohorts to which the person belongs
    * Design - all memento classes must depend only on base types, value types, or other Mementos
    */
   constructor(
      personaDetails: PersonaDetailsMemento,
      cohorts: Array<PersonaDetailsMemento>) {

      var i: number = 0;

      this._personaDetails = personaDetails;
      this._cohorts = cohorts;
   }
}

