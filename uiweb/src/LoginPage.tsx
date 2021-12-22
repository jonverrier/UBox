/*! Copyright TXPCo, 2020, 2021 */

// React
import * as React from 'react';

// Fluent-UI
import { Flex } from '@fluentui/react-northstar';

import { PersonaDetails, PersonaDetailsMemento } from '../../core/src/Persona';

// Local App 
import { Navbar } from './Navbar';
import { ILoginSplashProps, LoginSplash } from './LoginSplash';

interface ILoginPageState {
}

export class LoginPage extends React.Component<ILoginSplashProps, ILoginPageState> {

   constructor(props: ILoginSplashProps) {

      super(props);

      this.state = {};
   }

   render(): JSX.Element {
      var personaDetails: PersonaDetails = new PersonaDetails(this.props.personaDetails.name, this.props.personaDetails.thumbnailUrl);

      return (
         <div>
            <Navbar personaDetails={personaDetails} />
            <Flex gap="gap.medium" column={true}>
               <LoginSplash personaDetails={personaDetails}></LoginSplash>
            </Flex>
         </div>);

   }
}