import React from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import { useInputUpload } from "../providers/InputUploadProvider"; // adjust the path if necessary
import useConfig from "../hooks/useConfig";
import UploadIcon from "./icons/UploadIcon";

type UploadFileButtonProps = {
  onFileSelect?: (file: File) => void;
};

const UploadFileButton: React.FC<UploadFileButtonProps> = ({
  onFileSelect
}) => {
  const { addFiles, clearFiles } = useInputUpload();
  const {
    image_upload,
    image_upload_size,
    document_upload,
    document_upload_size,
    accent_color
  } = useConfig();

  const onDrop = (acceptedFiles: FileWithPath[], fileRejections: any[]) => {
    clearFiles(); // Clear previous files, as it only accepts one file currently.

    // Allowed file extensions
    const allowedImageExtensions = /\.(jpeg|jpg|png)$/i;
    const allowedDocumentExtensions = /\.pdf$/i;

    // Validate files based on configuration
    const validFiles = acceptedFiles.filter(file => {
      const fileSizeInMB = file.size / 1024 / 1024; // Convert bytes to MB
      const isImage = image_upload && allowedImageExtensions.test(file.name);
      const isDocument =
        document_upload && allowedDocumentExtensions.test(file.name);

      if (isImage && fileSizeInMB <= (image_upload_size || 50)) return true;
      if (isDocument && fileSizeInMB <= (document_upload_size || 50))
        return true;

      return false;
    });

    // Handle valid files
    if (validFiles.length > 0) {
      addFiles(validFiles);
      if (onFileSelect) {
        validFiles.forEach(file => onFileSelect(file));
      }
    }

    // Optionally handle rejected files
    // if (fileRejections.length > 0) {
    //   console.warn("Some files were rejected:", fileRejections);
    // }
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    maxFiles: 1,
    onDrop,
    noClick: true, // Disable automatic click handling
    accept: {
      ...(image_upload && { "image/jpeg": [], "image/png": [] }),
      ...(document_upload && { "application/pdf": [] })
    }
  });

  const handleButtonClick = () => {
    open(); // Programmatically open file selector
  };

  return (
    <div
      {...getRootProps()}
      className="heracx-w-6 heracx-h-6 heracx-flex heracx-items-center heracx-justify-center heracx-cursor-pointer heracx-text-gray-500 hover:heracx-text-blue-500"
      onClick={handleButtonClick}
    >
      <input {...getInputProps()} className="heracx-hidden" />
      <UploadIcon color={accent_color || "#546FFF"} />
    </div>
  );
};

export default UploadFileButton;
