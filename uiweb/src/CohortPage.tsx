/*! Copyright TXPCo, 2020, 2021 */

// React
import * as React from 'react';

// Fluent-UI
import { Flex, Alert, Header } from '@fluentui/react-northstar';

// Local App
import { SessionPresenter } from '../../core/src/SessionPresenter';
import { CohortPresenter } from '../../core/src/CohortPresenter';
import { CohortPresenterApiFromSession } from '../../apisrv/src/CohortPresenterApi';

import { Navbar } from './Navbar';
import { CohortDetails } from './CohortDetails';
import { CohortChat } from './CohortChat';
import { EApiUrls } from '../../apisrv/src/ApiUrls';
import { Media } from './Media';

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
   private _media: Media;

   constructor(props: ICohortPageProps) {
      super(props);

      this.state = { presenter: null };

      var url: string = window.location.origin;
      this._mySessionPresenterApi = new CohortPresenterApiFromSession(url);
      this._media = new Media();

      this._media.addMobileFormFactorChangeListener(this.onMediaChange.bind(this));
   }

   onMediaChange(small: boolean) {
      this.forceUpdate();
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

      var small: boolean = this._media.isSmallFormFactor();

      if (! (this.state.presenter)) {
         return (
            <div>
               <Navbar persona={this.props.presenter.persona} />
               <Flex gap="gap.medium" column={true} vAlign="center" >
                  <Alert content="This squad does not have any measurements logged yet - add them below." />
               </Flex>
            </div>
         );
      }

      return (
         <div>
            <Navbar persona={(this.props.presenter.persona)} />
            <Flex gap="gap.medium" column={small} vAlign="start" hAlign="center" fill={true}>
               <Flex.Item size="size.half">
                  <Flex gap="gap.small" column={true} vAlign="start" hAlign="center" fill={true} >
                     <Header as="h2" content="Workout" />
                     <CohortDetails cohort={this.state.presenter.cohort} isAdminstrator={this.state.presenter.isAdministrator}> </CohortDetails>
                  </Flex>
               </Flex.Item>
               <Flex.Item size="size.half">
                  <Flex gap="gap.small" column={true} vAlign="start" hAlign="center" fill={true}>
                     <Header as="h2" content="Results" />
                     <CohortChat business={this.state.presenter.cohort.business} measurements={this.state.presenter.measurements}></CohortChat>
                  </Flex>
               </Flex.Item>
            </Flex>
         </div>);
   }
}