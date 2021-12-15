/*! Copyright TXPCo, 2020, 2021 */

// React
import * as React from 'react';

// Fluent-UI
import { Provider, Image, Flex, FlexItem, teamsTheme, mergeThemes } from '@fluentui/react-northstar';

// Local App 
import { appThemeDark } from './Theme';

export class Navbar extends React.Component {

   navigateToHome(): void {

      window.location.href = '/';

   }   

   navigateToCohorts(): void {

      window.location.href = './cohorts';

   }   

   navigateToCohort (): void {

      window.location.href = './cohort';
   }  

   render() {
      return (
         <div>
            <Provider theme={mergeThemes(teamsTheme, appThemeDark)}>
               <Flex gap="gap.medium" vAlign="center" padding="padding.medium">
                  <Image src="assets/img/tesseract.png" width="32" height="32" alt="UltraBox Home" title="UltraBox Home"
                  onClick={this.navigateToHome.bind(this)}                  />
                  <FlexItem push> 
                     <Image src="assets/img/chat-multi-w-512x512.png" width="32" height="32" alt="Active squads" title="Active squads"
                        onClick={this.navigateToCohorts.bind(this)} />
                  </FlexItem>
                  <Image src="assets/img/chat-w-512x512.png" width="32" height="32" alt="Olmpic Lifting" title="Olympic Lifting"
                     onClick={this.navigateToCohort.bind(this)} />
               </Flex>
            </Provider>
         </div>);
   }
}


