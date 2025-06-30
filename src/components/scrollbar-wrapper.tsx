import React from "react";
import Scrollbar, { ScrollValues } from "rc-scrollbars";
import useConfig from "../hooks/useConfig";

export type ScrollbarWrapperProps = {
  showShadow?: boolean | "top" | "bottom";
  bottomShadowColor?: "white" | "black";
};

type Props = {
  children: React.ReactNode;
} & ScrollbarWrapperProps;

const ScrollbarWrapperComponent = (
  props: Props,
  ref: React.LegacyRef<Scrollbar>,
) => {
  const { accent_color } = useConfig();
  const [shadowTopOpacity, setShadowTopOpacity] = React.useState<number>(0);
  const [shadowBottomOpacity, setShadowBottomOpacity] =
    React.useState<number>(0);
  const handleUpdate = (values: ScrollValues) => {
    const { scrollTop, scrollHeight, clientHeight } = values;
    const shadowTopOpacity = (1 / 20) * Math.min(scrollTop, 20);
    const bottomScrollTop = scrollHeight - clientHeight;
    const shadowBottomOpacity =
      (1 / 20) * (bottomScrollTop - Math.max(scrollTop, bottomScrollTop - 20));
    setShadowTopOpacity(shadowTopOpacity);
    setShadowBottomOpacity(shadowBottomOpacity);
  };
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <Scrollbar
        style={{
          width: "100%",
          height: "100%",
          overflowX: "hidden",
        }}
        autoHide
        onUpdate={handleUpdate}
        ref={ref}
        universal={true}
      >
        {props.children}
      </Scrollbar>
      {/* <div
        style={{
          position: "absolute",
          top: 0,
          width: "100%",
          height: "20px",
          opacity:
            props.showShadow === true || props.showShadow === "top"
              ? 1
              : shadowTopOpacity,
          background: `linear-gradient(to bottom, ${
            accent_color + "20" || "#00000020"
          } 0%, rgba(0, 0, 0, 0) 100%)`
        }}
      /> */}
      {/* <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: props.bottomShadowColor === "white" ? "100px" : "20px",
          opacity:
            props.showShadow === true || props.showShadow === "bottom"
              ? 1
              : shadowBottomOpacity,
          background:
            props.bottomShadowColor === "black" || !props.bottomShadowColor
              ? `linear-gradient(to top, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0) 100%)`
              : `linear-gradient(to top, rgba(255,255,255, 1) 0%, rgba(255,255,255, 0) 100%)`
        }}
      /> */}
    </div>
  );
};

export default React.forwardRef(ScrollbarWrapperComponent);
