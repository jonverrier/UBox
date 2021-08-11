/*jslint white: false, indent: 3, maxerr: 1000 */
/*global exports*/
/*! Copyright TXPCo, 2020, 2021 */

// External components
import axios from 'axios';
import logging from 'loglevel';

logging.setLevel("info");

export class Logger  {

   private shipToSever: boolean;

   constructor(shipToSever: boolean = false) {
      this.shipToSever = shipToSever;
   }

   logError(component: string,
      method: string,
      message: string,
      data: any
   ): void {

      let date = new Date();
      let timeString = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ':' + date.getMilliseconds();

      const msg = ' ' + component + "." + method + ": " + message + (data ? data : "") + ' at:' + timeString;
      logging.error('Error:' + msg);

      if (this.shipToSever) {
         axios.post('/api/error', { params: { message: msg } });
      }
   }

   logInfo(component: string,
      method: string,
      message: string,
      data: any
   ): void {
      let date = new Date();
      let timeString = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ':' + date.getMilliseconds();
      const msg = 'Info: ' + component + "." + method + ": " + message + (data ? data : "") + ' at:' + timeString;
      logging.info(msg);
   }
}
