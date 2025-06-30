interface Window {
  flutter_inappwebview?: {
    callHandler: (handlerName: string, data: any) => Promise<any>;
  };
}
