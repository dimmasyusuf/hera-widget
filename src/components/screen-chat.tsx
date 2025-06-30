import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import UploadFileButton from "./upload-file-button";
import FlexLayout from "./layout-flex";
import { classNames } from "../lib/helper";
import useConvoOperation from "../hooks/useConvoOperation";
import ChatRow from "./chat-row";
import GreetingChat from "./chat-greeting";
import { useForm } from "react-hook-form";
import Scrollbar from "rc-scrollbars";
import ScrollbarWrapper from "./scrollbar-wrapper";
import { useWidgetContext } from "../providers/WidgetProvider";
import AlertError from "./alert-error";
import Loading from "./loading";
import ButtonSend from "./button-send";
import useConfig from "../hooks/useConfig";
import { useButtonContext } from "../context/disable-button-context";
import { useInputUpload } from "../providers/InputUploadProvider";
import AgreementChat from "../modules/chat/agreement-chat";
import FilePreview from "./file-preview/file-preview";
import RecordAudioButton from "./record-audio-button";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";

dayjs.extend(isToday);
dayjs.extend(isYesterday);

type Props = {
  convo_id: string;
};

const getDateLabel = (d?: string | number | Date) => {
  if (!d) return "";
  const cur = dayjs(d);
  const t = cur.format("HH:mm");
  if (cur.isToday()) return `Today ${t}`;
  if (cur.isYesterday()) return `Yesterday ${t}`;
  return cur.format("MMM, DD HH:mm");
};

const ChatScreen = ({ convo_id }: Props) => {
  const { isDisabled } = useButtonContext();
  const [hasFeedbackSent, setHasFeedbackSent] = useState(false);
  const { state } = useWidgetContext();
  const {
    agent_name,
    conversation_feedback,
    feedback_timer,
    agreement,
    image_upload,
    document_upload,
    primary_text_color,
    audio_upload,
    accent_color,
    border_color,
    secondary_text_color,
  } = useConfig();
  const [userAgreement, setUserAgreement] = useState(false);

  const { register, reset, setFocus, handleSubmit, watch } = useForm<{
    message: string;
  }>();

  useEffect(() => {
    setFocus("message");
  }, [setFocus]);

  const message = watch("message");

  const { data, status, action } = useConvoOperation({ convo_id });

  const { uploadedFiles, clearFiles } = useInputUpload();

  const chats = data.chats;

  const lastChat = useMemo(
    () => (chats ? chats[chats.length - 1] : undefined),
    [chats],
  );

  useEffect(() => {
    if (
      !conversation_feedback ||
      !feedback_timer ||
      !lastChat ||
      lastChat.role !== "assistant" ||
      hasFeedbackSent ||
      lastChat.context?.feedback
    )
      return;

    const id = setInterval(() => {
      action.sendFeedback();
      setHasFeedbackSent(true);
      clearInterval(id);
    }, feedback_timer * 1000);

    return () => clearInterval(id);
  }, [lastChat, hasFeedbackSent]);

  const isCreating = status.create.busy;
  const isStreaming = status.stream.busy;
  const isStreamingIdle = status.stream.idle;
  const isFeedbackSending = status.sendFeedback.busy;
  const isSending = isCreating || isStreaming || isFeedbackSending;
  const isFileUpload = Boolean(image_upload || document_upload);

  const isLoading = status.list.loading;
  const isFetching = status.list.fetching;
  const listError = status.list.error;

  const createError = status.create.error;
  const streamError = status.stream.error;
  const sendError = createError || streamError;

  const scrollbarRef = useRef<Scrollbar>(null);
  useEffect(() => {
    if (scrollbarRef.current && scrollbarRef.current.view && chats) {
      const h = scrollbarRef.current.getScrollHeight();
      scrollbarRef.current.view.scrollTo({ top: h, behavior: "smooth" });
      setFocus("message");
    }
  }, [chats, setFocus, status.create.busy]);

  const scrollToBottom = useCallback(() => {
    if (scrollbarRef.current && scrollbarRef.current.view) {
      const h = scrollbarRef.current.getScrollHeight();
      scrollbarRef.current.view.scrollTo({ top: h, behavior: "smooth" });
    }
  }, []);

  const onSubmit = handleSubmit(({ message }) => {
    if (isInputDisabled || !state.user_id || !message.trim()) return;
    reset({ message: "" });
    action.stream({
      role: "user",
      message,
      user_id: state.user_id,
      file: uploadedFiles[0],
    });
    clearFiles();
    setHasFeedbackSent(false);
  });

  const isInputDisabled = useMemo(() => {
    if (!isStreamingIdle || isSending) return true;
    if (agreement && !userAgreement) return true;
    return isDisabled;
  }, [isDisabled, isStreamingIdle, isSending, agreement, userAgreement]);

  const useAnimatedPlaceholder = (disabled: boolean) => {
    const [dots, setDots] = useState("");

    useEffect(() => {
      if (!disabled) return;
      const id = setInterval(() => {
        setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
      }, 500);
      return () => clearInterval(id);
    }, [disabled]);

    const agentDisplay = agent_name ?? "HERA";

    return disabled
      ? `${agentDisplay} will respond shortly${dots}`
      : `Ask ${agentDisplay} anything...`;
  };

  const animatedPlaceholder = useAnimatedPlaceholder(isInputDisabled);

  const shadowInputChat = useMemo(() => {
    if (!accent_color) return undefined;
    return accent_color.length > 7
      ? accent_color.substring(0, 7) + "21"
      : accent_color + "21";
  }, [accent_color]);

  const showTimeMap = useMemo(() => {
    const m: Record<string, boolean> = {};
    if (!chats) return m;
    const lastLabelByRole: Record<string, string> = {};
    for (let i = chats.length - 1; i >= 0; i--) {
      const c = chats[i];
      const label = getDateLabel(c.created_at);
      const role = c.role || "";
      if (role === "user") {
        m[c.id] = true;
        lastLabelByRole[role] = label;
      } else {
        if (label && label === lastLabelByRole[role]) {
          m[c.id] = false;
        } else {
          m[c.id] = true;
          lastLabelByRole[role] = label;
        }
      }
    }
    return m;
  }, [chats]);

  if (isLoading) return <Loading />;

  return (
    <FlexLayout direction="column" className="heracx-w-full heracx-font-normal">
      {sendError && (
        <AlertError
          autoHide
          message={sendError.message || "Error while submitting message"}
        />
      )}
      {listError ? (
        <AlertError
          message={listError.message || "Error while retrieving messages"}
        />
      ) : (
        <>
          <FlexLayout auto>
            <ScrollbarWrapper ref={scrollbarRef}>
              <ul
                className={classNames(
                  "heracx-m-0 heracx-flex heracx-flex-col heracx-space-y-6 heracx-p-6",
                )}
              >
                <GreetingChat />
                <AgreementChat
                  onChange={(val) => {
                    setUserAgreement(val);
                    setTimeout(scrollToBottom, 100);
                  }}
                  isDisabled={!!chats?.length}
                />

                {chats?.map((chat, index) => (
                  <ChatRow
                    key={chat.id}
                    index={index}
                    loading={!chat.id}
                    data={chat}
                    convo_id={convo_id}
                    last_chat_id={lastChat?.id}
                    is_streaming={
                      chat.role === "assistant" ? isInputDisabled : false
                    }
                    hide_time={!showTimeMap[chat.id]}
                  />
                ))}

                {isSending && (
                  <ChatRow key="loading" loading data={{ role: "assistant" }} />
                )}
              </ul>
            </ScrollbarWrapper>
          </FlexLayout>

          {uploadedFiles.length > 0 && isFileUpload && (
            <FlexLayout className="heracx-h-30 heracx-items-center heracx-bg-gray-100">
              <FilePreview file={uploadedFiles[0]} onCloseClick={clearFiles} />
            </FlexLayout>
          )}

          <div className="heracx-flex heracx-flex-col heracx-gap-4 heracx-px-6 heracx-py-4">
            <div
              className="heracx-flex heracx-items-center heracx-gap-2 heracx-rounded-[16px] heracx-border heracx-border-solid heracx-bg-white heracx-px-5 heracx-py-2 heracx-shadow"
              style={{
                borderColor: border_color || "#DCE4FF",
              }}
            >
              <input
                className={classNames(
                  "heracx-h-8 heracx-w-full heracx-border-none heracx-bg-transparent heracx-text-sm heracx-outline-none",
                  isInputDisabled && "heracx-opacity-50",
                )}
                style={{ color: primary_text_color || "#141522" }}
                placeholder={animatedPlaceholder}
                autoComplete="off"
                autoFocus
                disabled={isInputDisabled}
                {...register("message", { required: true })}
                onKeyDown={(e) =>
                  e.key === "Enter" && !isInputDisabled && onSubmit()
                }
              />

              {!isInputDisabled &&
                image_upload &&
                uploadedFiles.length === 0 && (
                  <UploadFileButton onFileSelect={() => {}} />
                )}

              {!isInputDisabled && audio_upload && <RecordAudioButton />}

              {(message || uploadedFiles.length > 0) && (
                <ButtonSend onClick={onSubmit} />
              )}
            </div>

            <p
              className="heracx-m-0 heracx-text-center heracx-text-xs heracx-font-medium"
              style={{ color: secondary_text_color || "#8E92BC" }}
            >
              Powered by{" "}
              <a
                href="https://heracx.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="heracx-cursor-pointer heracx-text-[#546FFF] heracx-no-underline hover:heracx-underline"
              >
                HERA
              </a>
            </p>
          </div>
        </>
      )}
    </FlexLayout>
  );
};

export default ChatScreen;
