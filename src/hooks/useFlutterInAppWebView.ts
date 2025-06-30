import { useCallback } from "react";

type SendDataToFlutterProps = {
  handlerName: string;
  data: any;
};

const useFlutterHandler = () => {
  const sendData = useCallback(
    async ({ handlerName, data }: SendDataToFlutterProps) => {
      if (window.flutter_inappwebview) {
        try {
          const response = await window.flutter_inappwebview.callHandler(
            handlerName,
            data
          );
          console.log("Response from Flutter:", response);
          return response;
        } catch (error) {
          console.error("Error sending data to Flutter:", error);
          throw new Error("Failed to send data to Flutter");
        }
      } else {
        console.warn("Flutter InAppWebView is not available.");
        return null;
      }
    },
    []
  );

  return {
    isActive: !!window.flutter_inappwebview,
    sendData
  };
};

export default useFlutterHandler;
