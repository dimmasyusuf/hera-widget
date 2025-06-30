"use client";

import { Message } from "../../api/type";
import FeedbackComponent from "../../components/feedback";
import { TextRenderer } from "./text-renderer";

type Props = {
  content: Message;
  isLoading?: boolean;
  isLast?: boolean;
  convo_id?: string;
  last_chat_id?: string;
};

const FeedbackChat = (props: Props) => {
  return (
    <div className="heracx-flex heracx-flex-col">
      <TextRenderer
        text={props.content.payload.content as string}
        isSuccess={true}
        last_item={props.isLast}
      />
      {!!props?.convo_id && !!props?.last_chat_id ? (
        <FeedbackComponent
          convo_id={props?.convo_id}
          last_chat_id={props?.last_chat_id}
        />
      ) : null}
    </div>
  );
};

export default FeedbackChat;
