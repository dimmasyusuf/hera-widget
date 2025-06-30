import React, { useMemo, useState, useEffect } from "react";
import { Chat, Message } from "../api/type";
import { classNames, safeJSONParse, addParamsToUrl } from "../lib/helper";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import { PulseLoader } from "react-spinners";
import Linkify from "linkify-react";
import useConfig from "../hooks/useConfig";
import ChatCitation from "./chat-citation";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/solid";
import { getDownloadFileToken } from "../api/convo";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import FeedbackComponent from "./feedback";
import { HandThumbUpIcon, HandThumbDownIcon } from "@heroicons/react/24/solid";
import FeedbackInput from "./feedback-input";
import rehypeRaw from "rehype-raw";
import { ChatMap } from "../modules/chat";
import useWidgetOperation from "../hooks/useWidgetOperation";
import ChatRowHeader from "./chat-row-header";
import FilePreview from "./file-preview/file-preview";
import StarIcon from "../assets/icons/star-icon";
import { motion } from "motion/react";

dayjs.extend(isToday);
dayjs.extend(isYesterday);

type Props = {
  loading?: boolean;
  data?: Partial<Chat>;
  convo_id?: string;
  last_chat_id?: string;
  hide_feedback?: boolean;
  hide_time?: boolean;
  is_streaming?: boolean;
  index?: number;
};

const ChatRow = (props: Props) => {
  const { data: dataWidget } = useWidgetOperation();

  const {
    accent_color,
    citation,
    feedback_reaction,
    assistant_chat_background_color,
    user_chat_background_color,
    user_chat_text_color,
    assistant_chat_text_color,
    image_upload,
    document_upload,
    secondary_text_color,
    primary_text_color,
    button_bg_color,
    border_color,
    highlight_text_color,
  } = useConfig();

  const isFileUpload = useMemo(() => {
    if (image_upload || document_upload) {
      return true;
    }
    return false;
  }, [image_upload, document_upload]);
  const showCitation = React.useMemo(() => citation !== false, [citation]);
  const chat = props.data;
  const isAssistant = chat?.role === "assistant";
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isHasFeedback, setIsHasFeedback] = useState<boolean>(false);
  const [feebackType, setFeebackType] = useState<"Good" | "Bad" | null>();
  const isLoading = props.loading;
  const isLastChatStreaming = useMemo(() => {
    return props?.is_streaming && props?.last_chat_id === props?.data?.id;
  }, [props?.is_streaming, props?.last_chat_id, props?.data]);

  const date = React.useMemo(() => {
    const cur = dayjs(chat?.created_at);
    const time = dayjs(chat?.created_at).format("HH:mm");
    if (cur.isToday()) return `Today ${time}`;
    if (cur.isYesterday()) return `Yesterday ${time}`;
    return dayjs(chat?.created_at).format("MMM, DD HH:mm");
  }, [chat?.created_at]);

  const handleShowFeedback = (data: { feebackType: "Good" | "Bad" }) => {
    setShowFeedback(true);
    setFeebackType(data.feebackType);
  };

  const parsedContent = useMemo(() => {
    if (typeof chat?.message === "string" && chat?.message?.includes("[{")) {
      const chatMessage = safeJSONParse<Message[]>({
        value: chat?.message as string,
      });

      if (Array.isArray(chatMessage)) {
        return chatMessage;
      } else {
        return [{ type: "text", payload: { content: chat?.message || "" } }];
      }
    } else if (Array.isArray(chat?.message)) {
      return chat?.message as Message[];
    } else {
      return [
        {
          type: chat?.type || "text",
          payload: { content: chat?.message || "" },
        },
      ];
    }
  }, [chat]);

  const handleOpenLink = async (url: string) => {
    try {
      const tokenizedUrl = addParamsToUrl(url, {
        token:
          "WFtdcXcrsyO0vL3zVuC4nVfGabuExqmxpWRiqIshvCQkQoBxqbqm9NWm3fa4Zqqc",
      });

      // Open the tokenized URL in a new tab
      window.open(tokenizedUrl, "_blank");
    } catch (error) {
      console.error("Failed to fetch the download token:", error);
      // Handle error if needed
    }
  };

  const isFeedback = chat?.type === "feedback_chat";
  const isHideFeedback = props.hide_feedback;

  const isPerChatFeedback = useMemo(() => {
    return (
      !isHideFeedback &&
      isAssistant &&
      !isLoading &&
      !isFeedback &&
      !isHasFeedback &&
      feedback_reaction
    );
  }, [
    isHideFeedback,
    isAssistant,
    isLoading,
    isFeedback,
    isHasFeedback,
    feedback_reaction,
  ]);

  const isShowFeedbackChat = useMemo(() => {
    return chat?.id && showFeedback && props.convo_id;
  }, [chat, showFeedback, props.convo_id]);

  const isShowDate = useMemo(() => {
    if (!!props?.hide_time) return false;
    if (isAssistant) {
      return isAssistant || isLoading;
    }
    return true;
  }, [isAssistant, isLoading, props?.hide_time]);

  const isLoadingNonSrap = useMemo(() => {
    if (!isAssistant) return false;
    return isLastChatStreaming && !isLoading;
  }, [isLastChatStreaming, isLoading, isAssistant]);

  const isStepChat = useMemo(() => {
    return parsedContent.some((item) =>
      ["steps", "step_process"].includes(item.type),
    );
  }, [parsedContent]);

  const [starColor, setStarColor] = useState(secondary_text_color || "#8E92BC");

  useEffect(() => {
    if (!isLoading) {
      setStarColor(secondary_text_color || "#8E92BC");
      const timeout = setTimeout(() => {
        setStarColor("#FFC73A");
      }, 700);
      return () => clearTimeout(timeout);
    }
  }, [isLoading, secondary_text_color]);

  return (
    <>
      <li
        className={classNames(
          "heracx-group heracx-relative heracx-flex heracx-flex-col", // added heracx-group to track hover
          isAssistant ? "heracx-items-start" : "heracx-items-end",
        )}
      >
        {isFileUpload && (
          <>{props.data?.file && <FilePreview file={props.data?.file} />}</>
        )}

        <div
          className={classNames(
            "heracx-flex heracx-w-[85%] heracx-flex-col heracx-gap-1",
            isAssistant ? "heracx-items-start" : "heracx-items-end",
          )}
        >
          {isStepChat ? (
            <>
              {parsedContent?.map((c, i) => {
                const ChatComponent = ChatMap[c.type] || ChatMap["text"];

                console.log("ChatComponent", ChatComponent);

                console.log(parsedContent);

                return (
                  <ChatComponent
                    key={i}
                    content={c}
                    convo_id={props.convo_id || ""}
                    last_chat_id={props.last_chat_id || ""}
                    chat_id={chat?.id || ""}
                    is_streaming={props.is_streaming}
                  />
                );
              })}
            </>
          ) : (
            <>
              {!isLoading && isAssistant && (props.index ?? 0) > 0 && (
                <div className="heracx-mb-1 heracx-flex heracx-w-full heracx-items-center heracx-gap-1.5">
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5 },
                    }}
                  >
                    <motion.span
                      animate={{ color: starColor }}
                      transition={{ duration: 0.3 }}
                      style={{ display: "inline-flex" }}
                    >
                      <StarIcon color={starColor} />
                    </motion.span>
                  </motion.div>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: { duration: 0.5, delay: 0.2 },
                    }}
                    className="heracx-text-xs heracx-font-medium"
                    style={{ color: secondary_text_color || "#8E92BC" }}
                  >
                    Action taken: Freeze Credit Card
                  </motion.span>
                </div>
              )}

              <div
                className={classNames(
                  "heracx-relative heracx-box-border heracx-space-y-2 heracx-px-5 heracx-py-2.5",
                  !isLoading && isAssistant && "heracx-w-full",
                  isLoading && "heracx-w-fit",
                  // !isAssistant && isLoading && "heracx-opacity-20",
                  // Default classes if no custom colors are provided
                  isAssistant
                    ? "heracx-rounded-e-[16px] heracx-rounded-tl-[16px]"
                    : "heracx-rounded-s-[16px] heracx-rounded-br-[16px]",
                )}
                style={{
                  background: isAssistant
                    ? assistant_chat_background_color || "transparent"
                    : user_chat_background_color || "#3369FF",
                  color: isAssistant
                    ? assistant_chat_text_color || "#141522"
                    : user_chat_text_color || "#FFFFFF",
                  borderWidth:
                    isAssistant && !assistant_chat_background_color ? 1 : 0,
                  borderStyle: "solid",
                  borderColor:
                    (isAssistant && !assistant_chat_background_color) ||
                    (!isAssistant && !user_chat_background_color)
                      ? border_color || "#DCE4FF"
                      : "none",
                }}
              >
                <ChatRowHeader chat={chat} />
                {isAssistant && isLoading ? (
                  <PulseLoader size={8} color={accent_color || "#546FFF"} />
                ) : (
                  <div>
                    {parsedContent?.map((c, i) => {
                      const ChatComponent = ChatMap[c.type] || ChatMap["text"];
                      return (
                        <ChatComponent
                          key={i}
                          content={c}
                          convo_id={props.convo_id || ""}
                          last_chat_id={props.last_chat_id || ""}
                        />
                      );
                    })}

                    {isLoadingNonSrap ? (
                      <PulseLoader size={8} color={accent_color || "#546FFF"} />
                    ) : null}

                    {isShowFeedbackChat && feebackType ? (
                      <FeedbackInput
                        convo_id={props.convo_id || ""}
                        chat_id={chat?.id || ""}
                        feebackType={feebackType}
                        onCancel={() => {
                          setShowFeedback(false);
                          setFeebackType(null);
                        }}
                        onSend={() => {
                          setIsHasFeedback(true);
                        }}
                      />
                    ) : null}

                    {showCitation && (
                      <ChatCitation reference={props.data?.reference} />
                    )}
                  </div>
                )}
              </div>

              {((isAssistant && !isLoading) || !isAssistant) && (
                <div className="heracx-flex heracx-w-full">
                  {isShowDate ? (
                    <div
                      className={classNames(
                        "heracx-flex heracx-items-center",
                        isAssistant
                          ? "heracx-justify-start"
                          : "heracx-justify-end",
                        "heracx-w-full",
                      )}
                    >
                      <span
                        className="heracx-text-xs"
                        style={{ color: secondary_text_color || "#8E92BC" }}
                      >
                        {date}
                      </span>
                    </div>
                  ) : null}

                  {isPerChatFeedback ? (
                    <div className="heracx-me-4 heracx-ml-auto heracx-opacity-0 heracx-transition-all heracx-duration-200 group-hover:heracx-opacity-100">
                      {" "}
                      {/* hidden by default, shows on hover */}
                      <div className="heracx-flex heracx-gap-3">
                        <button
                          className="heracx-cursor-pointer heracx-border-0 heracx-bg-transparent heracx-p-0"
                          onClick={() => {
                            handleShowFeedback({
                              feebackType: "Good",
                            });
                          }}
                        >
                          <HandThumbUpIcon
                            className={classNames(
                              "heracx-ml-1 heracx-h-5 heracx-w-5 heracx-pt-1 heracx-transition-all heracx-duration-200",
                            )}
                            style={{
                              color:
                                feebackType !== "Good"
                                  ? secondary_text_color || "#8E92BC"
                                  : button_bg_color || "#546FFF",
                            }}
                            aria-hidden="true"
                          />
                        </button>
                        <button
                          className="heracx-cursor-pointer heracx-border-0 heracx-bg-transparent heracx-p-0"
                          onClick={() => {
                            handleShowFeedback({
                              feebackType: "Bad",
                            });
                          }}
                        >
                          <HandThumbDownIcon
                            className={classNames(
                              "heracx-ml-1 heracx-h-5 heracx-w-5 heracx-pt-1 heracx-transition-all heracx-duration-200",
                            )}
                            style={{
                              color:
                                feebackType !== "Bad"
                                  ? secondary_text_color || "#8E92BC"
                                  : button_bg_color || "#546FFF",
                            }}
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </>
          )}
        </div>
      </li>
    </>
  );
};

export default ChatRow;
