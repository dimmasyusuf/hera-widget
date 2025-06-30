import React, { useState } from "react";
import { classNames } from "../lib/helper";
import { useButtonContext } from "../context/disable-button-context";
import {
  HandThumbUpIcon,
  HandThumbDownIcon,
  CheckCircleIcon
} from "@heroicons/react/24/solid";
import useConvoOperation from "../hooks/useConvoOperation";
import useConfig from "../hooks/useConfig";

type Props = {
  convo_id: string;
  chat_id: string;
  feebackType: "Good" | "Bad";
  onCancel: () => void;
  onSend: () => void;
};
const FeedbackInput = (props: Props) => {
  const { enableButton, disableButton } = useButtonContext();
  const { action } = useConvoOperation({
    convo_id: props.convo_id
  });
  // const [feedback, setFeedbackType] = useState<string | null>(null); // "Suka" or "Tidak Suka"
  const [feedback_message, setInputFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  // const [showInput, setShowInput] = useState(false); // State untuk menampilkan input

  const { primary_text_color } = useConfig();

  const handleSubmit = async () => {
    if (feedback_message) {
      enableButton();
      action.sendFeedbackResponse({
        feedback: props.feebackType,
        feedback_message,
        chat_id: props.chat_id
      });
      setSubmitted(true);
      props.onSend();
    } else {
      alert("Silakan berikan feedback dan komentar tambahan");
    }
  };

  const handleCancel = () => {
    // setShowInput(false); // Sembunyikan input
    setInputFeedback(""); // Reset input
    props.onCancel();
    // setFeedbackType(null); // Reset feedback type
  };

  if (submitted) {
    return (
      <div className="heracx-text-center heracx-text-lg  heracx-bg-white heracx-mt-3 heracx-rounded-[10px] heracx-p-3">
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
    );
  }

  return (
    <div className="heracx-flex heracx-flex-col heracx-mt-3 heracx-bg-slate-400 heracx-p-3 heracx-rounded-[10px]">
      <div className="heracx-mb-4 heracx-flex heracx-flex-col heracx-gap-4">
        <div className="heracx-w-full heracx-flex">
          <textarea
            placeholder="Tambahkan masukan di sini (required)"
            value={feedback_message}
            onChange={e => setInputFeedback(e.target.value)}
            className="heracx-w-full heracx-rounded-[10px] heracx-py-3 heracx-px-4 focus:heracx-outline-none focus:heracx-ring-0 heracx-border heracx-resize-none heracx-text-sm heracx-text-black"
          />
        </div>
        <div className="heracx-flex heracx-justify-between heracx-w-full">
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
    </div>
  );
};

export default FeedbackInput;
