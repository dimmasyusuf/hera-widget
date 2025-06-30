import React from "react";
import { getFileMetadata } from "../../lib/helper";
import { FileMetadata } from "./file-metadata";
import { fetchFileMetadataFromUrl } from "../../api/convo";

interface DocumentPreviewProps {
  file?: File; // Optional file input
  url?: string; // Optional URL input
  onPreviewClick?: () => void;
  onOverlayClick?: () => void;
  onCloseClick?: () => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  file,
  url,
  onPreviewClick,
  onOverlayClick,
  onCloseClick
}) => {
  const [fileMetadata, setFileMetadata] = React.useState<{
    name: string;
    size: string;
  }>({
    name: "Unknown File",
    size: "Unknown Size"
  });

  React.useEffect(() => {
    const fetchMetadata = async () => {
      if (file) {
        const metadata = getFileMetadata(file);
        setFileMetadata(metadata);
      } else if (url) {
        const metadata = await fetchFileMetadataFromUrl(url);
        setFileMetadata(metadata);
      } else {
        setFileMetadata({
          name: "Unknown File",
          size: "Unknown Size"
        });
      }
    };

    fetchMetadata();
  }, [file, url]);

  return (
    <>
      <FileMetadata
        file={fileMetadata}
        isLoading={false}
        handleRemove={onCloseClick}
      />
    </>
  );
};

export default DocumentPreview;
