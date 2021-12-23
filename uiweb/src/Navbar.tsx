/*! Copyright TXPCo, 2020, 2021 */

// React
import * as React from 'react';
import axios from 'axios';

// Fluent-UI
import { Provider, Image, Flex, FlexItem, teamsTheme, mergeThemes, Avatar, AcceptIcon, BanIcon, Button } from '@fluentui/react-northstar';

// Local App 
import { appThemeDark } from './Theme';

import { EAppUrls } from '../../apisrv/src/AppUrls';
import { EAuthUrls } from '../../apisrv/src/AuthUrls';
import { PersonaDetails } from '../../core/src/Persona';

export interface INavbarProps {

   personaDetails: PersonaDetails;
}

interface INavbarState {

}

export class Navbar extends React.Component<INavbarProps, INavbarState> {

   constructor(props: INavbarProps) {
      super(props);

      this.state = {};
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

   render() : JSX.Element {

      var statusAvatar;
      var signedIn: Boolean = !PersonaDetails.isNotLoggedIn(this.props.personaDetails);

      if (signedIn) {

         statusAvatar = <Avatar
            image={this.props.personaDetails.thumbnailUrl}
            label={this.props.personaDetails.name}
            name={this.props.personaDetails.name}
            size="small"
            status={{
               color: 'green',
               icon: <AcceptIcon />,
               title: 'Available'
            }}
         />;

      } else {

         statusAvatar = <Avatar
            image={this.props.personaDetails.thumbnailUrl}
            label={this.props.personaDetails.name}
            name={this.props.personaDetails.name}
            size="small"
            status={{
               color: 'grey',
               icon: <BanIcon />,
               title: 'Not available'
            }}
         />;

      }

      return  (
         <div>
            <Provider theme={mergeThemes(teamsTheme, appThemeDark)}>
               <Flex gap="gap.medium" vAlign="center" padding="padding.medium">
                  <Image src="/assets/img/tesseract.png" width="32" height="32" alt="UltraBox Home" title="UltraBox Home"
                  onClick={this.navigateToHome.bind(this)}                  />
                  <FlexItem push> 
                     {statusAvatar}
                  </FlexItem>
                  <Button content={
                     <Image src="/assets/img/chat-multi-o-512x512.png" width="32" height="32" alt="Squads" />}
                     iconOnly title="Squads" onClick={this.navigateToCohorts.bind(this)} disabled={!signedIn}/>
                  <Button content={
                     <Image src="/assets/img/signout-o-512x512.png" width="32" height="32" alt="Sign out" />}
                     iconOnly title="Sign out" onClick={this.signOut.bind(this)} disabled={!signedIn}/>
               </Flex>
            </Provider>
         </div>);
   }
}


