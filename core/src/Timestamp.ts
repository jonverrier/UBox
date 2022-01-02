/*jslint white: false, indent: 3, maxerr: 1000 */
/*! Copyright TXPCo, 2020, 2021 */


export class Timestamper {

   // Returns a number that is timestamp rounded to nearest 15 mins
   // https://stackoverflow.com/questions/4968250/how-to-round-time-to-the-nearest-quarter-hour-in-javascript
   static round (stamp: Date): number {
      var minutes: number = stamp.getMinutes();
      var hours: number = stamp.getHours();

      // round to nearest 15 minutes
      var m: number = (((minutes + 7.5) / 15 | 0) * 15) % 60;
      var h: number = ((((minutes / 105) + .5) | 0) + hours) % 24;
      var date: Date = new Date(stamp.getFullYear(), stamp.getMonth(), stamp.getDate(), h, m);
      return date.getTime();
   }

   static now (): number {
      return Timestamper.round(new Date());
   }
}
