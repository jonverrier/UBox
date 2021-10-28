/*! Copyright TXPCo, 2021 */

import { BaseUnit } from './Unit';

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

