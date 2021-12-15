/*! Copyright TXPCo, 2020, 2021 */

import * as React from 'react';
import { Flex, Text, Avatar, Card, AcceptIcon} from '@fluentui/react-northstar';

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
         <Card aria-roledescription="card avatar">
            <Card.Header fitted>
               <Flex gap="gap.medium">
                  <Avatar
                     image={this._personaDetails.thumbnailUrl}
                     label={this._personaDetails.name}
                     name={this._personaDetails.name}
                     size="larger"
                     status={{
                        color: 'green',
                        icon: <AcceptIcon />,
                        title: 'Available',
                     }}
                  />
                  <Flex gap="gap.medium" column>
                     <Text content={this._personaDetails.name} weight="bold" size="medium" />
                     <Text content="Olympic lifting squad, Feb-May 2022" size="medium" />
                  </Flex>
               </Flex>
             </Card.Header>
         </Card>);
   }
}

export default CohortCard;


