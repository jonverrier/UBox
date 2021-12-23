/*! Copyright TXPCo, 2020, 2021 */

// React
import * as React from 'react';

// Fluent-UI
import { Flex, Text } from '@fluentui/react-northstar';

import { PersonaDetails } from '../../core/src/Persona';
import { PersonCohortsMemento } from '../../core/src/PersonCohorts';

// Local App 
import { Navbar } from './Navbar';
import { CohortCard } from './CohortCard';


export interface ICohortsPageProps {
   personaCohorts: PersonCohortsMemento;
   onSignIn: (persona: PersonaDetails) => void;
}

interface ICohortsPageState {
}

export class CohortsPage extends React.Component<ICohortsPageProps, ICohortsPageState> {


   constructor(props: ICohortsPageProps) {
      super(props);

      this.state = {};
   }

   componentDidMount() {
      var user: PersonaDetails = new PersonaDetails('Joe', '/assets/img/person-o-512x512.png');

      this.props.onSignIn(user);
   }

   listCohorts(): JSX.Element {
      let items = this.props.personaCohorts._cohorts;

      return (
         <ul>
            {
               items.map((val, index) => {
                  return (
                     <CohortCard key={index} personaDetails={new PersonaDetails(val)}></CohortCard>
                  );
               })
            }
         </ul>
      );
   }

   render(): JSX.Element {

      var length: number = this.props.personaCohorts._cohorts.length;

      if (length === 0) {
         return (
            <div>
               <Navbar personaDetails={new PersonaDetails(this.props.personaCohorts._personaDetails)} />
               <Flex gap="gap.medium" column={true}>
                  <Text content="It doesnt look like you are a member of any squads." size="medium" />
               </Flex>
            </div>
         );
      } else {
         return (
            <div>
               <Navbar personaDetails={new PersonaDetails(this.props.personaCohorts._personaDetails)} />
               <Flex gap="gap.medium" column={true}>
                  {this.listCohorts()}
               </Flex>
            </div>
         );
      }
   }
}
