/*! Copyright TXPCo, 2020, 2021 */

// React
import * as React from 'react';

// Fluent-UI
import { Flex, Alert } from '@fluentui/react-northstar';

// Local App
import { Measurement } from '../../core/src/Observation';
import { SessionPresenter } from '../../core/src/SessionPresenter';
import { CohortPresenter } from '../../core/src/CohortPresenter';
import { CohortPresenterApiFromSession } from '../../apisrv/src/CohortPresenterApi';

import { Navbar } from './Navbar';
import { CohortChat } from './CohortChat';
import { EApiUrls } from '../../apisrv/src/ApiUrls';

export interface ICohortPageProps {
   presenter: SessionPresenter;
   onSignIn: (presenter: SessionPresenter) => void;
}

interface ICohortPageState {
   presenter: CohortPresenter;
}

function parseQueryString (queryString: string) : any {
   var params = {}, queries, temp, i, l;

   // Split into key/value pairs
   queries = queryString.split("&");

   // Convert the array of strings into an object
   for (i = 0, l = queries.length; i < l; i++) {
      temp = queries[i].split('=');
      params[temp[0]] = temp[1];
   }

   return params;
};

export class CohortPage extends React.Component<ICohortPageProps, ICohortPageState> {
   private _mySessionPresenterApi: CohortPresenterApiFromSession; 

   constructor(props: ICohortPageProps) {
      super(props);

      this.state = { presenter: null };

      var url: string = window.location.origin;
      this._mySessionPresenterApi = new CohortPresenterApiFromSession(url);

   }

   componentDidMount() {

      let searchString = window.location.search;
      if (searchString.length <= 1)
         return;

      let paramString = searchString.substring(1);
      let params = parseQueryString(paramString);

      var key: string = params[EApiUrls.Key];
      if (!key)
         return;

      let presenterPromise = this._mySessionPresenterApi.loadOne(key);

      presenterPromise.then(presenter => {
            
         this.setState({ presenter: presenter });
         this.props.onSignIn(presenter);
      });
   }

   render(): JSX.Element {

      var length: number = this.state.presenter ? this.state.presenter.measurements.length : 0;

      if (length === 0) {
         return (
            <div>
               <Navbar persona={this.props.presenter.persona} />
               <Flex gap="gap.medium" column={true} vAlign="center" >
                  <Alert content="This squad does not have any measurements logged yet - add them below." />
               </Flex>
            </div>
         );
      } else {

         return (
            <div>
               <Navbar persona={(this.props.presenter.persona)} />
               <Flex gap="gap.medium" column={true}>
                  <CohortChat business={this.state.presenter.cohort.business} measurements={this.state.presenter.measurements}></CohortChat>
               </Flex>
            </div>);

      }
   }
}