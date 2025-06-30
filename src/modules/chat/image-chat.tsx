import { useMemo } from "react";
import { Message } from "../../api/type";
import ImagePreview from "../../components/file-preview/image-preview";
import FlexLayout from "../../components/layout-flex";

type Props = {
  content: Message;
  isLoading?: boolean;
  isLast?: boolean;
  convo_id?: string;
  last_chat_id?: string;
};

export default function ImageChat(props: Props) {
  const imageUrls = useMemo(() => {
    return props.content.payload.content as string[];
  }, [props.content.payload.content]);

  return (
    <FlexLayout direction="column">
      {imageUrls.map((url, index) => (
        <ImagePreview key={url + index} url={url} />
      ))}
    </FlexLayout>
  );
}
