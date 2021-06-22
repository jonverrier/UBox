/*! Copyright TXPCo, 2021 */

export enum Language {
   EnglishUK,
   EnglishUS,
   French
}

export interface ITextLocaliser {
   load(id: number, language: Language): string;
}

