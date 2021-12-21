/*! Copyright TXPCo, 2020, 2021 */

// React
import * as React from 'react';
import axios from 'axios';

// Fluent-UI
import { Provider, Image, Flex, FlexItem, teamsTheme, mergeThemes, Avatar, AcceptIcon, MenuButton } from '@fluentui/react-northstar';

// Local App 
import { appThemeDark } from './Theme';

import { EAppUrls } from '../../apisrv/src/AppUrls';
import { EAuthUrls } from '../../apisrv/src/AuthUrls';
import { PersonaDetails } from '../../core/src/Persona';

export interface INavbarProps {

   personaDetails: PersonaDetails;
}

interface INavbarState {

   personaDetails: PersonaDetails;
}


export class Navbar extends React.Component<INavbarProps, INavbarState> {

   _personaDetails: PersonaDetails;

   constructor(props: INavbarProps) {
      super(props);

      this._personaDetails = props.personaDetails;

      this.state = {
         personaDetails: this._personaDetails
      };
   }

   navigateToHome(): void {

      window.location.href = '/';
   }   

   navigateToCohorts(): void {

      window.location.href = EAppUrls.Cohorts;
   }   

   signOut (): void {

      var response = axios.put (EAuthUrls.GoogleLogout, { logout: true });
      response.then(response => {
         window.location.href = EAppUrls.Login;
      });
   }  

   render() {
      return (
         <div>
            <Provider theme={mergeThemes(teamsTheme, appThemeDark)}>
               <Flex gap="gap.medium" vAlign="center" padding="padding.medium">
                  <Image src="/assets/img/tesseract.png" width="32" height="32" alt="UltraBox Home" title="UltraBox Home"
                  onClick={this.navigateToHome.bind(this)}                  />
                  <FlexItem push> 
                     <Avatar
                        image={this._personaDetails.thumbnailUrl}
                        label={this._personaDetails.name}
                        name={this._personaDetails.name}
                        size="small"
                        status={{
                           color: 'green',
                           icon: <AcceptIcon />,
                           title: 'Available',
                        }}
                     />
                  </FlexItem>
                  <Image src="/assets/img/chat-multi-w-512x512.png" width="32" height="32" alt="Squads" title="Squads"
                     onClick={this.navigateToCohorts.bind(this)} />
                  <Image src="/assets/img/signout-w-512x512.png" width="32" height="32" alt="Sign out" title="Sign out"
                     onClick={this.signOut.bind(this)} />
               </Flex>
            </Provider>
         </div>);
   }
}


