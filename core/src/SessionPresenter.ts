/*! Copyright TXPCo, 2020, 2021 */

import { Persona, PersonaMemento } from './Persona';
import { ILoaderFor } from './Persistence';

// Represents a member or coach - used to present summary information in UI
export class SessionPresenterMemento {
   readonly _persona: PersonaMemento;
   readonly _isAdministrator: boolean;


   /**
    * Create a SessionPresenterMemento object
    * @param persona - aggregate of information to represent a Persona, in this case the Person logged in
    * @param isAdministrator - are they an Admin or not? 
    */
   constructor(
      persona: PersonaMemento,
      isAdministrator: boolean) {

      this._persona = persona;
      this._isAdministrator = isAdministrator;
   }
}

// Represents a member or coach - used to present summary information in UI
export class SessionPresenter {
   private _persona: Persona;
   private _isAdministrator: boolean;


   /**
    * Create a SessionPresenter object
    * @param persona - agrregate of information to represent a Persona, in this case the Person logged in
    * @param cohorts - personas of the cohorts to which the person belongs
    */
   constructor(
      persona: Persona,
      isAdministrator: boolean   );
   public constructor(memento: SessionPresenterMemento);
   public constructor(...params: any[]) {

      if (params.length === 1) {

         let memento: SessionPresenterMemento = params[0];

         this._persona = new Persona(memento._persona);
         this._isAdministrator = memento._isAdministrator;

      } else {

         this._persona = params[0];
         this._isAdministrator = params[1];
      }
   }

   /**
   * set of 'getters' for private variables
   */
   get persona(): Persona {
      return this._persona;
   }
   get isAdministrator(): boolean {
      return this._isAdministrator;
   }

   memento(): SessionPresenterMemento {
      return new SessionPresenterMemento(this._persona.memento(), this._isAdministrator);
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: SessionPresenter): boolean {

      return (
         (this._persona.equals(rhs._persona)) &&
         (this._isAdministrator === rhs._isAdministrator)
      );
   }
}
