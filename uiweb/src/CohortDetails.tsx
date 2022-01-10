/*! Copyright TXPCo, 2020, 2021 */

// React
import * as React from 'react';

// Fluent-UI
import { Flex, Text, Avatar, Card, AcceptIcon, Button, ButtonProps} from '@fluentui/react-northstar';

// Local App 
import { Cohort } from '../../core/src/Cohort';

export interface ICohortDetailsProps {

   cohort: Cohort;
   isAdminstrator: boolean;
}

interface ICohortDetailsState {

}

export class CohortDetails extends React.Component<ICohortDetailsProps, ICohortDetailsState> {

   constructor(props: ICohortDetailsProps) {
      super(props);


      this.state = {};
   }


   render(): JSX.Element {
      return (
         <Flex gap="gap.medium" column={true} vAlign="center" hAlign="center">
            <Text content="Cohort details go here." size="medium" />
         </Flex>);
   }
}

export default CohortDetails;


