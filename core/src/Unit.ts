/*! Copyright TXPCo, 2021 */
// Class to represent a unit of measurement, per Martin Fowler 'Analysis Patterns'

// Whenever any of these are changed, the schema in ObservationDb must be changed to match
export enum EBaseUnitDimension { Weight = "Weight", Time = "Time", Reps = "Reps"}
export enum EBaseUnit { Kg = "Kg", Lbs = "Lbs", Seconds = "Seconds", Reps = "Reps" }

export class BaseUnitMemento {
   readonly _dimension: EBaseUnitDimension;
   readonly _name: string;

   constructor(dimension: EBaseUnitDimension, name: string) {
      this._dimension = dimension;
      this._name = name;
   }
}

export class BaseUnit {
   readonly _dimension: EBaseUnitDimension;
   readonly _name: string;

   constructor(dimension: EBaseUnitDimension, name: string)
   public constructor(memento: BaseUnitMemento);
   public constructor(...params: any[]) {

      if (params.length === 1) {
         let memento: BaseUnitMemento = params[0];

         this._dimension = memento._dimension;
         this._name = memento._name;
      } else {
         this._dimension = params[0];
         this._name = params[1];
      }
   }

   get dimension(): EBaseUnitDimension {
      return this._dimension;
   }

   get name(): string {
      return this._name;
   }

   memento(): BaseUnitMemento {
      return new BaseUnitMemento(this._dimension, this._name);
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: BaseUnit): boolean {

      return (
         (this._dimension === rhs._dimension) &&
         (this._name === rhs._name)); 
   }
}

export class BaseUnits {
   // Return Units as singletons - means can directly compare references for equality test
   public static readonly _kilogram = new BaseUnit(EBaseUnitDimension.Weight, EBaseUnit.Kg);
   public static readonly _lb = new BaseUnit(EBaseUnitDimension.Weight, EBaseUnit.Lbs);
   public static readonly _second = new BaseUnit(EBaseUnitDimension.Time, EBaseUnit.Seconds);
   public static readonly _rep = new BaseUnit(EBaseUnitDimension.Reps, EBaseUnit.Reps);

   static get kilogram(): BaseUnit {
      return this._kilogram;
   }

   static get lb(): BaseUnit {
      return this._lb;
   }

   static get second(): BaseUnit {
      return this._second;
   }

   static get rep(): BaseUnit {
      return this._rep;
   }
}

