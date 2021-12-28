/*! Copyright TXPCo, 2020, 2021 */

// React
import * as React from 'react';

// Fluent-UI
import { Flex } from '@fluentui/react-northstar';

import { PersonaDetails } from '../../core/src/Persona';
import { PersonCohorts } from '../../core/src/PersonCohorts';

import { Navbar } from './Navbar';
import { CohortChat } from './CohortChat';

export interface ICohortPageProps {
   personaCohorts: PersonCohorts;
}

interface ICohortPageState {
}

export class CohortPage extends React.Component<ICohortPageProps, ICohortPageState> {

   constructor(props: ICohortPageProps) {
      super(props);

      this.state = {};
   }

   render(): JSX.Element {
      return (
         <div>
            <Navbar persona={(this.props.personaCohorts._persona)} />
            <Flex gap="gap.medium" column={true}>
               <CohortChat persona={this.props.personaCohorts._cohorts[0]}></CohortChat>
            </Flex>
         </div>);

   }
}