import React from "react";

import { classNames } from "../lib/helper";

import useConfig from "../hooks/useConfig";

const Button = (
  props: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
  ref: React.LegacyRef<HTMLButtonElement>,
) => {
  const { button_bg_color, button_text_color } = useConfig();

  return (
    <button
      ref={ref}
      className={classNames(
        "heracx-w-full heracx-rounded-[10px] heracx-border-none heracx-px-6 heracx-py-3 heracx-text-sm heracx-font-medium",
        props.disabled ? "heracx-cursor-not-allowed" : "heracx-cursor-pointer",
        props.disabled
          ? "heracx-opacity-50 hover:heracx-opacity-50"
          : "hover:heracx-opacity-90",
      )}
      style={{
        background: button_bg_color || "#546FFF",
        color: button_text_color || "#FFFFFF",
      }}
      {...props}
    >
      {props.children}
    </button>
  );
};

export default React.forwardRef(Button);
