import { getApiUrl } from "../lib/getApiUrl";
import { getAttributeElement } from "../lib/getAttributeElement";
import { getParams } from "../lib/getParams";
import { getResponse } from "../lib/helper";
import { widgetFetch } from "./fetch";
import {
  Chat,
  ChatInput,
  CreateChatResponse,
  FeedbackInput,
  ListQueryResponse
} from "./type";

const params = getParams();
const attributes = getAttributeElement();
const defaultAPIUrl = getApiUrl();
const customAPIUrl = params?.get("api-url") || attributes.apiUrl || "";
const apiUrl = customAPIUrl || defaultAPIUrl;

export const createChat = async (props: {
  convo_id: string;
  data: ChatInput;
}) => {
  const { convo_id, data } = props;
  const url = `${apiUrl}/apps/convos/${convo_id}`;
  const response = await widgetFetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store"
  });
  return getResponse<CreateChatResponse>(response);
};

// need fix
export const streamChat = async (props: {
  convo_id: string;
  data: ChatInput;
}) => {
  const { convo_id, data } = props;
  const url = `${apiUrl}/widget/${convo_id}/chats`;
  if (data.file) {
    const formData = new FormData();
    formData.append("role", data.role);
    formData.append("message", data.message);
    formData.append("user_id", data.user_id);

    if (data.file) {
      formData.append("files", data.file);
    }

    return widgetFetch(url, {
      method: "POST",
      body: formData,
      cache: "no-store",
      credentials: "include"
    });
  } else {
    return widgetFetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json" // Inform the server of JSON content
      },
      body: JSON.stringify(data),
      cache: "no-store"
    });
  }
};

export const getChats = async (props: { convo_id: string }) => {
  const { convo_id } = props;
  const url = `${apiUrl}/widget/${convo_id}/chats`;
  const response = await widgetFetch(url, {
    cache: "no-store"
  });
  return getResponse<ListQueryResponse<Chat>>(response);
};

export const sendConversationFeedback = async (props: { convo_id: string }) => {
  const { convo_id } = props;
  const url = `${apiUrl}/widget/${convo_id}/conversation_feedback`;
  const response = await widgetFetch(url, {
    method: "POST",
    cache: "no-store"
  });
  return getResponse<{ status: string; data: { id: string; answer: string } }>(
    response
  );
};

export const sendConversationFeedbackResponse = async (props: {
  convo_id: string;
  data: FeedbackInput;
}) => {
  const { data } = props;
  const { chat_id, ...feedbackData } = data;
  const url = `${apiUrl}/widget/${chat_id}/feedback`;
  const response = await widgetFetch(url, {
    method: "POST",
    body: JSON.stringify(feedbackData),
    cache: "no-store"
  });
  return getResponse<{ status: string; data: { answer: string } }>(response);
};

export const getDownloadFileToken = async () => {
  const url = `${apiUrl}/download/generate-token`;
  const response = await widgetFetch(url, {
    method: "GET",
    cache: "no-store"
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
  return response.json();
};

export const fetchFileMetadataFromUrl = async (fileUrl: string) => {
  try {
    const response = await fetch(fileUrl, { method: "HEAD" });
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata for ${fileUrl}`);
    }

    // Extract headers
    const contentDisposition = response.headers.get("content-disposition");
    const contentLength = response.headers.get("content-length");

    // Parse file name
    const fileNameMatch = contentDisposition?.match(/filename="(.+?)"/);
    const fileName = fileNameMatch
      ? fileNameMatch[1]
      : decodeURIComponent(fileUrl.split("/").pop() || "Unknown File");

    // Parse file size
    const fileSize = contentLength
      ? `${(Number(contentLength) / 1024).toFixed(2)} KB`
      : "Unknown Size";

    return { name: fileName, size: fileSize };
  } catch (error) {
    console.error(`Error fetching metadata for ${fileUrl}:`, error);
    return { name: "Unknown File", size: "Unknown Size" };
  }
};
