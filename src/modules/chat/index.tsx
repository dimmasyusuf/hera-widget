import { TextChatBubble } from "./text-chat";
import { TableChat } from "./table-chat";
import { StepsChat } from "./steps-chat";
import FeedbackChat from "./feedback-chat";
import ImageChat from "./image-chat";
import DocumentChat from "./document-chat";

export const ChatMap: Record<string, (props: any) => JSX.Element> = {
  text: TextChatBubble,
  table: TableChat,
  step_process: StepsChat,
  steps: StepsChat,
  feedback_chat: FeedbackChat,
  image: ImageChat,
  document: DocumentChat
};
