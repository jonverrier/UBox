/*! Copyright TXPCo, 2020, 2021 */

// React
import * as React from 'react';

// Fluent-UI
import { Flex, Text } from '@fluentui/react-northstar';

import { PersistenceDetails } from '../../core/src/Persistence';
import { Persona, PersonaDetails } from '../../core/src/Persona';
import { PersonCohorts } from '../../core/src/PersonCohorts';
import { PersonApiFromSession } from '../../apisrv/src/PersonApi';

// Local App 
import { Navbar } from './Navbar';
import { CohortCard } from './CohortCard';
import { EApiUrls } from '../../apisrv/src/ApiUrls';
import { EAppUrls } from '../../apisrv/src/AppUrls';

export interface ICohortsPageProps {
   personaCohorts: PersonCohorts;
   onSignIn: (persona: Persona) => void;
}

interface ICohortsPageState {
}

export class CohortsPage extends React.Component<ICohortsPageProps, ICohortsPageState> {

   private _mySessionPersonApi: PersonApiFromSession; 

   constructor(props: ICohortsPageProps) {
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
   }

   navigateToCohort(key: string): void {
      // URL for a specific cohort is to pass the key in query parameter
      window.location.href = EAppUrls.Cohort + '?' + EApiUrls.Key + '=' + key;
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
