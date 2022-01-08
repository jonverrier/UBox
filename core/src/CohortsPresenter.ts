/*! Copyright TXPCo, 2020, 2021 */

import { Persona, PersonaMemento } from './Persona';
import { ILoaderFor } from './Persistence';
import { SessionPresenterMemento, SessionPresenter } from './SessionPresenter';

// Represents a member or coach plus all the cohorts to which they belong - used to present summary information in UI
export class CohortsPresenterMemento extends SessionPresenterMemento {
   readonly _cohorts: Array<PersonaMemento>;


   /**
    * Create a CohortsPresenterMemento object
    * @param persona - agrregate of information to represent a Persona, in this case the Person logged in
    * @param isAdministrator - are they an Admin or not? 
    * @param cohorts - personas of the cohorts to which the person belongs
    */
   constructor(
      persona: PersonaMemento,
      isAdministrator: boolean,
      cohorts: Array<PersonaMemento>) {

      super(persona, isAdministrator)

      this._cohorts = cohorts;
   }
}

// Represents a member or coach plus all the cohorts to which they belong - used to present summary information in UI
export class CohortsPresenter extends SessionPresenter {
   private _cohorts: Array<Persona>;


   /**
    * Create a CohortsPresenterMemento object
    * @param persona - agrregate of information to represent a Persona, in this case the Person logged in
    * @param isAdministrator - are they an Admin or not? * 
    * @param cohorts - personas of the cohorts to which the person belongs
    */
   constructor(
      persona: Persona,
      isAdministrator: boolean,
      cohorts: Array<Persona>);
   public constructor(memento: CohortsPresenterMemento);
   public constructor(...params: any[]) {

      if (params.length === 1) {

         let memento: CohortsPresenterMemento = params[0];

         super(new Persona(memento._persona), memento._isAdministrator);

         this._cohorts = new Array<Persona>();
         for (var i in memento._cohorts) {
            this._cohorts.push ( new Persona(memento._cohorts[i]));
         }

      } else {

         super(params[0], params[1]);

         this._cohorts = params[2];
      }
   }

   /**
   * set of 'getters' for private variables
   */
   get cohorts(): Array<Persona> {
      return this._cohorts;
   }

   memento(): CohortsPresenterMemento {
      return new CohortsPresenterMemento(super.persona.memento(), super.isAdministrator, Persona.mementos(this._cohorts));
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: CohortsPresenter): boolean {

      return (
         (super.equals(rhs)) &&
         (Persona.areEqual (this._cohorts, rhs._cohorts)) 
      );
   }
}

export interface ICohortsPresenterStoreBySession extends ILoaderFor<CohortsPresenter> {
}