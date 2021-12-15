/*jslint white: false, indent: 3, maxerr: 1000 */
/*global exports*/
/*! Copyright TXPCo, 2020, 2021 */

import { InvalidParameterError } from './CoreError';

// Absolute URL: https://tools.ietf.org/html/rfc3986#section-4.3
const AbsoluteUrlRegEx: RegExp = /^(ftp|http|https):\/\/[^ "]+$/;
const RelativeUrlRegExp: RegExp = /\/[^\w~,;\-\.\/?%&+#=]*/i;


export class Url  {

   private _stringUrl: string;

   constructor(_stringUrl: string) {

      if (!AbsoluteUrlRegEx.test(_stringUrl) && !RelativeUrlRegExp.test(_stringUrl)) {
         throw new InvalidParameterError("Url");
      }


      this._stringUrl = _stringUrl;
   }

   
}
