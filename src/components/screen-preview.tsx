import FlexLayout from "./layout-flex";
import ChatRow from "./chat-row";
import ButtonSend from "./button-send";
import useConfig from "../hooks/useConfig";
import { useMemo } from "react";
import AgreementChat from "../modules/chat/agreement-chat";

const PreviewScreen = () => {
  const { greeting_text, greeting_message } = useConfig();

  const greetingText = useMemo(() => {
    return (
      greeting_text ||
      greeting_message ||
      "Hello, welcome to HeraCX AI! We give help you get best experience for using our product at first. Anything you need help, just asking me. Feel free.."
    );
  }, [greeting_text, greeting_message]);

  return (
    <FlexLayout direction="column" className="heracx-w-full heracx-font-normal">
      <FlexLayout auto scrollable>
        <ul className="heracx-m-0 heracx-p-6 heracx-flex heracx-flex-col heracx-space-y-8">
          <ChatRow
            data={{
              role: "assistant",
              message: [
                {
                  type: "text",
                  payload: {
                    content: greetingText
                  }
                }
              ]
            }}
          />
          <AgreementChat defaultValue="agree" isDisabled={true} />
          <ChatRow
            data={{
              role: "user",
              message: [
                {
                  type: "text",
                  payload: {
                    content:
                      "Currently, I'm using HeraCX AI and trying to integrating my agent app. Do you have any suggestions what should I do?"
                  }
                }
              ]
            }}
          />
          <ChatRow
            data={{
              role: "assistant",
              message: [
                {
                  type: "text",
                  payload: {
                    content:
                      "You can visit https://heracx.ai for more information about that. There are also documentation for developers"
                  }
                }
              ],
              reference: [
                {
                  index: "0",
                  name: "Feedloop",
                  url: "https://heracx.ai"
                }
              ]
            }}
          />
          <ChatRow
            data={{
              role: "user",
              message: [
                {
                  type: "text",
                  payload: {
                    content: "Thank you! I will visit https://heracx.ai now!"
                  }
                }
              ]
            }}
          />
          <ChatRow
            data={{
              role: "assistant",
              message: [
                {
                  type: "text",
                  payload: {
                    content: "Good Luck!"
                  }
                }
              ]
            }}
          />
        </ul>
      </FlexLayout>
      <FlexLayout
        style={{
          height: 64
        }}
        className="heracx-bg-gray-100"
      >
        <FlexLayout direction="row" className="heracx-w-full">
          <FlexLayout auto className="heracx-py-4 heracx-px-6 heracx-pr-0">
            <input
              className="heracx-font-['DM_Sans'] heracx-border-none heracx-w-full heracx-bg-transparent heracx-outline-none heracx-text-sm"
              placeholder="Write text here"
              autoComplete="off"
            />
          </FlexLayout>
          <FlexLayout className="heracx-w-20 heracx-items-center heracx-justify-center">
            <ButtonSend />
          </FlexLayout>
        </FlexLayout>
      </FlexLayout>
    </FlexLayout>
  );
};

export default PreviewScreen;
