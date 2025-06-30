import React from "react";
import useConfig from "../hooks/useConfig";
import SendIcon from "./icons/SendIcon";

const SendButton = (
  props: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
  ref: React.LegacyRef<HTMLButtonElement>
) => {
  const { accent_color } = useConfig();
  return (
    <button
      className="heracx-border-none heracx-bg-transparent heracx-cursor-pointer"
      type="button"
      {...props}
    >
      <SendIcon color={accent_color || "#546FFF"} />
    </button>
  );
};

export default React.forwardRef(SendButton);
