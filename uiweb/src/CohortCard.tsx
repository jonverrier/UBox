/*! Copyright TXPCo, 2020, 2021 */

import * as React from 'react';
import { Flex, Image, Text, Header } from '@fluentui/react-northstar';

import { PersonaDetails } from '../../core/src/Persona';

export interface ICohortCardProps {

   personaDetails: PersonaDetails;
}

interface ICohortCardState {

   personaDetails: PersonaDetails;
}

export class CohortCard extends React.Component<ICohortCardProps, ICohortCardState> {

   _personaDetails: PersonaDetails;

   constructor(props: ICohortCardProps) {
      super(props);

      this._personaDetails = props.personaDetails;

      this.state = {
         personaDetails: this._personaDetails
      };
   }

   render() {
      return (
         <Flex gap="gap.medium" padding="padding.medium" debug>
            <Flex.Item size="size.medium">
               <div style={{ position: 'relative' }}>
                  <Image width="64" height="64"  src={this._personaDetails.thumbnailUrl} />
               </div>
            </Flex.Item>

            <Flex.Item grow>
               <Flex column gap="gap.small" vAlign="stretch">
                  <Flex space="between">
                     <Header as="h3" content={this._personaDetails.name} />
                  </Flex>

                  <Text content="Some content will go here." />

               </Flex>
            </Flex.Item>
         </Flex>);
   }
}

export default CohortCard;


