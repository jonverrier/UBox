/*! Copyright TXPCo, 2020, 2021 */

// React
import * as React from 'react';

// Fluent-UI
import { Flex, Text, Avatar, Card, AcceptIcon, Button, ButtonProps} from '@fluentui/react-northstar';

// Local App 
import { Cohort } from '../../core/src/Cohort';

export interface ICohortAddMeasurementProps {

   cohort: Cohort;
   isAdminstrator: boolean;
}

interface ICohortAddMeasurementState {

}

export class CohortAddMeasurement extends React.Component<ICohortAddMeasurementProps, ICohortAddMeasurementState> {

   constructor(props: ICohortAddMeasurementProps) {
      super(props);


      this.state = {};
   }


   render(): JSX.Element {
      return (
         <Flex gap="gap.medium" column={true} vAlign="center" hAlign="center">
            <Text content="Add measurement goes here." size="medium" />
         </Flex>);
   }
}

export default CohortAddMeasurement;


