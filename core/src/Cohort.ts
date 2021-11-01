/*! Copyright TXPCo, 2020, 2021 */

import { InvalidParameterError } from './CoreError';
import { PersistenceDetailsMemento, PersistenceDetails, Persistence } from "./Persistence";
import { Name, NameMemento } from "./Party";
import { EmailAddress, PersonMemento, Person } from "./Person";
import { Business, BusinessMemento } from './Business';

export enum ECohortPeriod { Week = "One Week", TwoWeeks = "Two Weeks", ThreeWeeks = "Three Weeks", FourWeeks = "Four Weeks", Month = "One Month" }

export enum ECohortType {OlympicLifting = "Olympic Lifting", Powerlifting = "Power Lifting", Conditioning = "Conditioning"}

export class CohortTimePeriodMemento {
   _startDate: Date;
   _period: ECohortPeriod;
   _numberOfPeriods: number;

   /**
    * Create a CohortTimePeriodMemento object
    * @param startDate - when the cohort starts
    * @param period - what is the time period for measurements (week, twoweeks etc)
    * @param numberOfPeriods - how many periods does the cohort run for
    */
   constructor(startDate: Date, period: ECohortPeriod, numberOfPeriods: number) {

      this._startDate = startDate;
      this._period = period;
      this._numberOfPeriods = numberOfPeriods;
   }

   /**
   * set of 'getters' for private variables
   */
   get startDate(): Date {
      return this._startDate;
   }
   get period(): ECohortPeriod {
      return this._period;
   }
   get numberOfPeriods(): number {
      return this._numberOfPeriods;
   }
}

export class CohortTimePeriod {
   private _startDate: Date;
   private _period: ECohortPeriod;
   private _numberOfPeriods: number;

   /**
    * Create a CohortTimePeriod object
    * @param startDate - when the cohort starts
    * @param period - what is the time period for measurements (week, twoweeks etc)
    * @param numberOfPeriods - how many periods does the cohort run for
    */
   constructor(startDate: Date, period: ECohortPeriod, numberOfPeriods: number) {
      if (!CohortTimePeriod.isValidTimePeriod(startDate, period, numberOfPeriods)) {
         throw new InvalidParameterError();
      }

      this._startDate = startDate;
      this._period = period;
      this._numberOfPeriods = numberOfPeriods;
   }

   /**
   * set of 'getters' for private variables
   */
   get startDate(): Date {
      return this._startDate;
   }
   get period(): ECohortPeriod {
      return this._period;
   }
   get numberOfPeriods(): number {
      return this._numberOfPeriods;
   }

   /**
   * memento() returns a copy of internal state
   */
   memento(): CohortTimePeriodMemento {
      return new CohortTimePeriodMemento(this._startDate, this._period, this._numberOfPeriods);
   }

   /**
 * test for equality - checks all fields are the same. 
 * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
 * @param rhs - the object to compare this one to.  
 */
   equals(rhs: CohortTimePeriod): boolean {

      return (this._startDate.getTime() === rhs._startDate.getTime() &&
         this._period === rhs._period &&
         this._numberOfPeriods === rhs._numberOfPeriods);
   }

   /**
    * test for valid time period  
    * @param startDate - when the cohort starts - currently only superficial validation, in case user wants to amend something in the past
    * @param period - what is the time period for measurements (week, twoweeks etc) - dont need to validate this as its an Enum
    * @param numberOfPeriods - how many periods does the cohort run for
    */
   static isValidTimePeriod(startDate: Date, period: ECohortPeriod, numberOfPeriods: number): boolean {

      // number of periods must be > 0
      if (numberOfPeriods <= 0)
         return false;

      // check the proposed start year is >= current year
      let now = new Date();
      let yr = startDate.getFullYear();
      let yrNow = now.getFullYear();
      if (yr < yrNow)
         return false;

      // check the proposed start month is >= current month
      let mth = startDate.getMonth();
      let mthNow = now.getMonth();
      if (mth < mthNow)
         return false;

      return (true);
   }
}

export class CohortMemento {
   readonly _persistenceDetails: PersistenceDetailsMemento;
   _business: BusinessMemento; // Not readonly as database needs to manually set
   readonly _name: NameMemento;   
   readonly _period: CohortTimePeriodMemento;
   _administrators: Array<PersonMemento>; // Not readonly as database needs to manually set
   _members: Array<PersonMemento>;        // Not readonly as database needs to manually set
   readonly _cohortType: ECohortType;

   // These are used to allow the Db layer to swizzle object references to string Ids on save, and the reverse on load
   // so separate documents/tables can be used in the DB
   _businessId: string;
   _memberIds: Array<string>;

   /**
    * Create a CohortMemento object
    * @param persistenceDetails - (from Persistence) for the database layer to use and assign
    * @param business - the business that set up the Cohort
    * @param name - plain text name for the cohort
    * @param period - CohortTimePeriod to specifiy start date, period, number of period*
    * @param members - array of People, may be zero length 
    * @param cohortType - purpose of the cohort (Oly, Power, Conditioning, ...)
    * Design - all memento classes must depend only on base types, value types, or other Mementos
    */
   constructor(persistenceDetails: PersistenceDetailsMemento,
      business: BusinessMemento,
      name: NameMemento, 
      period: CohortTimePeriodMemento,
      members: Array<PersonMemento>,
      cohortType: ECohortType) {

      var i: number = 0;

      this._persistenceDetails = persistenceDetails;
      this._business = business;
      this._name = name;
      this._period = period;
      this._members = members;
      this._cohortType = cohortType;

      this._businessId = null;
      this._memberIds = null;
   }
}

export class Cohort extends Persistence {
   private _business: Business; 
   private _name: Name;
   private _period: CohortTimePeriod;
   private _members: Array<Person>;
   private _cohortType: ECohortType;

   // These are used to allow the Db layer to swizzle object references to string Ids on save, and the reverse on load
   // so separate documents/tables can be used in the DB
   private _adminstratorIds: Array<string>;
   private _memberIds: Array<string>;
/**
 * Create a Cohort object
 * @param persistenceDetails - (from Persistence) for the database layer to use and assign
 * @param business - the business that set up the Cohort*
 * @param name - plain text name for the cohort
 * @param administrators - array of People
 * @param members - array of People
 * @param period - CohortTimePeriod to specifiy start date, period, number of period
 * @param cohortType - purpose of the cohort (Oly, Power, Conditioning, ...)
 */
   constructor(persistenceDetails: PersistenceDetails,
      business: Business,
      name: Name,
      period: CohortTimePeriod,
      members: Array<Person>,
      cohortType: ECohortType);
   public constructor(memento: CohortMemento);
   public constructor(...params: any[]) {

      if (params.length === 1) {
         var i: number;
         let memento: CohortMemento = params[0];

         super(new PersistenceDetails(memento._persistenceDetails._key,
            memento._persistenceDetails._schemaVersion,
            memento._persistenceDetails._sequenceNumber));

         this._business = new Business (memento._business);
         this._name = new Name(memento._name._displayName);
         this._period = new CohortTimePeriod(memento._period.startDate, memento._period.period, memento._period.numberOfPeriods);

         this._members = new Array<Person>(memento._members.length);
         for (i = 0; i < memento._members.length; i++)
            this._members[i] = new Person(memento._members[i]);

         this._cohortType = memento._cohortType;

         this._adminstratorIds = null;
         this._memberIds = null;

      } else {

         super(params[0]);

         this._business = params[1];
         this._name = params[2];
         this._period = params[3];
         this._members = params[4];
         this._cohortType = params[5];
         this._adminstratorIds = null;
         this._memberIds = null;
      }
   }

   /**
   * set of 'getters' and setters for private variables
   */
   get business(): Business {
      return this._business;
   }
   get name(): Name {
      return this._name;
   }
   get members(): Array<Person> {
      return this._members;
   }
   get period(): CohortTimePeriod {
      return this._period;
   }
   get cohortType(): ECohortType {
      return this._cohortType;
   }

   set business(business: Business) {
      this._business = business;
   }
   set name(name: Name) {
      this._name = name;
   }
   set period(period: CohortTimePeriod) {
      this._period = period;
   }
   set members(people: Array<Person>) {
      this._members = people;
   }
   set cohortType(cohortType: ECohortType)  {
      this._cohortType = cohortType;
   }


   /**
   * memento() returns a copy of internal state
   */
   memento(): CohortMemento {

      return new CohortMemento(this.persistenceDetails.memento(),
         this._business.memento(),
         this._name.memento(),
         this._period.memento(),
         Person.peopleMemento(this._members),
         this._cohortType);
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: Cohort): boolean {

      return (super.equals(rhs) &&
         this._business.equals (rhs._business) &&
         this._name.equals(rhs._name) &&
         Person.peopleAreEqual(this._members, rhs._members) &&
         this._cohortType === rhs._cohortType &&
         this._period.equals(rhs._period));
   }

   /**
    * test if a cohort includes a person as a member 
    * @param person - the person to check
    */
   includesMember (person: Person): boolean {

      return (this._members.includes(person));
   }

   /**
    * test if a cohort includes a person as a member 
    * @param email - the person to check
    */
   includesMemberEmail (email: EmailAddress): boolean {

      return this.includesEmail(email, this._members);
   }

   /**
    * internal function to test if array includes a person with the email.
    * @param email - the person to check
    * @param people - an array of person objects to look inside to see if email is present
    */
   private includesEmail(email: EmailAddress, people: Array<Person>): boolean {

      for (let item of people) {
         if (item.email.equals(email))
            return true;
      }
      return false;
   }
}

export interface IBusinessStore {
   loadOne(id: string): Promise<Cohort | null>;
   save(cohort: Cohort): Promise<Cohort | null>;
}
