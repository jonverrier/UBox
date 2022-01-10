/*! Copyright TXPCo, 2020, 2021 */

// React
import * as React from 'react';

// Fluent-UI
import { Avatar, Chat, ChatItemProps} from '@fluentui/react-northstar';
import { QuestionCircleIcon } from '@fluentui/react-icons-northstar';

// Local App 
import { Measurement } from '../../core/src/Observation';
import { Business } from '../../core/src/Business';
import { MeasurementFormatter } from '../../core/src/LocaleFormatters';

export interface ICohortViewProps {

   business: Business | null;
   measurements: Array<Measurement>; 
}

export interface ICohortViewState {

}

export class CohortChat extends React.Component<ICohortViewProps, ICohortViewState> {


   constructor(props: ICohortViewProps) {
      super(props);

      this.state = {};
   }

   render(): JSX.Element {

      var chatItems: Array<ChatItemProps> = new Array<ChatItemProps>();
      var formatter: MeasurementFormatter = new MeasurementFormatter();

      for (var i in this.props.measurements) {
         let formatted = formatter.format(this.props.measurements[i], this.props.business);

         var item = {
            contentPosition: 'start',
            gutter: <Avatar
               image={formatted.persona.thumbnailUrl}
               label={formatted.persona.name}
               name={formatted.persona.name}
               status={{
                  color: 'grey',
                  icon: <QuestionCircleIcon />,
                  title: 'Unknown',
               }}
            />,
            message: <Chat.Message content={formatted.measurement} author={formatted.persona.name} timestamp={formatted.timestamp} />,
            key: i
         };

         (chatItems as any).push(item);
      }

      return (
         <Chat items={chatItems} styles={{width: "100%"}}/>
         );
   }
}

export default CohortChat;


