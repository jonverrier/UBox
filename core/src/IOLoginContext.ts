/*! Copyright TXPCo, 2020, 2021 */

import { LoginContext, ELoginProvider } from "./LoginContext";
import { decodeWith, encodeWith, createEnumType, ICodec} from '../src/IOCommon';

import * as IoTs from 'io-ts';

// LoginDetails Codec
// ==========
const loginIoType = IoTs.type({
   _provider: createEnumType<ELoginProvider>(ELoginProvider, 'ELoginProvider'),
   _token: IoTs.string // token must be non-null
});

export class LoginContextCodec implements ICodec<LoginContext> {

   decode(data: any): any {
      return decodeWith(loginIoType)(data);
   }

   encode(data: LoginContext): any {
      return encodeWith(loginIoType)(data.memento());
   }

   tryCreateFrom(data: any): LoginContext {
      let temp = this.decode (data); // If types dont match an exception will be thrown here
      return new LoginContext(temp._provider, temp._token);
   }
}

