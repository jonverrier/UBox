/*! Copyright TXPCo, 2020, 2021 */

// React
import * as React from 'react';

// Fluent-UI
import { Flex } from '@fluentui/react-northstar';

import { Persona } from '../../core/src/Persona';
import { PersonCohorts } from '../../core/src/PersonCohorts';
import { PersonApiFromSession } from '../../apisrv/src/PersonApi';

import { Navbar } from './Navbar';
import { CohortChat } from './CohortChat';

export interface ICohortPageProps {
   personaCohorts: PersonCohorts;
   onSignIn: (persona: Persona) => void;
}

interface ICohortPageState {
}

export class CohortPage extends React.Component<ICohortPageProps, ICohortPageState> {
   private _mySessionPersonApi: PersonApiFromSession; 

   constructor(props: ICohortPageProps) {
      super(props);

      this.state = {};

      var url: string = window.location.origin;
      this._mySessionPersonApi = new PersonApiFromSession(url);
   }

   componentDidMount() {
      // Pull back the user asscoated with our session
      var result = this._mySessionPersonApi.loadOne();

      result.then(person => {
         this.props.onSignIn(person);
      });

      // TODO - pull back cohort data per the passed key in URL
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