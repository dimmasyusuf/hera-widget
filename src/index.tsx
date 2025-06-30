import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { addLocationChangeCallback, awaitElement, log } from "./utils";
import { QueryClient, QueryClientProvider } from "react-query";
import { WidgetProvider } from "./providers/WidgetProvider";
import { InputUploadProvider } from "./providers/InputUploadProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      refetchOnWindowFocus: false,
      retry: false
    }
  }
});

// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement
// );
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

const main = async () => {
  if (document.getElementById("flai")) {
    return;
  }
  const body = await awaitElement("body");
  const container = document.createElement("div");
  body.appendChild(container);
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <WidgetProvider>
          <InputUploadProvider>
            <App />
          </InputUploadProvider>
        </WidgetProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Call `main()` every time the page URL changes, including on first load.
addLocationChangeCallback(() => {
  // Greasemonkey doesn't bubble errors up to the main console,
  // so we have to catch them manually and log them
  main().catch(e => {
    log(e);
  });
});
