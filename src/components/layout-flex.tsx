import ScrollbarWrapperComponent, {
  ScrollbarWrapperProps
} from "./scrollbar-wrapper";

import useFlexLayout from "../hooks/useFlexLayout";

export const FlexLayout = ({
  children,
  direction,
  auto = false,
  scrollable = false,
  scrollbarConfig,
  ...divProps
}: {
  children?: React.ReactNode;
  direction?: "row" | "column";
  scrollable?: boolean;
  auto?: boolean;
  scrollbarConfig?: ScrollbarWrapperProps;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) => {
  const { verticalContainerProps, horizontalContainerProps } = useFlexLayout();
  const { style, ...divPropsWithoutStyle } = divProps;
  return (
    <div
      className="flex-layout"
      style={{
        display: "flex",
        flex: auto ? "auto" : "none",
        ...(direction
          ? direction === "row"
            ? horizontalContainerProps
            : verticalContainerProps
          : {}),
        ...divProps.style
      }}
      {...divPropsWithoutStyle}
    >
      {scrollable ? (
        <ScrollbarWrapperComponent {...scrollbarConfig}>
          {children}
        </ScrollbarWrapperComponent>
      ) : (
        children
      )}
    </div>
  );
};

export default FlexLayout;
