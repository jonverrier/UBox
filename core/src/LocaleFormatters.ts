/*! Copyright TXPCo, 2021 */
// Local App 
import { PersonaDetails } from './Persona';
import { Business } from './Business';
import { Measurement } from './Observation';

export class DateFormatter {

   format(stamp: Date): string {

      var now = new Date();
      var accumulate: string = "";

      if (stamp.getFullYear() === now.getFullYear() &&
         stamp.getMonth() === now.getMonth() &&
         stamp.getDay() === now.getDay()) {

         accumulate = accumulate.concat("Today, ");
      }
      else {
         const dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
         accumulate = accumulate.concat(stamp.toLocaleDateString(undefined, dateOptions as any));
         accumulate = accumulate.concat(", ");
      }

      const timeOptions = { hour: '2-digit', minute: '2-digit' };
      accumulate = accumulate.concat(stamp.toLocaleTimeString(undefined, timeOptions as any));

      return accumulate;
   }
}

export class FormattedMeasurement {
   public timestamp: string;
   public measurement: string;
   public persona: PersonaDetails;
}

export class MeasurementFormatter {

   private lookupPersona(key: string, business: Business): PersonaDetails {

      if (!business)
         return PersonaDetails.unknown();

      for (var i in business.administrators) {
         if (business.administrators[i].persistenceDetails.key === key)
            return business.administrators[i].personaDetails;
      }

      for (var i in business.members) {
         if (business.members[i].persistenceDetails.key === key)
            return business.members[i].personaDetails;
      }

      return PersonaDetails.unknown();
   }

   format(measurement: Measurement, business: Business): FormattedMeasurement {

      var dateFormatter: DateFormatter = new DateFormatter();

      var message: string = measurement.measurementType.measurementType + ', '
         + measurement.repeats + (measurement.repeats > 1 ? ' reps, ' : ' rep, ')
         + measurement.quantity.amount + ' ' + measurement.quantity.unit.name;
      var timestamp: string = dateFormatter.format(new Date(measurement.timestamp));
      var persona: PersonaDetails = this.lookupPersona(measurement.subjectKey, business);

      return {
         measurement: message,
         timestamp: timestamp,
         persona: persona
      };
   }
}



