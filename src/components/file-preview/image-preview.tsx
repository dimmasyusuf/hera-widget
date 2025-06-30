import React from "react";

interface ImagePreviewProps {
  file?: File; // Optional file input
  url?: string; // Optional URL input
  onPreviewClick?: () => void;
  onOverlayClick?: () => void;
  onCloseClick?: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  file,
  url,
  onPreviewClick,
  onOverlayClick,
  onCloseClick
}) => {
  const [isOverlayOpen, setIsOverlayOpen] = React.useState(false);

  // Derive image source
  const imageSrc = React.useMemo(() => {
    if (file) return URL.createObjectURL(file);
    if (url) return url;
    return null;
  }, [file, url]);

  const handlePreviewClick = () => {
    if (!imageSrc) return;
    setIsOverlayOpen(true);
    onPreviewClick?.();
  };

  const handleOverlayClick = () => {
    setIsOverlayOpen(false);
    onOverlayClick?.();
  };

  if (!imageSrc) {
    return <p>No image to preview</p>;
  }

  return (
    <>
      {/* Image preview card */}
      <div className="heracx-relative heracx-inline-block heracx-mt-2 heracx-w-20 heracx-h-20 heracx-p-2 heracx-border heracx-border-gray-300 heracx-rounded-lg heracx-shadow-sm heracx-overflow-hidden">
        <div className="heracx-flex heracx-items-center heracx-justify-center heracx-w-full heracx-h-full">
          <img
            src={imageSrc}
            alt="Preview"
            className="heracx-max-w-full heracx-max-h-full heracx-object-cover heracx-cursor-pointer heracx-rounded-md"
            onClick={handlePreviewClick}
          />
        </div>

        {/* Optional close button */}
        {onCloseClick && (
          <button
            onClick={onCloseClick}
            className="heracx-absolute heracx-top-1 heracx-right-1 heracx-bg-gray-500 heracx-text-white heracx-rounded-full heracx-w-4 heracx-h-4 heracx-flex heracx-items-center heracx-justify-center heracx-text-xs hover:heracx-bg-gray-600 transition-colors"
            aria-label="Remove image"
          >
            ×
          </button>
        )}
      </div>

      {/* Full image overlay */}
      {isOverlayOpen && (
        <div
          className="heracx-fixed heracx-top-0 heracx-left-0 heracx-w-full heracx-h-full heracx-bg-black heracx-bg-opacity-75 heracx-flex heracx-justify-center heracx-items-center heracx-z-50"
          onClick={handleOverlayClick}
        >
          <img
            src={imageSrc}
            alt="Full view"
            className="heracx-max-w-full heracx-max-h-full heracx-object-contain heracx-rounded-md"
          />
        </div>
      )}
    </>
  );
};

export default ImagePreview;
