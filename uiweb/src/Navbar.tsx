/*! Copyright TXPCo, 2020, 2021 */

// Core React
import * as React from 'react';

import { Provider, Image, Flex, FlexItem, teamsTheme, mergeThemes } from '@fluentui/react-northstar';
import { appThemeDark } from './Theme';

export class Navbar extends React.Component {
   render() {
      return (
         <div>
            <Provider theme={mergeThemes(teamsTheme, appThemeDark)}>
               <Flex gap="gap.medium" vAlign="center" padding="padding.medium">
                  <Image src="assets/img/tesseract.png" width="32" height="32" alt="UltraBox Home" />
                  <FlexItem push> 
                     <Image src="assets/img/chat-multi-w-512x512.png" width="32" height="32" alt="Active squads" title="Active squads"/>
                  </FlexItem>
                  <Image src="assets/img/chat-w-512x512.png" width="32" height="32" alt="Olmpic Lifting" title="Olympic Lifting"/>
               </Flex>
            </Provider>
         </div>);
   }
}


