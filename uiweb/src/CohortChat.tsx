/*! Copyright TXPCo, 2020, 2021 */

// React
import * as React from 'react';

// Fluent-UI
import { Avatar, Chat, ChatItemProps} from '@fluentui/react-northstar';
import { AcceptIcon } from '@fluentui/react-icons-northstar';

// Local App 
import { PersonaDetails, Persona} from '../../core/src/Persona';

export interface ICohortViewProps {

   persona: Persona;
}

const items: Array<ChatItemProps> = [
   {
      contentPosition: "start",
      gutter: <Avatar
         image='/assets/img/weightlifter-b-128x128.png'
         label="John"
         name="John"
         status={{
            color: 'green',
            icon: <AcceptIcon />,
            title: 'Available',
         }}
      />,
      message: <Chat.Message content="Hello" author="John Doe" timestamp="Yesterday, 10:15 PM" />
   },
   {
      contentPosition: "end",
      gutter: <Avatar
         image='/assets/img/weightlifter-b-128x128.png'
         label="Jane"
         name="Jane"
         status={{
            color: 'green',
            icon: <AcceptIcon />,
            title: 'Available',
         }}
      />,
      message: <Chat.Message content="Hi" author="Jane Doe" timestamp="Yesterday, 10:15 PM" mine />
   }
];

export class CohortChat extends React.Component<ICohortViewProps, Persona> {


   constructor(props: ICohortViewProps) {
      super(props);

      this.state =props.persona;
   }


   render(): JSX.Element {

      for (var i in items) {
         (items[i] as any).key = i;
      }

      return (
         <Chat items={items} />
         );
   }
}

export default CohortChat;


