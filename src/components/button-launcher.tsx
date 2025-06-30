import { forwardRef, useMemo, Ref, ComponentPropsWithoutRef } from "react";

import { motion, HTMLMotionProps } from "motion/react";

import useConfig from "../hooks/useConfig";
import useWidgetOperation from "../hooks/useWidgetOperation";

import MessagesIcon from "./icons/MessagesIcon";

import { classNames } from "../lib/helper";

type Props = HTMLMotionProps<"button"> &
  Omit<ComponentPropsWithoutRef<"button">, "ref"> & {
    ref?: Ref<HTMLButtonElement>;
  };

const LauncherButton = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { status } = useWidgetOperation();
  const { launcher_image_url, launcher_image, accent_color } = useConfig();

  const launcherImageUrl = useMemo(() => {
    const url = launcher_image_url || launcher_image?.image_url;
    return url?.includes("blob:") ? "" : url || "";
  }, [launcher_image, launcher_image_url]);

  const shadowButton = useMemo(() => {
    if (!accent_color) return undefined;
    return accent_color.length > 7
      ? accent_color.substring(0, 7) + "90"
      : accent_color + "90";
  }, [accent_color]);

  if (status.detail.loading) return null;

  const buttonProps = {
    ref,
    type: "button" as const,
    initial: { scale: 0 },
    animate: { scale: 1, transition: { duration: 0.5 } },
    whileTap: { scale: 0.9 },
    ...props,
  };

  return launcherImageUrl ? (
    <motion.button
      className="heracx-inline-block heracx-h-24 heracx-border-none heracx-bg-transparent heracx-p-0 heracx-outline-none hover:heracx-cursor-pointer"
      {...buttonProps}
    >
      <img
        alt="launcher-button"
        src={launcherImageUrl}
        className="heracx-h-full heracx-object-contain"
      />
    </motion.button>
  ) : (
    <motion.button
      className={classNames(
        "heracx-h-16 heracx-w-16 heracx-rounded-full heracx-border-none heracx-p-4 heracx-leading-none heracx-outline-none hover:heracx-cursor-pointer",
        `hover:heracx-opacity-80`,
      )}
      style={{
        boxShadow: shadowButton
          ? "0px 2px 20px " + shadowButton
          : "0px 8px 16px 0px #00000029",
        backgroundColor: accent_color || "#546FFF",
      }}
      {...buttonProps}
    >
      <MessagesIcon className="heracx-h-8 heracx-w-8" />
    </motion.button>
  );
});

LauncherButton.displayName = "LauncherButton";

export default LauncherButton;
