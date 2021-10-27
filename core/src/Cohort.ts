/*! Copyright TXPCo, 2020, 2021 */

import { InvalidParameterError } from './CoreError';
import { PersistenceDetailsMemento, PersistenceDetails, Persistence } from "./Persistence";
import { EmailAddress, PersonMemento, Person, personArraysAreEqual } from "./Person";
import { MeasurementTypeMementoOf, EMeasurementType, MeasurementTypeOf, weightMeasurementTypeArraysAreEqual, timeMeasurementTypeArraysAreEqual } from "./Observation";
import { WeightUnits, TimeUnits } from './Quantity';

export enum ECohortPeriod { Week = "Week", TwoWeeks = "TwoWeeks", ThreeWeeks = "ThreeWeeks", FourWeeks = "FourWeeks", Month = "Month" }

export enum ECohortType {OlympicLifting = "Olymplic Lifting", Powerlifting = "Power Lifting", Conditioning = "Conditioning"}

export class CohortNameMemento {
   _name: string;

   /**
    * Create a CohortNameMemento object
    * @param name - name for the Cohort
    */
   constructor(name: string) {
      this._name = name;
   }

   /**
   * set of 'getters' for private variables
   */
   get name(): string {
      return this._name;
   }
}

export class CohortName {
   private _name: string;

   /**
    * Create a CohortName object
    * @param name - name for the Cohort
    */
   constructor(name: string) {
      if (!CohortName.isValidName (name)) {
         throw new InvalidParameterError();
      }

      this._name = name;
   }

   /**
   * memento() returns a copy of internal state
   */
   memento(): CohortNameMemento {
      return new CohortNameMemento (this._name);
   }

   /**
   * set of 'getters' for private variables
   */
   get name(): string {
      return this._name;
   }


   /**
 * test for equality - checks all fields are the same. 
 * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
 * @param rhs - the object to compare this one to.  
 */
   equals(rhs: CohortName): boolean {

      return (this._name === rhs._name);
   }

   /**
    * test for valid name 
    * @param name - the string to test
    */
   static isValidName(name: string): boolean {
      if (name === null || name.length === 0)
         return false;

      return (true);
   }
}

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
   _persistenceDetails: PersistenceDetailsMemento;
   _name: CohortNameMemento;
   _period: CohortTimePeriodMemento;
   _administrators: Array<PersonMemento>;
   _members: Array<PersonMemento>;
   _cohortType: ECohortType;

   // These are used to allow the Db layer to swizzle object references to string Ids on save, and the reverse on load
   // so separate documents/tables can be used in the DB
   _administratorIds: Array<string>;
   _memberIds: Array<string>;

   /**
    * Create a CohortMemento object
    * @param persistenceDetails - (from Persistence) for the database layer to use and assign
    * @param name - plain text name for the cohort
    * @param period - CohortTimePeriod to specifiy start date, period, number of period*
    * @param administrators - array of People, may be zero length // TODO - must have at least one adminsistrator
    * @param members - array of People, may be zero length 
    * @param cohortType - purpose of the cohort (Oly, Power, Conditioning, ...)
    * Design - all memento classes must depend only on base types, value types, or other Mementos
    */
   constructor(persistenceDetails: PersistenceDetailsMemento,
      name: CohortNameMemento, 
      period: CohortTimePeriodMemento,
      administrators: Array<PersonMemento>, members: Array<PersonMemento>,
      cohortType: ECohortType) {

      var i: number = 0;

      this._persistenceDetails = persistenceDetails;
      this._name = name;
      this._period = period;

      this._administrators = administrators;
      this._members = members;
      this._cohortType = cohortType;

      this._administratorIds = null;
      this._memberIds = null;
   }
}

export class Cohort extends Persistence {
   private _name: CohortName;
   private _period: CohortTimePeriod;
   private _administrators: Array<Person>;
   private _members: Array<Person>;
   private _cohortType: ECohortType;

   // These are used to allow the Db layer to swizzle object references to string Ids on save, and the reverse on load
   // so separate documents/tables can be used in the DB
   private _adminstratorIds: Array<string>;
   private _memberIds: Array<string>;
/**
 * Create a Cohort object
 * @param persistenceDetails - (from Persistence) for the database layer to use and assign
 * @param name - plain text name for the cohort
 * @param administrators - array of People
 * @param members - array of People
 * @param period - CohortTimePeriod to specifiy start date, period, number of period
 * @param cohortType - purpose of the cohort (Oly, Power, Conditioning, ...)
 */
   constructor(persistenceDetails: PersistenceDetails,
      name: CohortName,
      period: CohortTimePeriod,
      administrators: Array<Person>, members: Array<Person>,
      cohortType: ECohortType);
   public constructor(memento: CohortMemento);
   public constructor(...params: any[]) {

      if (params.length === 1) {
         var i: number;
         let memento: CohortMemento = params[0];

         super(new PersistenceDetails(memento._persistenceDetails._key,
            memento._persistenceDetails._schemaVersion,
            memento._persistenceDetails._sequenceNumber));

         this._name = new CohortName(memento._name.name);
         this._period = new CohortTimePeriod(memento._period.startDate, memento._period.period, memento._period.numberOfPeriods);

         this._administrators = new Array<Person>(memento._administrators.length);
         for (i = 0; i < memento._administrators.length; i++)
            this._administrators[i] = new Person(memento._administrators[i]);

         this._members = new Array<Person>(memento._members.length);
         for (i = 0; i < memento._members.length; i++)
            this._members[i] = new Person(memento._members[i]);

         this._cohortType = memento._cohortType;

         this._adminstratorIds = null;
         this._memberIds = null;

      } else {

         super(params[0]);

         this._name = params[1];
         this._period = params[2];
         this._administrators = params[3];
         this._members = params[4];
         this._cohortType = params[5];
         this._adminstratorIds = null;
         this._memberIds = null;
      }
   }

   /**
   * set of 'getters' and setters for private variables
   */
   get name(): CohortName {
      return this._name;
   }
   get administrators(): Array<Person> {
      return this._administrators;
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

   set name(name: CohortName) {
      this._name = name;
   }
   set period(period: CohortTimePeriod) {
      this._period = period;
   }
   set administrators(people: Array<Person>) {
      this._administrators = people;
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

      var i: number = 0;
      let administrators = new Array<PersonMemento>(this._administrators.length);
      for (i = 0; i < this._administrators.length; i++)
         administrators[i] = this._administrators[i].memento();

      let members = new Array<PersonMemento>(this._members.length);
      for (i = 0; i < this._members.length; i++)
         members[i] = this._members[i].memento();

      return new CohortMemento (this.persistenceDetails.memento(), 
         this._name.memento(),
         this._period.memento(),
         administrators,
         members,
         this._cohortType);
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: Cohort): boolean {

      return (super.equals(rhs) &&
         this._name.equals(rhs._name) &&
         personArraysAreEqual(this._administrators, rhs._administrators) &&
         personArraysAreEqual(this._members, rhs._members) &&
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
    * test if a cohort includes a person as an administrator 
    * @param person - the person to check
    */
   includesAdministrator(person: Person): boolean {

      return (this._administrators.includes(person));
   }

   /**
    * test if a cohort includes a person as a member 
    * @param email - the person to check
    */
   includesMemberEmail (email: EmailAddress): boolean {

      return this.includesEmail(email, this._members);
   }

   /**
    * test if a cohort includes a person as an administrator 
    * @param email - the person to check
    */
   includesAdministratorEmail (email: EmailAddress): boolean {

      return this.includesEmail(email, this._administrators);
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

export interface ICohortStore {
   load(id: string): Promise<Cohort | null>;
   save(cohort: Cohort): Promise<Cohort | null>;
}
