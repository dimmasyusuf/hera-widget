import React from "react";
import ImagePreview from "./image-preview";
import DocumentPreview from "./document-preview";

interface FilePreviewProps {
  file?: File; // Optional file input
  url?: string; // Optional URL input
  onPreviewClick?: () => void;
  onOverlayClick?: () => void;
  onCloseClick?: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = props => {
  const { file, url, onPreviewClick, onOverlayClick, onCloseClick } = props;

  // Determine file type
  const fileType = React.useMemo(() => {
    if (file) {
      return file.type; // MIME type from File object
    }
    if (url) {
      const extension = url.split(".").pop()?.toLowerCase();
      switch (extension) {
        case "jpg":
        case "jpeg":
          return "image/jpeg";
        case "png":
          return "image/png";
        case "gif":
          return "image/gif";
        case "webp":
          return "image/webp";
        case "pdf":
          return "application/pdf";
        default:
          return "unknown";
      }
    }
    return null;
  }, [file, url]);

  return (
    <>
      {/* Image preview card */}
      {(fileType === "image/jpeg" ||
        fileType === "image/png" ||
        fileType === "image/gif" ||
        fileType === "image/webp") && <ImagePreview {...props} />}

      {/* PDF preview card */}
      {fileType === "application/pdf" && <DocumentPreview {...props} />}
    </>
  );
};

export default FilePreview;
