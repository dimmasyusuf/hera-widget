import ChatRow from "./chat-row";
import store from "store2";
import useConfig from "../hooks/useConfig";
import useWidgetOperation from "../hooks/useWidgetOperation";
import { getParams } from "../lib/getParams";
import useAttributeConfig from "../hooks/useAttributeConfig";

const DEFAULT_STORE_KEY = "heracx-userdata";
const DEFAULT_USER_NAME_KEY = "name";

const DEFAULT_GREETING_TEXT =
  "{{greeting}} {{user_name}}, aku {{agent_name}}, asisten yang siap membantu semua kebutuhanmu. Apa yang bisa aku bantu?";
const DEFAULT_ANONYMOUS_GREETING_TEXT =
  "{{greeting}} Kak!!! Perkenalkan aku {{agent_name}}, AI personal asisten yang selalu siap bantu kamu. Apa yang bisa aku bantu?";

const params = getParams();
const mode = params?.get("mode");

const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();

  if (hour >= 3 && hour < 12) {
    return "Selamat pagi";
  } else if (hour >= 12 && hour < 15) {
    return "Selamat siang";
  } else if (hour >= 15 && hour < 18) {
    return "Selamat sore";
  } else {
    return "Selamat malam";
  }
};

const GreetingChat = () => {
  const { agent_name, greeting_text, greeting_message } = useConfig();
  const attributes = useAttributeConfig();
  const { data } = useWidgetOperation();
  const LS_DATA = store.get(DEFAULT_STORE_KEY);
  const USER_NAME = attributes.user.identity
    ? attributes.user.data.name
    : LS_DATA?.[DEFAULT_USER_NAME_KEY] || "";

  const timeGreeting = getTimeBasedGreeting();

  const message = (
    greeting_text ||
    greeting_message ||
    (mode === "anonymous"
      ? DEFAULT_ANONYMOUS_GREETING_TEXT
      : DEFAULT_GREETING_TEXT)
  )
    .replace("{{greeting}}", timeGreeting)
    .replace("{{user_name}}", USER_NAME)
    .replace("{{agent_name}}", agent_name || data.widget?.agent.name || "N/A");

  return (
    <ChatRow
      key="greeting"
      data={{
        role: "assistant",
        message: [
          {
            type: "text",
            payload: {
              content: message
            }
          }
        ]
      }}
      hide_feedback={true}
    />
  );
};

export default GreetingChat;
