import FlexLayout from "./layout-flex";
import Loading from "./loading";
import Header from "./header";
import useWidgetOperation from "../hooks/useWidgetOperation";
import AlertError from "./alert-error";
import Screens from "./screens";
import { ButtonProvider } from "../context/disable-button-context";
import { classNames } from "../lib/helper";
import useConfig from "../hooks/useConfig";
import { useMemo } from "react";

const BoxContainer = () => {
  const { border_color, bg_color, radius, accent_color } = useConfig();
  const { status } = useWidgetOperation();
  const widgetError = status.detail.error;
  const isLoading = status.detail.loading;
  const isError = widgetError;

  const shadowBox = useMemo(() => {
    if (!accent_color) return undefined;
    if (accent_color.length > 7) {
      const baseColor = accent_color.substring(0, 7);
      return baseColor + "21";
    }
    return accent_color + "21";
  }, [accent_color]);

  return (
    <FlexLayout
      direction="column"
      className={classNames("heracx-border heracx-border-solid")}
      style={{
        background: bg_color || "#FFFFFF",
        borderRadius: radius || 16,
        borderColor: border_color || "#DCE4FF",
        boxShadow: shadowBox
          ? "0px 16px 30px 0px " + shadowBox
          : "0px 16px 30px 0px #0000000F",
      }}
    >
      <Header />
      {isLoading ? (
        <Loading />
      ) : (
        <FlexLayout auto>
          {isError ? (
            <FlexLayout className="heracx-w-full" direction="column">
              {widgetError ? (
                <AlertError
                  message={
                    widgetError.message || "Error retrieving widget data"
                  }
                />
              ) : null}
            </FlexLayout>
          ) : (
            <ButtonProvider>
              <Screens />
            </ButtonProvider>
          )}
        </FlexLayout>
      )}
    </FlexLayout>
  );
};

export default BoxContainer;
