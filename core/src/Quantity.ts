/*! Copyright TXPCo, 2021 */

export enum EWeightUnits { Kg, Lbs }
export enum ETimeUnits { Seconds }
export enum EDistanceUnits { Metres }
export enum ERepUnits { Reps }

export class QuantityMementoOf<Unit> {
   _amount: number;
   _unit: Unit;

   /**
    * Create a QuantityMementoOf object - an amount, with Units
    * @param amount - the scalar value
    * @param unit - the unit in which the scalar value is measured
    */
   constructor(amount: number, unit: Unit) {
      this._amount = amount;
      this._unit = unit;
   }

   /**
   * set of 'getters' for private variables
   */
   get amount(): number {
      return this._amount;
   }

   get unit(): Unit {
      return this._unit;
   }
}

export class QuantityOf<Unit> { 
   private _amount: number;
   private _unit: Unit;

/**
 * Create a Quantity object - an amount, with Units
 * @param amount - the scalar value
 * @param unit - the unit in which the scalar value is measured
 */
   constructor(amount: number, unit: Unit) {
      this._amount = amount;
      this._unit = unit;
   }

   /**
   * set of 'getters' for private variables
   */
   get amount (): number {
      return this._amount;
   }

   get unit(): Unit {
      return this._unit;
   }

   /**
   * memento() returns a copy of internal state
   */
   memento(): QuantityMementoOf<Unit> {
      return new QuantityMementoOf<Unit>(this._amount, this._unit);
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: QuantityOf<Unit> ) : boolean {

      return (
         (this._amount === rhs._amount) &&
         (this._unit === rhs._unit));
   }
}

