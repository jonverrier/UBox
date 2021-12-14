/*! Copyright TXPCo, 2020, 2021 */

// Core React
import * as React from 'react';

import { Image, Flex, FlexItem } from '@fluentui/react-northstar';
//import { AttendeeIcon, ChatIcon } from '@fluentui/react-icons-northstar'

export class Navbar extends React.Component {
   render() {
      return (
         <div>
            <Flex gap="gap.medium" vAlign="center" padding="padding.medium">
               <Image src="assets/img/tesseract.png" width="32" height="32" alt="UltraBox Home" />
               <FlexItem push> 
                  <Image src="assets/img/chat-multi-w-512x512.png" width="32" height="32" alt="Active squads" title="Active squads"/>
               </FlexItem>
               <Image src="assets/img/chat-w-512x512.png" width="32" height="32" alt="Olmpic Lifting" title="Olympic Lifting"/>
            </Flex>
         </div>);
   }
}


