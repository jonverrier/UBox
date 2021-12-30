/*! Copyright TXPCo, 2020, 2021 */

// React
import * as React from 'react';

// Fluent-UI
import { Flex, Text, Avatar, Card, AcceptIcon, Button, ButtonProps} from '@fluentui/react-northstar';

// Local App 
import { Persona } from '../../core/src/Persona';

export interface ICohortCardProps {

   persona: Persona;
   key: number;
   onOpenCohort: (key: string) => void;
}

interface ICohortCardState {

}

export class CohortCard extends React.Component<ICohortCardProps, ICohortCardState> {

   constructor(props: ICohortCardProps) {
      super(props);

      this.state = {};
   }

   onOpenCohort(event: React.SyntheticEvent<HTMLElement>, data?: ButtonProps): void {

      this.props.onOpenCohort(this.props.persona.persistenceDetails.key);
   }

   render(): JSX.Element {
      return (
         <Card aria-roledescription="card avatar" fluid={true}>
            <Card.Header>
               <Flex gap="gap.medium">
                  <Avatar
                     image={this.props.persona.personaDetails.thumbnailUrl}
                     label={this.props.persona.personaDetails.name}
                     name={this.props.persona.personaDetails.name}
                     size="larger"
                     status={{
                        color: 'green',
                        icon: <AcceptIcon />,
                        title: 'Available',
                     }}
                  />
                  <Flex gap="gap.medium" column vAlign="center" >
                     <Text content={this.props.persona.personaDetails.name} weight="bold" size="medium" />
                  </Flex>
               </Flex>
            </Card.Header>
            <Card.Body>
               <Flex column gap="gap.medium">
                  <Text content={this.props.persona.personaDetails.bio} size="medium" />
               </Flex>
            </Card.Body>
            <Card.Footer>
               <Flex column gap="gap.medium" space="between">
                  <Button content="Open" onClick={ this.onOpenCohort.bind(this) }/>
               </Flex>
            </Card.Footer>
         </Card>);
   }
}

export default CohortCard;


