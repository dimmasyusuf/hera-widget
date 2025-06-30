import React, { useMemo, useState } from "react";
import { classNames } from "../lib/helper";
import { useButtonContext } from "../context/disable-button-context";
import {
  HandThumbUpIcon,
  HandThumbDownIcon,
  CheckCircleIcon
} from "@heroicons/react/24/solid";
import useConvoOperation from "../hooks/useConvoOperation";
import { Chat } from "../api/type";
import { TextRenderer } from "../modules/chat/text-renderer";
import useConfig from "../hooks/useConfig";

type Props = {
  convo_id: string;
  last_chat_id: string;
  chat?: Partial<Chat>;
};
const FeedbackComponent = (props: Props) => {
  const { enableButton, disableButton } = useButtonContext();
  const { action } = useConvoOperation({
    convo_id: props.convo_id
  });
  const [feedback, setFeedbackType] = useState<string | null>(null); // "Suka" or "Tidak Suka"
  const [feedback_message, setInputFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showInput, setShowInput] = useState(false); // State untuk menampilkan input
  const { primary_text_color } = useConfig();

  const handleFeedback = (type: string) => {
    setFeedbackType(type);
    setShowInput(true); // Tampilkan input saat tombol diklik
  };
  React.useEffect(() => {
    disableButton();
  }, []);

  const handleSubmit = async () => {
    if (feedback && feedback_message) {
      enableButton();
      action.sendFeedbackResponse({
        feedback,
        feedback_message,
        chat_id: props.last_chat_id
      });
      setSubmitted(true);
    } else {
      alert("Silakan berikan feedback dan komentar tambahan");
    }
  };

  const handleCancel = () => {
    setShowInput(false); // Sembunyikan input
    setInputFeedback(""); // Reset input
    setFeedbackType(null); // Reset feedback type
  };

  const returnFeedbackMessage = useMemo(() => {
    if (props.chat?.message && typeof props.chat?.message === "string") {
      return props.chat?.message;
    }
  }, [props.chat?.message]);

  return (
    <>
      {returnFeedbackMessage ? (
        <div className="heracx-mb-3">
          <TextRenderer text={returnFeedbackMessage} isSuccess={true} />
        </div>
      ) : null}
      {submitted ? (
        <div className="heracx-text-center heracx-text-lg heracx-bg-white heracx-rounded-[10px] heracx-p-3 heracx-mt-3">
          <CheckCircleIcon className="heracx-h-10 heracx-w-10 heracx-text-green-600 heracx-mt-2" />
          <p
            className="-heracx-mt-2 heracx-font-medium"
            style={{
              color: primary_text_color || "#141522"
            }}
          >
            Terima kasih atas feedback Anda!
          </p>
        </div>
      ) : (
        <div className="heracx-flex heracx-flex-col heracx-mt-3 heracx-bg-slate-400 heracx-p-3 heracx-rounded-[10px]">
          <h2 className="heracx-text-md heracx-font-semibold heracx-mb-4 heracx-mt-0">
            Berikan Feedback Tentang Chatbot Kami
          </h2>

          <div className="heracx-w-full heracx-mb-4">
            <button
              onClick={() => handleFeedback("Good")}
              className={classNames(
                "heracx-p-4 heracx-border-none heracx-rounded-[10px] heracx-w-full heracx-shadow transition-colors heracx-flex heracx-gap-3 heracx-items-center",
                feedback === "Good"
                  ? "heracx-bg-black heracx-text-white"
                  : "heracx-bg-white heracx-text-black"
              )}
            >
              Apakah Anda merasa chatbot ini membantu?{" "}
              <HandThumbUpIcon
                className="heracx-h-5 heracx-w-5 heracx-ml-1 heracx-text-orange-300"
                aria-hidden="true"
              />
            </button>
          </div>

          <div className="heracx-w-full heracx-mb-4">
            <button
              onClick={() => handleFeedback("Bad")}
              className={classNames(
                "heracx-p-4 heracx-rounded-[10px] heracx-border-none heracx-w-full heracx-shadow transition-colors heracx-flex heracx-gap-3 heracx-items-center",
                feedback === "Bad"
                  ? "heracx-bg-black heracx-text-white"
                  : "heracx-bg-white heracx-text-black"
              )}
            >
              Apakah Anda merasa chatbot ini tidak membantu?{" "}
              <HandThumbDownIcon
                className="heracx-h-5 heracx-w-5 heracx-ml-2 heracx-text-orange-300"
                aria-hidden="true"
              />
            </button>
          </div>

          {showInput && (
            <div className="heracx-mb-4 heracx-flex heracx-flex-col heracx-gap-4">
              <div className="heracx-w-full heracx-flex">
                <textarea
                  placeholder="Tambahkan masukan di sini (required)"
                  value={feedback_message}
                  onChange={e => setInputFeedback(e.target.value)}
                  className="heracx-w-full heracx-rounded-[10px] heracx-py-3 heracx-px-4 focus:heracx-outline-none focus:heracx-ring-0 heracx-border heracx-resize-none heracx-text-sm heracx-text-black"
                />
              </div>

              <div className="heracx-flex heracx-justify-between">
                <button
                  onClick={handleCancel}
                  className="heracx-border-none heracx-bg-white heracx-text-black heracx-py-2 heracx-px-6 heracx-rounded-lg heracx-border heracx-border-black heracx-hover:bg-gray-200 heracx-transition-colors heracx-duration-300"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  className="heracx-border-none heracx-bg-black heracx-text-white heracx-py-2 heracx-px-6 heracx-rounded-lg heracx-hover:bg-gray-800 heracx-transition-colors heracx-duration-300"
                >
                  Kirim
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default FeedbackComponent;
