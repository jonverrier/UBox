/*! Copyright TXPCo, 2021 */

export enum ELanguage {
   EnglishUK = "EnglishUK",
   EnglishUS = "EnglishUS",
   French = "French"
}

export interface ITextLocaliser {

   /**
   * set of 'getters' and setters for private variables
   */
   // Language enum used by the localiser
   get language(): ELanguage;
   // Lowest value mapped by the localiser - can be used by derived classes to map lookups to various different localisers, one per library
   get lowestValue(): number;
   // highest value mapped by the localiser - can be used by derived classes to map lookups to various different localisers, one per library
   get highestValue(): number;

   // Load the string with 'id' in the langauge. Language is normally passed in to the localiser in its constructor
   load(id: number): string;
}

