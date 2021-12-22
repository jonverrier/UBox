/*! Copyright TXPCo, 2020, 2021 */

// React
import * as React from 'react';

// Fluent-UI
import { Flex } from '@fluentui/react-northstar';

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
      var user: PersonaDetails = new PersonaDetails('Joe', '/assets/img/person-w-512x512.png');

      this.props.onSignIn(user);
   }

   render() {
      return (
         <div>
            <Navbar personaDetails={new PersonaDetails(this.props.personaCohorts._personaDetails)} />
            <Flex gap="gap.medium" column={true}>
               <CohortCard personaDetails={new PersonaDetails(this.props.personaCohorts._cohorts[0])}></CohortCard>
               <CohortCard personaDetails={new PersonaDetails(this.props.personaCohorts._cohorts[1])}></CohortCard>
            </Flex>
         </div>
      );
   }
}
