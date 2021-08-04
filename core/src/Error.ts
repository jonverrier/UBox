/*! Copyright TXPCo, 2021 */

export class InvalidUnitError extends Error {
   constructor(message?: string) {
      super(message);
      // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
      Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
      this.name = InvalidUnitError.name; // stack traces display correctly now
   }
}

export class InvalidParameterError extends Error {
   constructor(message?: string) {
      super(message);
      // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
      Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
      this.name = InvalidParameterError.name; // stack traces display correctly now
   }
}

export class InvalidFormatError extends Error {
   constructor(message?: string) {
      super(message);
      // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
      Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
      this.name = InvalidParameterError.name; // stack traces display correctly now
   }
}