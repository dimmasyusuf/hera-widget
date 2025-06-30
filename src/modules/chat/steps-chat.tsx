import { useEffect, useMemo, useState } from "react";

import { motion } from "motion/react";
import styled, { keyframes, css } from "styled-components";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import StarIcon from "../../components/icons/StarIcon";
import useConfig from "../../hooks/useConfig";
import MagicStarIcon from "../../assets/icons/magic-star-icon";

const prettify = (t: string) => {
  const m: Record<string, string> = {
    Thinking: "Processing",
    "Choose Tool": "Picking the tool",
    "Initiating Tool": "Spinning up",
    "Executing Tool": "Executing task",
    "Retrieving Tool": "Fetching result",
    "Knowledge Retrieval:": "Gathering insights",
  };
  const k = Object.keys(m).find((x) => t.includes(x));
  return k ? m[k] : t;
};

// const spin = keyframes`to { transform: rotate(360deg); }`;
// const fade = keyframes`
//   0%{opacity:0}
//   20%{opacity:1}
//   80%{opacity:1}
//  100%{opacity:0}
// `;

// const shine = keyframes`
//   0%{background-position:-200% 0}
//  100%{background-position:200% 0}
// `;

// const Holder = styled.li<{ $c: string; $shine: boolean }>`
//   list-style: none;
//   display: flex;
//   align-items: center;
//   gap: 6px;
//   animation: ${fade} 1.5s ease;
//   span {
//     font-size: 12px;
//     font-weight: 500;
//     color: ${(p) => p.$c};
//     ${(p) =>
//       p.$shine &&
//       css`
//         background: linear-gradient(
//           90deg,
//           transparent 0%,
//           ${p.$c} 20%,
//           #fff 50%,
//           ${p.$c} 80%,
//           transparent 100%
//         );
//         background-size: 200% 100%;
//         animation: ${shine} 6s linear infinite;
//         -webkit-background-clip: text;
//         background-clip: text;
//         color: transparent;
//       `}
//   }
// `;

// const Spinner = styled(ArrowPathIcon)`
//   width: 16px;
//   height: 16px;
//   animation: ${spin} 1s linear infinite;
// `;

export type StepsChatType = { type: "steps"; payload: { content: string } };
type Props = {
  content: StepsChatType;
  last_chat_id: string;
  chat_id: string;
  is_streaming?: boolean;
};

export const StepsChat = ({
  content,
  last_chat_id,
  chat_id,
  is_streaming,
}: Props) => {
  const { highlight_text_color } = useConfig();
  const color = highlight_text_color || "#8E92BC";

  const lines = useMemo(() => {
    if (typeof content.payload.content !== "string") return [];
    return content.payload.content
      .replaceAll(/\\n/g, "\n")
      .split("\n")
      .filter(Boolean)
      .map(prettify);
  }, [content.payload.content]);

  const [step, setStep] = useState(0);
  const finalStep = lines.length - 1;

  const active = Boolean(is_streaming && last_chat_id === chat_id);
  const shining = step === finalStep && active;

  useEffect(() => {
    if (!active || step >= finalStep) return;
    const timer = setTimeout(() => setStep((s) => s + 1), 1500);
    return () => clearTimeout(timer);
  }, [active, step, finalStep]);

  const icon = shining ? (
    <MagicStarIcon color={`${active ? color : "#FFC73A"}`} />
  ) : step === finalStep ? (
    <MagicStarIcon color={`${active ? color : "#FFC73A"}`} />
  ) : (
    <MagicStarIcon color={`${active ? color : "#FFC73A"}`} />
  );

  if (!lines.length) return <></>;

  return (
    <div className="heracx-flex heracx-items-center heracx-gap-1.5 heracx-text-xs heracx-font-medium">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5 } }}
      >
        {icon}
      </motion.div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.5 } }}
        style={{ color: color || "#8E92BC" }}
      >
        {lines[step]}
      </motion.span>
    </div>
  );
};
