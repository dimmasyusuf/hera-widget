import {
  ArrowTopRightOnSquareIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import { ChatReference } from "../api/type";
import useConfig from "../hooks/useConfig";
import { addParamsToUrl, classNames } from "../lib/helper";
import { getDownloadFileToken } from "../api/convo";
import { useMemo } from "react";

type Props = {
  reference?: ChatReference[];
};

const ChatCitation = (props: Props) => {
  const { accent_color, disable_resource_citation, border_color } = useConfig();

  const handleOpenLink = async (url: string) => {
    try {
      // Fetch the token
      // const tokenData = await getDownloadFileToken();
      // const token = tokenData?.token;

      // if (!token) {
      //   throw new Error("Token not available");
      // }
      // const tokenizedUrl = addParamsToUrl(url, { token });

      const tokenizedUrl = addParamsToUrl(url, {
        token:
          "WFtdcXcrsyO0vL3zVuC4nVfGabuExqmxpWRiqIshvCQkQoBxqbqm9NWm3fa4Zqqc",
      });
      window.open(tokenizedUrl, "_blank");
    } catch (error) {
      console.error("Failed to fetch the download token:", error);
      // Handle error if needed
    }
  };

  const filteredCitation = useMemo(() => {
    if (!props.reference) return [];
    return props.reference.filter((citation) => {
      return !disable_resource_citation?.find((disable) => {
        const disableName = `${disable.name}.${disable?.metadata[0]?.filetype}`;
        return disableName === citation.name;
      });
    });
  }, [props.reference, disable_resource_citation]);

  if (!filteredCitation?.length) {
    return null;
  }

  return (
    <div
      className={classNames(
        "heracx-mt-4 heracx-border-x-0 heracx-border-b-0 heracx-border-t heracx-border-solid heracx-border-[#E7E7E7]",
      )}
    >
      <p className="!heracx-text-xs heracx-font-semibold heracx-text-[#A2A2A2]">
        Source
      </p>

      {filteredCitation.map((ref, i) => (
        <div
          onClick={() => handleOpenLink(ref.url)}
          className="heracx-text-inherit heracx-no-underline"
          style={{ cursor: "pointer" }}
        >
          <div className="heracx-flex heracx-items-center heracx-gap-1">
            <DocumentIcon className="heracx-h-4 heracx-w-4" />
            <em className="heracx-overflow-hidden heracx-truncate !heracx-text-xs">
              {ref.name}
            </em>
            <ArrowTopRightOnSquareIcon
              color={accent_color || "black"}
              className="heracx-h-4 heracx-w-4"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatCitation;
