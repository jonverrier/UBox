/*! Copyright TXPCo, 2020, 2021 */

// React
import * as React from 'react';

// Fluent-UI
import { Flex, Text } from '@fluentui/react-northstar';

import { PersistenceDetails } from '../../core/src/Persistence';
import { Persona, PersonaDetails } from '../../core/src/Persona';
import { PersonCohorts } from '../../core/src/PersonCohorts';

// Local App 
import { Navbar } from './Navbar';
import { CohortCard } from './CohortCard';
import { EAppUrls } from '../../apisrv/src/AppUrls';

export interface ICohortsPageProps {
   personaCohorts: PersonCohorts;
   onSignIn: (persona: Persona) => void;
}

interface ICohortsPageState {
}

export class CohortsPage extends React.Component<ICohortsPageProps, ICohortsPageState> {


   constructor(props: ICohortsPageProps) {
      super(props);

      this.state = {};
   }

   componentDidMount() {
      // TODO - replace with query of actual user
      var user: PersonaDetails = new PersonaDetails('Joe', '/assets/img/person-o-512x512.png');

      this.props.onSignIn(new Persona (PersistenceDetails.newPersistenceDetails(), user));
   }

   navigateToCohort(key: string): void {
      // URL for a specific cohort is to pass the key in query parameter
      window.location.href = EAppUrls.Cohort + '?key=' + key;
}

   listCohorts(): JSX.Element {
      let items = this.props.personaCohorts._cohorts;

      return (
         <ul>
            {
               items.map((val, index) => {
                  return (
                     <CohortCard key={index} persona={val} onOpenCohort={this.navigateToCohort.bind(this)}></CohortCard>
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
               <Navbar persona={this.props.personaCohorts._persona} />
               <Flex gap="gap.medium" column={true}>
                  <Text content="It doesnt look like you are a member of any squads." size="medium" />
               </Flex>
            </div>
         );
      } else {
         return (
            <div>
               <Navbar persona={this.props.personaCohorts._persona} />
               <Flex gap="gap.medium" column={true}>
                  {this.listCohorts()}
               </Flex>
            </div>
         );
      }
   }
}
