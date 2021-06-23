/*! Copyright TXPCo, 2021 */

export enum ELanguage {
   EnglishUK,
   EnglishUS,
   French
}

export interface ITextLocaliser {

   // Lowest value mapped by the localiser - can be used by derived classes to map lookups to various different localisers, one per library
   lowestValue(): number;

   // highest value mapped by the localiser - can be used by derived classes to map lookups to various different localisers, one per library
   highestValue(): number;

   // Load the string with 'id' in the specified langauge
   load(id: number, language: ELanguage): string;
}

