/*! Copyright TXPCo, 2020, 2021 */

// React
import * as React from 'react';

// Fluent-UI
import { Flex, Box, Image, Divider, Text, Button } from '@fluentui/react-northstar';

// Local App 
import { EAuthUrls } from '../../apisrv/src/AuthUrls';
import { Persona } from '../../core/src/Persona';
import { Media } from './Media';

export interface ILoginSplashProps {

   persona: Persona;
}

export interface ILoginSplashState {

}

export class LoginSplash extends React.Component<ILoginSplashProps, ILoginSplashState> {

   _media: Media;

   constructor(props: ILoginSplashProps) {
      super(props);

      this._media = new Media();

      this.state = { }
   }

   signIn(): void {
      window.location.href = EAuthUrls.GoogleRoot;
   }

   render(): JSX.Element {
      var small: boolean = this._media.isSmallFormFactor();

      if (small) {
         return (
            <Flex gap="gap.medium" padding="padding.medium" vAlign="center" hAlign="center">
               <Box styles={{
                  border: '1px solid #666666',
                  color: '#666666',
                  textAlign: 'center',
                  borderColor: '#666666',
                  boxShadow: '0 0 10px #666666'
               }}>
                  <Flex gap="gap.large" padding="padding.medium" column={false} vAlign="center" hAlign="center">
                     <Flex gap="gap.large" padding="padding.medium" column={false} vAlign="center" hAlign="center">
                        <Flex.Item size="size.medium">
                           <Flex gap="gap.medium" column={true} vAlign="center" hAlign="center">
                              <Text content="Sign in with Google to see your squads." size="medium" />
                              <Button icon={<Image fluid src='/assets/img/g-logo.png' />} content="Sign in with Google" onClick={this.signIn.bind(this)}/>
                           </Flex>
                        </Flex.Item>
                     </Flex>
                  </Flex>
               </Box>
            </Flex>
         );
      } else {
         return (
            <Flex gap="gap.medium" padding="padding.medium" vAlign="center" hAlign="center">
               <Box styles={{
                  border: '1px solid #666666',
                  color: '#666666',
                  textAlign: 'center',
                  borderColor: '#666666',
                  boxShadow: '0 0 10px #666666'
               }}>
                  <Flex gap="gap.large" padding="padding.medium" column={false} vAlign="center" hAlign="center">
                     <Flex gap="gap.large" padding="padding.medium" column={false} vAlign="center" hAlign="center">
                        <Flex.Item size="size.medium">
                           <Flex gap="gap.medium" column={true} vAlign="center" hAlign="center">
                              <Text content="Sign in with Google to see your squads." size="medium" />
                              <Button icon={<Image fluid src='/assets/img/g-logo.png' />} content="Sign in with Google" onClick={this.signIn.bind(this)}/>
                           </Flex>
                        </Flex.Item>
                        <Divider vertical color='#666666' size={4} />
                        <Flex.Item size="size.medium">
                           <Image fluid src="/assets/img/login.jpg" />
                        </Flex.Item>
                      </Flex>
                  </Flex>
               </Box>
            </Flex>
         );
      }
   }
}

export default LoginSplash;


