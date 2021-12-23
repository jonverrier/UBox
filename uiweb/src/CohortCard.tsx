/*! Copyright TXPCo, 2020, 2021 */

// React
import * as React from 'react';

// Fluent-UI
import { Flex, Text, Avatar, Card, AcceptIcon, Button} from '@fluentui/react-northstar';

// Local App 
import { PersonaDetails } from '../../core/src/Persona';

export interface ICohortCardProps {

   personaDetails: PersonaDetails;
   key: number;
}

interface ICohortCardState {

}

export class CohortCard extends React.Component<ICohortCardProps, ICohortCardState> {

   constructor(props: ICohortCardProps) {
      super(props);

      this.state = {};
   }

   render(): JSX.Element {
      return (
         <Card aria-roledescription="card avatar" fluid={true}>
            <Card.Header>
               <Flex gap="gap.medium">
                  <Avatar
                     image={this.props.personaDetails.thumbnailUrl}
                     label={this.props.personaDetails.name}
                     name={this.props.personaDetails.name}
                     size="larger"
                     status={{
                        color: 'green',
                        icon: <AcceptIcon />,
                        title: 'Available',
                     }}
                  />
                  <Flex gap="gap.medium" column vAlign="center" >
                     <Text content={this.props.personaDetails.name} weight="bold" size="medium" />
                  </Flex>
               </Flex>
            </Card.Header>
            <Card.Body>
               <Flex column gap="gap.medium">
                  <Text content="Olympic lifting squad, Feb-May 2022" size="medium" />
               </Flex>
            </Card.Body>
            <Card.Footer>
               <Flex column gap="gap.medium" space="between">
                  <Button content="Open" />
               </Flex>
            </Card.Footer>
         </Card>);
   }
}

export default CohortCard;


