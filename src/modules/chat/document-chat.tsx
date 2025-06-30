import { useMemo } from "react";
import { Message } from "../../api/type";
import FlexLayout from "../../components/layout-flex";
import FilePreview from "../../components/file-preview/file-preview";

type Props = {
  content: Message;
  isLoading?: boolean;
  isLast?: boolean;
  convo_id?: string;
  last_chat_id?: string;
};

export default function DocumentChat(props: Props) {
  const fileUrls = useMemo(() => {
    return props.content.payload.content as string[];
  }, [props.content.payload.content]);

  return (
    <FlexLayout direction="column">
      {fileUrls.map((url, index) => (
        <FilePreview key={url + index} url={url} />
      ))}
    </FlexLayout>
  );
}
