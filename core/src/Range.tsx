/*! Copyright TXPCo, 2021 */

import { InvalidUnitError, Quantity } from './Quantity';

export class Range<Unit> { 
   private _lo: Quantity<Unit>;
   private _hi: Quantity<Unit>;
   private _loInclEq: boolean;
   private _hiInclEq: boolean;

/**
 * Create a Range object - a low and high scalar quality.
 * @param low - the low range
 * @param loEq - does the the low end of the range include equality test 
 * @param hi - the unit in which the scalar value is measured
 * @param hiEq - does the the high end of the range include equality test
 */
   constructor(lo: Quantity<Unit>, loEq: boolean, hi: Quantity<Unit>, hiEq: boolean) {

      // TODO - Currently we dont handle conversion, should allow conversion between units via a UnitConverter class
      if (lo.unit != hi.unit)
         throw new InvalidUnitError ();

      // low bar must be lower than or equal to high bar
      if (lo.amount > hi.amount)
         throw new RangeError();

      this._lo = lo;
      this._loInclEq = loEq;
      this._hi = hi;
      this._hiInclEq = hiEq;
   }

   /**
   * set of 'getters' for private variables
   */
   get low(): Quantity<Unit> {
      return this._lo;
   }

   get high(): Quantity<Unit> {
      return this._hi;
   }

   get lowIncludesEqual(): boolean {
      return this._loInclEq;
   }

   get highIncludesEqual(): boolean {
      return this._hiInclEq;
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: Range<Unit> ) : boolean {

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
   includes(value: Quantity<Unit>): boolean {

      if (value.amount > this._lo.amount && value.amount < this._hi.amount)
         return true;

      if (this._loInclEq && value.equals(this._lo))
         return true;

      if (this._hiInclEq && value.equals(this._hi))
         return true;

      return false;
   }
}

