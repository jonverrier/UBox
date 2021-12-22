/*! Copyright TXPCo, 2020, 2021 */

// React
import * as React from 'react';

// Fluent-UI
import { Flex } from '@fluentui/react-northstar';

import { PersonaDetails } from '../../core/src/Persona';
import { PersonCohortsMemento } from '../../core/src/PersonCohorts';

import { Navbar } from './Navbar';
import { CohortChat } from './CohortChat';

export interface ICohortPageProps {
   personaCohorts: PersonCohortsMemento;
}

interface ICohortPageState {
}

export class CohortPage extends React.Component<ICohortPageProps, ICohortPageState> {

   constructor(props: ICohortPageProps) {
      super(props);

      this.state = {};
   }

   render() {
      return (
         <div>
            <Navbar personaDetails={new PersonaDetails(this.props.personaCohorts._personaDetails)} />
            <Flex gap="gap.medium" column={true}>
               <CohortChat personaDetails={new PersonaDetails(this.props.personaCohorts._cohorts[0])}></CohortChat>
            </Flex>
         </div>);

   }
}