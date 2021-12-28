/*! Copyright TXPCo, 2020, 2021 */

// React
import * as React from 'react';

// Fluent-UI
import { Flex } from '@fluentui/react-northstar';

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

      return (
         <div>
            <Navbar persona={this.props.persona} />
            <Flex gap="gap.medium" column={true}>
               <LoginSplash persona={this.props.persona}></LoginSplash>
            </Flex>
         </div>);

   }
}