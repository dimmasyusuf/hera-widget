"use client";

import { Message } from "../../api/type";
import { TextRenderer } from "./text-renderer";

type Props = {
  content: Message;
  isLoading?: boolean;
  isLast?: boolean;
};

export const TextChatBubble = (props: Props) => {
  return (
    <TextRenderer
      text={props.content.payload.content as string}
      isSuccess={true}
      last_item={props.isLast}
    />
  );
};
