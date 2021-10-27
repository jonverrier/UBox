/*! Copyright TXPCo, 2021 */
// Class to represent a unit of measurement, per Martin Fowler 'Analysis Patterns'

// Whenever any of these are changed, the schema in ObservationDb must be changed to match
export enum EBaseUnitDimension { Weight = "Weight", Time = "Time", Reps = "Reps"}
export enum EBaseUnit { Kg = "Kg", Lbs = "Lbs", Seconds = "Seconds", Reps = "Reps" }

export class BaseUnit {
   private _dimension: EBaseUnitDimension;
   private _name: string;

   constructor(dimension: EBaseUnitDimension, name: string) {
      this._dimension = dimension;
      this._name = name;
   }

   get dimension(): EBaseUnitDimension {
      return this._dimension;
   }

   get name(): string {
      return this._name;
   }
}

export class BaseUnits {
   // Return Units as singletons - means can directly compare references for equality test
   public static readonly _kilogram = new BaseUnit(EBaseUnitDimension.Weight, EBaseUnit.Kg);
   public static readonly _poundLb = new BaseUnit(EBaseUnitDimension.Weight, EBaseUnit.Lbs);
   public static readonly _second = new BaseUnit(EBaseUnitDimension.Time, EBaseUnit.Seconds);
   public static readonly _rep = new BaseUnit(EBaseUnitDimension.Reps, EBaseUnit.Reps);

   static get kilogram(): BaseUnit {
      return this._kilogram;
   }

   static get poundLb(): BaseUnit {
      return this._poundLb;
   }

   static get second(): BaseUnit {
      return this._second;
   }

   static get rep(): BaseUnit {
      return this._rep;
   }
}

