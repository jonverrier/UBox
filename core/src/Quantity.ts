/*! Copyright TXPCo, 2021 */

import { BaseUnit } from './Unit';

// Whenever any of these are changed, the schema in ObservationDb must be changed to match
export enum EWeightUnits { Kg = "Kg", Lbs = "Lbs" };
export enum ETimeUnits { Seconds = "Seconds" };
export enum ERepUnits { Reps = "Reps" };

export interface IUnit {
   allowedValues(): Array<string>;

   isAllowedValue(value: string): boolean;
}

export class WeightUnits implements IUnit {
   allowedValues(): Array<string> {
      return WeightUnits.allowedValues(); // Member function calls the static one to avoid duplicated logic
   }

   isAllowedValue(value: string): boolean {
      return WeightUnits.isAllowedValue(value); // Member function calls the static one to avoid duplicated logic
   }

   static allowedValues(): Array<string> {
      return Object.values(EWeightUnits);
   }

   static isAllowedValue(value: string): boolean {
      var values: Array<string> = WeightUnits.allowedValues();
      return values.indexOf(value) !== -1;
   }
}

export class TimeUnits implements IUnit {
   allowedValues(): Array<string> {
      return TimeUnits.allowedValues(); // Member function calls the static one to avoid duplicated logic
   }

   isAllowedValue(value: string): boolean {
      return TimeUnits.isAllowedValue(value); // Member function calls the static one to avoid duplicated logic
   }

   static allowedValues(): Array<string> {
      return Object.values(ETimeUnits);
   }
   static isAllowedValue(value: string): boolean {
      var values: Array<string> = TimeUnits.allowedValues();
      return values.indexOf(value) !== -1;
   }
}

export class RepUnits implements IUnit {
   allowedValues(): Array<string> {
      return RepUnits.allowedValues(); // Member function calls the static one to avoid duplicated logic
   }

   isAllowedValue(value: string): boolean {
      return RepUnits.isAllowedValue(value); // Member function calls the static one to avoid duplicated logic
   }

   static allowedValues(): Array<string> {
      return Object.values(ERepUnits);
   }
   static isAllowedValue(value: string): boolean {
      var values: Array<string> = RepUnits.allowedValues();
      return values.indexOf(value) !== -1;
   }
}

export class QuantityMemento {
   readonly _amount: number;
   readonly _unit: BaseUnit;

   /**
    * Create a QuantityMementoOf object - an amount, with Units
    * @param amount - the scalar value
    * @param unit - the unit in which the scalar value is measured
    */
   constructor(amount: number, unit: BaseUnit) {
      this._amount = amount;
      this._unit = unit;
   }
}

export class Quantity { 
   private _amount: number;
   private _unit: BaseUnit;

/**
 * Create a Quantity object - an amount, with Units
 * @param amount - the scalar value
 * @param unit - the unit in which the scalar value is measured
 */
   constructor(amount: number, unit: BaseUnit)
   public constructor(memento: QuantityMemento);
   public constructor(...params: any[]) {

      if (params.length === 1) {
         let memento: QuantityMemento = params[0];

         this._amount = memento._amount;
         this._unit = memento._unit;

      } else {
         this._amount = params[0];
         this._unit = params[1];
      }
   }

   /**
   * set of 'getters' for private variables
   */
   get amount (): number {
      return this._amount;
   }

   get unit(): BaseUnit {
      return this._unit;
   }

   /**
   * memento() returns a copy of internal state
   */
   memento(): QuantityMemento {
      return new QuantityMemento (this._amount, this._unit);
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: Quantity ) : boolean {

      return (
         (this._amount === rhs._amount) &&
         (this._unit.equals(rhs._unit))); 
   }
}

