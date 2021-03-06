/*! Copyright TXPCo, 2021 */

import { Quantity, QuantityMemento } from './Quantity';
import { InvalidUnitError } from './CoreError';

export class RangeMemento {
   readonly _lo: QuantityMemento;
   readonly _hi: QuantityMemento;
   readonly _loInclEq: boolean;
   readonly _hiInclEq: boolean;

   /**
    * Create a RangeMementoFor object - a low and high scalar quality.
    * @param low - the low range
    * @param _loInclEq - does the the low end of the range include equality test
    * @param hi - the unit in which the scalar value is measured
    * @param _hiInclEq - does the the high end of the range include equality test
    */
   constructor(lo: QuantityMemento, _loInclEq: boolean, hi: QuantityMemento, _hiInclEq: boolean) {

      this._lo = lo;
      this._loInclEq = _loInclEq;
      this._hi = hi;
      this._hiInclEq = _hiInclEq;
   }
}

export class Range { 
   private _lo: Quantity;
   private _hi: Quantity;
   private _loInclEq: boolean;
   private _hiInclEq: boolean;

/**
 * Create a Range object - a low and high scalar quality.
 * @param lo - the low range
 * @param loInclEq - does the the low end of the range include equality test 
 * @param hi - the unit in which the scalar value is measured
 * @param hiInclEq - does the the high end of the range include equality test
 */
   constructor(lo: Quantity, loInclEq: boolean, hi: Quantity, hiInclEq: boolean) {

      // TODO - Currently we dont handle conversion, should allow conversion between units via a UnitConverter class
      if (lo.unit != hi.unit)
         throw new InvalidUnitError ();

      // low bar must be lower than or equal to high bar
      if (lo.amount > hi.amount)
         throw new RangeError();

      this._lo = lo;
      this._loInclEq = loInclEq;
      this._hi = hi;
      this._hiInclEq = hiInclEq;
   }

   /**
   * set of 'getters' for private variables
   */
   get lo(): Quantity {
      return this._lo;
   }

   get hi(): Quantity {
      return this._hi;
   }

   get lowIncludesEqual(): boolean {
      return this._loInclEq;
   }

   get highIncludesEqual(): boolean {
      return this._hiInclEq;
   }

   /**
   * memento() returns a copy of internal state
   */
   memento(): RangeMemento {
      return new RangeMemento(this._lo.memento(), this._loInclEq, this._hi.memento(), this._hiInclEq);
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: Range ) : boolean {

      return (
         (this._lo.equals (rhs._lo)) &&
         (this._loInclEq === rhs._loInclEq) && 
         (this._hi.equals (rhs._hi)) &&
         (this._hiInclEq === rhs._hiInclEq));
   }

   /**
    * test for wether the range includes the value
    * @param value - the object to test 
    */
   includes(value: Quantity): boolean {

      if (value.amount > this._lo.amount && value.amount < this._hi.amount)
         return true;

      if (this._loInclEq && value.equals(this._lo))
         return true;

      if (this._hiInclEq && value.equals(this._hi))
         return true;

      return false;
   }
}

