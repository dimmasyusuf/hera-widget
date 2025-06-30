import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { isImageLink } from "../../lib/helper";
import useFlutterHandler from "../../hooks/useFlutterInAppWebView";
import { transformUrl } from "../../lib/trasnformUrlToRoute";

export const TextRenderer = ({
  text,
  last_item,
  isSuccess,
  isUser
}: {
  text: string;
  last_item?: boolean;
  isSuccess?: boolean;
  isUser?: boolean;
}) => {
  const { isActive: isUseFlutter, sendData: sendDataToFlutter } =
    useFlutterHandler();

  const processText = (text: string) => {
    if (!text) return "";

    return text
      .replace(/\\n/g, "\n")
      .replace(/\n\s*\n/g, "\n\n")
      .trim();
  };

  const textData = processText(text);

  if (!isUser) {
    return (
      <div className="heracx-overflow-x-auto heracx-text-sm">
        <Markdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            a: ({ children, href }) =>
              isUseFlutter ? (
                <span
                  className="heracx-text-teal-500 heracx-break-keep heracx-underline"
                  onClick={() => {
                    if (href) {
                      const payload = transformUrl(href);
                      sendDataToFlutter({
                        handlerName: "routeToPage",
                        data: payload
                      });
                    }
                  }}
                >
                  {children}
                </span>
              ) : (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={href}
                  className="heracx-text-teal-500 heracx-break-all"
                >
                  {children}
                </a>
              ),
            p: ({ children }) => (
              <p className="heracx-mx-0 heracx-mt-3 heracx-mb-1 first:heracx-mt-0 last:heracx-mb-0 heracx-break-words heracx-whitespace-pre-wrap">
                {children}
              </p>
            ),
            ol: ({ children }) => (
              <ol className="heracx-space-y-1 heracx-list-decimal heracx-pl-5">
                {children}
              </ol>
            ),
            ul: ({ children }) => (
              <ul className="heracx-space-y-1 heracx-list-disc heracx-pl-5">
                {children}
              </ul>
            ),
            li: ({ children }) => (
              <li className="heracx-mb=2 last:heracx-mb-0">{children}</li>
            ),
            img: ({ src, alt }) => (
              <img
                src={src}
                alt={alt}
                className="heracx-max-w-full heracx-h-auto heracx-rounded-md heracx-my-4"
                style={{ objectFit: "cover" }}
              />
            )
          }}
        >
          {textData}
        </Markdown>
      </div>
    );
  }

  return (
    <div className="heracx-space-y-1">
      {isImageLink(text) && !isUser ? (
        <img
          src={textData}
          alt={textData}
          className="heracx-max-w-full heracx-h-auto heracx-rounded-md heracx-my-4"
          style={{ objectFit: "cover" }}
        />
      ) : (
        <>
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              a: ({ children, href }) => (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={href}
                  className="heracx-text-teal-500 heracx-text-xs"
                >
                  {children}
                </a>
              ),
              p: ({ children }) => (
                <p className="heracx-m-0 heracx-break-words heracx-whitespace-pre-wrap heracx-text-xs">
                  {children}
                </p>
              ),
              ol: ({ children }) => (
                <ol className="heracx-space-y-1 heracx-list-decimal heracx-pl-4 heracx-text-xs">
                  {children}
                </ol>
              ),
              ul: ({ children }) => (
                <ul className="heracx-space-y-1 heracx-list-disc heracx-pl-4">
                  {children}
                </ul>
              ),
              li: ({ children }) => <li>{children}</li>,
              img: ({ src, alt }) => (
                <img
                  src={src}
                  alt={alt}
                  className="heracx-max-w-full heracx-h-auto heracx-rounded-md heracx-my-4"
                  style={{ objectFit: "cover" }}
                />
              )
            }}
          >
            {textData}
          </Markdown>
          {isSuccess && last_item && (
            <span className="animate-blink heracx-w-0.5 heracx-h-3 heracx-bg-red-500 heracx-inline-block heracx-text-xs" />
          )}
        </>
      )}
    </div>
  );
};
