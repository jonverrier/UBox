/*! Copyright TXPCo, 2020, 2021 */

import { Persona, PersonaMemento } from './Persona';
import { Cohort, CohortMemento } from './Cohort';
import { Measurement, MeasurementMemento } from './Observation';
import { ILoaderFor } from './Persistence';
import { SessionPresenterMemento, SessionPresenter } from './SessionPresenter';

// Represents a the detail of a Cohort for presentation in the UI
export class CohortPresenterMemento extends SessionPresenterMemento {
   readonly _cohort: CohortMemento;
   readonly _measurements: Array<MeasurementMemento>;

   /**
    * Create a CohortPresenterMemento object
    * @param persona - agrregate of information to represent a Persona, in this case the Person logged in
    * @param isAdministrator - are they an Admin or not? 
    * @param cohort - details of the cohort 
    * @param measurements - measurements associated with the cohort 
    */
   constructor(
      persona: PersonaMemento,
      isAdministrator: boolean,
      cohort: CohortMemento,
      measurements: Array<MeasurementMemento>) {

      super(persona, isAdministrator)

      this._cohort = cohort;
      this._measurements = measurements;
   }
}

// Represents a Cohort and all associated measurements - used to present detailed information in UI
export class CohortPresenter extends SessionPresenter {
   readonly _cohort: Cohort;
   readonly _measurements: Array<Measurement>;

   /**
    * Create a CohortPresenter object
    * @param persona - agrregate of information to represent a Persona, in this case the Person logged in
    * @param isAdministrator - are they an Admin or not? * 
    * @param cohorts - personas of the cohorts to which the person belongs
    * @param measurements - measurements associated with the cohort  
    */
   constructor(
      persona: Persona,
      isAdministrator: boolean,
      cohort: Cohort,
      measurements: Array<Measurement>);
   public constructor(memento: CohortPresenterMemento);
   public constructor(...params: any[]) {

      if (params.length === 1) {

         let memento: CohortPresenterMemento = params[0];

         super(new Persona(memento._persona), memento._isAdministrator);

         this._cohort = new Cohort(memento._cohort);
         this._measurements = Measurement.fromMementos (memento._measurements);

      } else {

         super(params[0], params[1]);

         this._cohort = params[2];
         this._measurements = params[3];
      }
   }

   /**
   * set of 'getters' for private variables
   */
   get cohort(): Cohort {
      return this._cohort;
   }
   get measurements(): Array<Measurement> {
      return this._measurements;
   }

   memento(): CohortPresenterMemento {
      return new CohortPresenterMemento(super.persona.memento(), super.isAdministrator,
         this._cohort.memento(),
         Measurement.mementos(this._measurements));
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: CohortPresenter): boolean {

      return (
         (this.cohort.equals(rhs.cohort)) &&
         (Measurement.areEqual(this._measurements, rhs._measurements)) 
      );
   }
}

export interface ICohortPresenterStoreBySession extends ILoaderFor<CohortPresenter> {
}