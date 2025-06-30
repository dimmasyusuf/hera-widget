import React, { LegacyRef } from "react";
import { classNames } from "../lib/helper";
import useConfig from "../hooks/useConfig";

const TextInput = (
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  ref: LegacyRef<HTMLInputElement>
) => {
  const { border_color, primary_text_color } = useConfig();
  return (
    <input
      className={classNames(
        "heracx-w-full heracx-rounded-[10px] heracx-py-3 heracx-px-4 heracx-border-solid",
        "focus:heracx-outline-none focus:heracx-ring-0 heracx-border",
        props.disabled && "heracx-opacity-50 heracx-bg-gray-200"
      )}
      style={{
        color: primary_text_color || "#141522",
        borderColor: border_color || "#DCE4FF"
      }}
      ref={ref}
      {...props}
    />
  );
};

export default React.forwardRef(TextInput);
