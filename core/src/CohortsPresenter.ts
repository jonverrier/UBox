/*! Copyright TXPCo, 2020, 2021 */

import { Persona, PersonaMemento } from './Persona';
import { Cohort } from './Cohort';

// Represents a member or coach plus all the cohorts to which they belong - used to present summary information in UI
export class CohortsPresenterMemento {
   readonly _persona: PersonaMemento;
   readonly _cohorts: Array<PersonaMemento>;


   /**
    * Create a CohortsPresenterMemento object
    * @param persona - agrregate of information to represent a Persona, in this case the Person logged in
    * @param cohorts - personas of the cohorts to which the person belongs
    */
   constructor(
      persona: PersonaMemento,
      cohorts: Array<PersonaMemento>) {

      this._persona = persona;
      this._cohorts = cohorts;
   }
}

// Represents a member or coach plus all the cohorts to which they belong - used to present summary information in UI
export class CohortsPresenter {
   private _persona: Persona;
   private _cohorts: Array<Persona>;


   /**
    * Create a CohortsPresenterMemento object
    * @param persona - agrregate of information to represent a Persona, in this case the Person logged in
    * @param cohorts - personas of the cohorts to which the person belongs
    */
   constructor(
      persona: Persona,
      cohorts: Array<Persona>);
   public constructor(memento: CohortsPresenterMemento);
   public constructor(...params: any[]) {

      if (params.length === 1) {

         let memento: CohortsPresenterMemento = params[0];

         this._persona = new Persona(memento._persona);

         this._cohorts = new Array<Persona>();
         for (var i in memento._cohorts) {
            this._cohorts.push ( new Persona(memento._cohorts[i]));
         }

      } else {

         this._persona = params[0];
         this._cohorts = params[1];
      }
   }

   /**
   * set of 'getters' for private variables
   */
   get persona(): Persona {
      return this._persona;
   }
   get cohorts(): Array<Persona> {
      return this._cohorts;
   }

   /* TODO - should this be a flag set on the server? 
   isPersonAdminForCohort(cohort: Cohort) : boolean {

      for (var i in cohort.business.administrators) {
         if (this._persona.persistenceDetails.key === cohort.business.administrators[i].persistenceDetails.key)
            return true;
      }

      return false;
   }
   */

   memento(): CohortsPresenterMemento {
      return new CohortsPresenterMemento(this._persona.memento(), Persona.mementos(this._cohorts));
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: CohortsPresenter): boolean {

      return (
         (this._persona.equals(rhs._persona)) &&
         (Persona.areEqual (this._cohorts, rhs._cohorts)) 
      );
   }
}