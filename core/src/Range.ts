/*! Copyright TXPCo, 2021 */

import { QuantityOf, QuantityMementoOf } from './Quantity';
import { InvalidUnitError } from './CoreError';

export class RangeMementoOf<Unit> {
   readonly _lo: QuantityMementoOf<Unit>;
   readonly _hi: QuantityMementoOf<Unit>;
   readonly _loInclEq: boolean;
   readonly _hiInclEq: boolean;

   /**
    * Create a RangeMementoFor object - a low and high scalar quality.
    * @param low - the low range
    * @param _loInclEq - does the the low end of the range include equality test
    * @param hi - the unit in which the scalar value is measured
    * @param _hiInclEq - does the the high end of the range include equality test
    */
   constructor(lo: QuantityMementoOf<Unit>, _loInclEq: boolean, hi: QuantityMementoOf<Unit>, _hiInclEq: boolean) {

      this._lo = lo;
      this._loInclEq = _loInclEq;
      this._hi = hi;
      this._hiInclEq = _hiInclEq;
   }
}

export class RangeOf<Unit> { 
   private _lo: QuantityOf<Unit>;
   private _hi: QuantityOf<Unit>;
   private _loInclEq: boolean;
   private _hiInclEq: boolean;

/**
 * Create a Range object - a low and high scalar quality.
 * @param lo - the low range
 * @param loInclEq - does the the low end of the range include equality test 
 * @param hi - the unit in which the scalar value is measured
 * @param hiInclEq - does the the high end of the range include equality test
 */
   constructor(lo: QuantityOf<Unit>, loInclEq: boolean, hi: QuantityOf<Unit>, hiInclEq: boolean) {

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
   get lo(): QuantityOf<Unit> {
      return this._lo;
   }

   get hi(): QuantityOf<Unit> {
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
   memento(): RangeMementoOf<Unit> {
      return new RangeMementoOf<Unit>(this._lo.memento(), this._loInclEq, this._hi.memento(), this._hiInclEq);
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: RangeOf<Unit> ) : boolean {

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
   includes(value: QuantityOf<Unit>): boolean {

      if (value.amount > this._lo.amount && value.amount < this._hi.amount)
         return true;

      if (this._loInclEq && value.equals(this._lo))
         return true;

      if (this._hiInclEq && value.equals(this._hi))
         return true;

      return false;
   }
}

