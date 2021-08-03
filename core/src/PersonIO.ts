/*! Copyright TXPCo, 2020, 2021 */
import { InvalidParameterError } from './error';
import { EmailAddress, Name, Url, Roles, Person, ERoleType } from "./Person";
import { decodeWith, createEnumType} from '../src/PersistenceIO';
import { success, failure } from "io-ts/PathReporter";

import * as T from 'io-ts';

export const nameCodec = T.type({
   name: T.string, // name must be non-null
   surname: T.union([T.string, T.undefined, T.null])
});

export function tryNameDecode<ApplicationType> (data: any) : Name {
   let temp = decodeWith(nameCodec)(data); // If types dont match an exception will have be thrown.   
   return new Name (temp.name, temp.surname);
}

export const emailCodec = T.type({
   email: T.string, // email must be non-null
   isEmailVerified: T.boolean
});

export function tryEmailDecode<ApplicationType>(data: any): EmailAddress {
   let temp = decodeWith(emailCodec)(data); // If types dont match an exception will have be thrown.   
   return new EmailAddress(temp.email, temp.isEmailVerified);
}

export const urlCodec = T.type({
   url: T.string, // URL must be non-null
   isUrlVerified: T.boolean
});

export function tryUrlDecode<ApplicationType>(data: any): Url {

   let temp = decodeWith(urlCodec)(data); // If types dont match an exception will have be thrown.   
   return new Url(temp.url, temp.isUrlVerified);
}

export const rolesCodec = T.type({
   roles: T.union([T.array(createEnumType<ERoleType>(ERoleType, 'ERoleType')),
      T.undefined,
      T.null]) // Either an enum list, or null / undefined
});

export function tryRolesDecode<ApplicationType>(data: any): Roles {

   let temp = decodeWith(rolesCodec)(data); // If types dont match an exception will have be thrown.  
   return new Roles (temp.roles);
}
