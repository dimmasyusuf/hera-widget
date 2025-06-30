import React, { useState } from "react";
import ChatRow from "../../components/chat-row";
import useConfig from "../../hooks/useConfig";

type AgreementChatProps = {
  isDisabled?: boolean;
  onChange?: (value: boolean) => void;
  defaultValue?: "agree" | "disagree";
};

function AgreementChat(props: AgreementChatProps) {
  const { onChange, isDisabled, defaultValue } = props;
  const {
    agreement,
    agreement_text,
    disagree_text,
    agree_text,
    user_agree_text,
    user_disagree_text,
    agree_button_text,
    agree_button_background_color,
    agree_button_text_color,
    disagree_button_text,
    disagree_button_background_color,
    disagree_button_text_color
  } = useConfig();
  const [activeButton, setActiveButton] = useState<"agree" | "disagree" | null>(
    defaultValue || null
  );

  if (!agreement) return null;

  const handleButtonClick = (isAgree: boolean) => {
    setActiveButton(isAgree ? "agree" : "disagree");
    if (onChange) {
      onChange(isAgree);
    }
  };

  return (
    <div>
      <ChatRow
        key="greeting"
        data={{
          role: "assistant",
          message: [
            {
              type: "text",
              payload: {
                content:
                  agreement_text ||
                  "Apakah Anda menyetujui Aturan dan Kebijakan Privasi yang berlaku?"
              }
            }
          ]
        }}
        hide_feedback={true}
        hide_time={true}
      />

      <div className="heracx-flex heracx-gap-2 heracx-mt-4">
        <button
          onClick={() => handleButtonClick(true)}
          style={{
            backgroundColor: agree_button_background_color || "#546FFF",
            color: agree_button_text_color || "#FFFFFF",
            opacity: isDisabled || activeButton !== "agree" ? 0.5 : 1,
            cursor: isDisabled ? "not-allowed" : "pointer"
          }}
          className="heracx-px-3 heracx-py-2 heracx-text-xs heracx-rounded-lg heracx-inline-flex heracx-outline-none heracx-border-0 heracx-transition-all heracx-duration-300"
          disabled={isDisabled}
        >
          {agree_button_text || "Accept"}
        </button>
        <button
          onClick={() => handleButtonClick(false)}
          style={{
            backgroundColor: disagree_button_background_color || "#FF4423",
            color: disagree_button_text_color || "#ffffff",
            opacity: isDisabled || activeButton !== "disagree" ? 0.5 : 1,
            cursor: isDisabled ? "not-allowed" : "pointer"
          }}
          className="heracx-px-3 heracx-py-2 heracx-text-xs heracx-rounded-lg heracx-inline-flex heracx-outline-none heracx-border-0 heracx-transition-all heracx-duration-300"
          disabled={isDisabled}
        >
          {disagree_button_text || "Decline"}
        </button>
      </div>

      {disagree_text && activeButton === "disagree" ? (
        <div className="heracx-flex heracx-flex-col heracx-gap-3 heracx-mt-3">
          <ChatRow
            data={{
              role: "user",
              message: [
                {
                  type: "text",
                  payload: {
                    content: user_disagree_text || "Saya tidak setuju"
                  }
                }
              ]
            }}
            hide_feedback={true}
            hide_time={true}
          />
          <ChatRow
            data={{
              role: "assistant",
              message: [
                {
                  type: "text",
                  payload: {
                    content: disagree_text
                  }
                }
              ]
            }}
            hide_feedback={true}
            hide_time={true}
          />
        </div>
      ) : null}

      {agree_text && activeButton === "agree" ? (
        <div className="heracx-flex heracx-flex-col heracx-gap-3 heracx-mt-3">
          <ChatRow
            data={{
              role: "user",
              message: [
                {
                  type: "text",
                  payload: {
                    content: user_agree_text || "Saya setuju"
                  }
                }
              ]
            }}
            hide_feedback={true}
            hide_time={true}
          />
          <ChatRow
            data={{
              role: "assistant",
              message: [
                {
                  type: "text",
                  payload: {
                    content: agree_text
                  }
                }
              ]
            }}
            hide_feedback={true}
            hide_time={true}
          />
        </div>
      ) : null}
    </div>
  );
}

export default AgreementChat;
