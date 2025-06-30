import { useMemo } from "react";
import LogoImage from "../assets/images/logo.svg";
import useAttributeConfig from "../hooks/useAttributeConfig";
import useConfig from "../hooks/useConfig";
import useWidgetOperation from "../hooks/useWidgetOperation";
import { useWidgetContext } from "../providers/WidgetProvider";
import CloseSessionButton from "./button-close";
import FullscreenButton from "./button-fullscreen";
import FlexLayout from "./layout-flex";

const Header = () => {
  const { state } = useWidgetContext();
  const { data } = useWidgetOperation();
  const {
    app_logo_url,
    app_logo,
    // avatar_image_url,
    // avatar_image,
    toolbar_color,
    primary_text_color,
    secondary_text_color,
    border_color,
    company_logo_url,
    company_logo,
  } = useConfig();
  const attributes = useAttributeConfig();
  const title = data.widget?.app.name || "HERA";
  const subtitle = data.widget?.app.description || "The HERA AI Agent";

  const appLogoUrl = useMemo(() => {
    if (!app_logo_url && !app_logo) return undefined;
    if (!app_logo_url && app_logo?.name === "default") return undefined;

    const url = app_logo_url || app_logo?.image_url;
    console.log(url);
    return url ? (url?.includes("blob:") ? undefined : url) : undefined;
  }, [app_logo, app_logo_url]);

  const companyLogoUrl = useMemo(() => {
    if (!company_logo_url && !company_logo) return undefined;
    if (!company_logo_url && company_logo?.name === "default") return undefined;

    const url = company_logo_url || company_logo?.image_url;
    console.log(url);
    return url ? (url?.includes("blob:") ? undefined : url) : undefined;
  }, [company_logo, company_logo_url]);

  if (attributes.fullscreen) {
    return null;
  }

  return (
    <FlexLayout
      className="heracx-box-border heracx-w-full heracx-items-center heracx-justify-between heracx-px-6 heracx-py-4"
      style={{
        borderBottomColor: border_color || "#DCE4FF",
        borderBottomWidth: "1px",
        borderBottomStyle: "solid",
      }}
    >
      <div className="heracx-flex heracx-max-w-[85%] heracx-items-center heracx-gap-2">
        {appLogoUrl ? (
          <img
            src={appLogoUrl}
            alt="App Logo"
            className="heracx-inline-block heracx-h-10 heracx-w-10 heracx-shrink-0 heracx-grow-0 heracx-rounded-full"
          />
        ) : (
          <div className="heracx-flex heracx-h-10 heracx-w-10 heracx-shrink-0 heracx-grow-0 heracx-items-center heracx-justify-center heracx-rounded-full heracx-border heracx-border-solid heracx-border-[#DCE4FF] heracx-bg-[#FAFAFA]">
            <img
              src={LogoImage}
              alt="App Logo"
              className="heracx-h-6 heracx-w-6"
            />
          </div>
        )}

        <div className="heracx-flex heracx-flex-col heracx-items-start heracx-justify-center">
          <span
            className="heracx-truncate heracx-text-base heracx-font-semibold"
            style={{ color: primary_text_color || "#141522" }}
          >
            {title}
          </span>
          {subtitle && (
            <span
              className="heracx-truncate heracx-text-xs"
              style={{ color: secondary_text_color || "#8E92BC" }}
            >
              {subtitle}
            </span>
          )}
        </div>
      </div>

      <div className="heracx-flex heracx-items-center heracx-gap-2">
        {companyLogoUrl && (
          <img
            src={companyLogoUrl}
            alt="Company Logo"
            className="heracx-h-10 heracx-w-full"
          />
        )}
        {state.convo_id && (
          <CloseSessionButton buttonColor={toolbar_color || "#C2C6E8"} />
        )}
        <FullscreenButton buttonColor={toolbar_color || "#C2C6E8"} />
      </div>
    </FlexLayout>
  );
};

export default Header;
