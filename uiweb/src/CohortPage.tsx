/*! Copyright TXPCo, 2020, 2021 */

// React
import * as React from 'react';

// Fluent-UI
import { Flex } from '@fluentui/react-northstar';

import { Measurement } from '../../core/src/Observation';
import { Business } from '../../core/src/Business';
import { SessionPresenter } from '../../core/src/SessionPresenter';
import { CohortsPresenter } from '../../core/src/CohortsPresenter';
import { CohortsPresenterApiFromSession } from '../../apisrv/src/CohortsPresenterApi';
import { CohortMeasurementApi } from '../../apisrv/src/ObservationApi';
import { CohortApi } from '../../apisrv/src/CohortApi';

import { Navbar } from './Navbar';
import { CohortChat } from './CohortChat';
import { EApiUrls } from '../../apisrv/src/ApiUrls';

export interface ICohortPageProps {
   presenter: SessionPresenter;
   onSignIn: (presenter: SessionPresenter) => void;
}

interface ICohortPageState {
   business: Business | null;
   measurements: Array<Measurement>;
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
   private _mySessionPresenterApi: CohortsPresenterApiFromSession; 
   private _myCohortMeasurementApi: CohortMeasurementApi;
   private _myCohortApi: CohortApi;

   constructor(props: ICohortPageProps) {
      super(props);

      this.state = { business: null, measurements: new Array <Measurement>() };

      var url: string = window.location.origin;
      this._mySessionPresenterApi = new CohortsPresenterApiFromSession(url);
      this._myCohortMeasurementApi = new CohortMeasurementApi(url);
      this._myCohortApi = new CohortApi(url);
   }

   componentDidMount() {
      // Pull back the user asscoated with our session
      var result = this._mySessionPresenterApi.loadOne(null);

      result.then(presenter => {
         this.props.onSignIn(presenter);

         let searchString = window.location.search;
         if (searchString.length <= 1)
            return;

         let paramString = searchString.substring(1);
         let params = parseQueryString(paramString);

         var key: string = params[EApiUrls.Key];
         if (!key)
            return;

         let cohortPromise = this._myCohortApi.loadOne(key);
         let measurementsPromise = this._myCohortMeasurementApi.loadMany(key);

         cohortPromise.then(cohort => {
            measurementsPromise.then(measurements => {
               this.setState({ business: cohort.business, measurements: measurements });
            })
         });
      });
   }

   render(): JSX.Element {

      return (
         <div>
            <Navbar persona={(this.props.presenter.persona)} />
            <Flex gap="gap.medium" column={true}>
               <CohortChat business={ this.state.business} measurements={this.state.measurements}></CohortChat>
            </Flex>
         </div>);

   }
}