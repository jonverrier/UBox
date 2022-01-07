/*! Copyright TXPCo, 2020, 2021 */

// React
import * as React from 'react';

// Fluent-UI
import { Flex, Alert } from '@fluentui/react-northstar';

// Local App 
import { CohortsPresenter } from '../../core/src/CohortsPresenter';
import { CohortsPresenterApiFromSession } from '../../apisrv/src/CohortsPresenterApi';
import { Navbar } from './Navbar';
import { CohortCard } from './CohortCard';

import { EApiUrls } from '../../apisrv/src/ApiUrls';
import { EAppUrls } from '../../apisrv/src/AppUrls';

export interface ICohortsPageProps {
   presenter: CohortsPresenter;
   onSignIn: (presenter: CohortsPresenter) => void;
}

interface ICohortsPageState {
}

export class CohortsPage extends React.Component<ICohortsPageProps, ICohortsPageState> {

   private _mySessionPresenterApi: CohortsPresenterApiFromSession; 

   constructor(props: ICohortsPageProps) {
      super(props);

      this.state = {};

      var url: string = window.location.origin;
      this._mySessionPresenterApi = new CohortsPresenterApiFromSession(url);
   }

   componentDidMount() {
      // Pull back the user + their cohorts asscoated with our session
      var result = this._mySessionPresenterApi.loadOne(null);

      result.then(presenter => {
         this.props.onSignIn(presenter);
      });
   }

   navigateToCohort(key: string): void {
      // URL for a specific cohort is to pass the key in query parameter
      window.location.href = EAppUrls.Cohort + '?' + EApiUrls.Key + '=' + key;
   }

   listCohorts(): JSX.Element {
      let items = this.props.presenter.cohorts;

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

      var length: number = this.props.presenter.cohorts.length;

      if (length === 0) {
         return (
            <div>
               <Navbar persona={this.props.presenter.persona} />
               <Flex gap="gap.medium" column={true} vAlign="center" >
                  <Alert content="It doesnt look like you are a member of any squads. If you are a gym owner, you can contact us from the home page." />
               </Flex>
            </div>
         );
      } else {
         return (
            <div>
               <Navbar persona={this.props.presenter.persona} />
               <Flex gap="gap.medium" column={true}>
                  {this.listCohorts()}
               </Flex>
            </div>
         );
      }
   }
}
