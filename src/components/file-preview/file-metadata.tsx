import { DocumentTextIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React, { useMemo } from "react";
import useConfig from "../../hooks/useConfig";

type FileMetadataType = {
  name: string;
  size: string;
};

export const FileMetadata = ({
  file,
  isLoading,
  handleRemove
}: {
  file: FileMetadataType;
  isLoading?: boolean;
  handleRemove?: () => void;
}) => {
  const {
    accent_color,
    citation,
    feedback_reaction,
    assistant_chat_background_color,
    user_chat_background_color,
    user_chat_text_color,
    assistant_chat_text_color
  } = useConfig();

  const textColor = useMemo(() => {
    return user_chat_text_color || "heracx-text-white";
  }, [user_chat_text_color]);

  const backgroundColor = useMemo(() => {
    return user_chat_background_color || "heracx-bg-black";
  }, [user_chat_background_color]);

  const colors = useMemo(() => {
    if (!!handleRemove) {
      return {
        bg: "heracx-bg-gray-200",
        text: "heracx-text-gray-900"
      };
    } else {
      return {
        bg: backgroundColor,
        text: textColor
      };
    }
  }, [handleRemove]);

  return (
    <div>
      {isLoading ? (
        <div className="heracx-flex heracx-justify-center">
          <div className="heracx-w-4 heracx-h-4 heracx-border-2 heracx-border-gray-300 heracx-border-t-gray-600 heracx-rounded-full heracx-animate-spin"></div>
        </div>
      ) : (
        <div
          className={`heracx-flex heracx-items-center heracx-rounded-lg heracx-p-2 heracx-shadow-md heracx-max-w-lg heracx-max-h-12 heracx-mt-4 heracx-mb-2 heracx-ml-4 ${colors?.bg}`}
        >
          {/* File Icon */}
          <div className="heracx-rounded-xl heracx-bg-pink-500 heracx-flex heracx-items-center heracx-justify-center heracx-w-12 heracx-h-12 heracx-mr-3">
            <DocumentTextIcon className="heracx-h-7 heracx-w-7 heracx-text-white" />
          </div>
          {/* File Details */}
          <div className="heracx-flex-1 heracx-mr-8">
            <p
              className={`heracx-text-xs heracx-font-medium heracx-truncate ${colors.text}`}
            >
              {file.name}
            </p>
            <p className={`heracx-text-xs heracx-text-gray-600 ${colors.text}`}>
              {file.size}
            </p>
          </div>
          {handleRemove && (
            <>
              {/* Remove Button */}
              <button
                onClick={handleRemove}
                className="heracx-bg-gray-500 heracx-text-white heracx-rounded-full heracx-w-4 heracx-h-4 heracx-flex heracx-items-center heracx-justify-center heracx-text-xs hover:heracx-bg-gray-600 transition-colors heracx-mb-8"
                aria-label="Remove file"
              >
                x
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
