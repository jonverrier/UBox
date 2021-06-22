/*! Copyright TXPCo, 2021 */

export enum ELanguage {
   EnglishUK,
   EnglishUS,
   French
}

export interface ITextLocaliser {
   load(id: number, language: ELanguage): string;
}

