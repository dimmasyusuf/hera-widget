import {
  useIsFetching,
  useIsMutating,
  useMutation,
  useQuery,
  useQueryClient
} from "react-query";
import {
  createChat,
  getChats,
  sendConversationFeedback,
  sendConversationFeedbackResponse,
  streamChat
} from "../api/convo";
import {
  Chat,
  ChatInput,
  CreateChatResponse,
  FeedbackInput,
  Message,
  MutationResponse
} from "../api/type";
import { nanoid } from "nanoid";
import { produce } from "immer";
import { getResponse, safeJSONParse } from "../lib/helper";
import React, { useCallback } from "react";

const getChat = (val: string): string | string[] => {
  const splitter = "}{";
  if (!val.includes(splitter)) {
    return val;
  } else {
    return val.replaceAll("}{", "}[__splitter__]{").split("[__splitter__]");
  }
};

function getChatType(value: string): string | "old-text" {
  const parsed = safeJSONParse<{ type: string }>({ value });
  if (typeof parsed === "string") return "old-text";
  return parsed.type;
}

const listQueryFn = async (convo_id: string) => {
  const r = await getChats({ convo_id });
  if (r.status !== 200) {
    throw new Error(r.response.json.message || r.response.text || r.statusText);
  }
  return r.response.json.items;
};

const createMutationFn = async (params: {
  convo_id: string;
  data: ChatInput;
}) => {
  const r = await createChat(params);
  if (r.status !== 200) {
    throw new Error(r.response.json.message || r.statusText || r.response.text);
  }
  return r.response.json;
};

const sendFeedbackMutationFn = async (params: { convo_id: string }) => {
  const r = await sendConversationFeedback(params);
  if (r.status !== 200) {
    throw new Error(r.statusText || r.response.text);
  }
  return r.response.json;
};

const sendFeedbackResponseMutationFn = async (params: {
  convo_id: string;
  data: FeedbackInput;
}) => {
  const r = await sendConversationFeedbackResponse(params);
  if (r.status !== 200) {
    throw new Error(r.statusText || r.response.text);
  }
  return r.response.json;
};

const streamMutationFn = async (params: {
  convo_id: string;
  data: ChatInput;
}) => {
  const r = await streamChat(params);
  if (r.status !== 200 || !r.body) {
    const {
      response: { json, text }
    } = await getResponse<MutationResponse>(r);
    throw new Error(
      json.message ||
        text ||
        r.statusText ||
        "Something wrong while sending message"
    );
  }
  return r.body;
};

type Props = {
  convo_id: string;
  events?: {
    onListError?: (e: Error) => void;
    onCreateSuccess?: (r: CreateChatResponse, d: ChatInput) => void;
    onCreateMutate?: (d: ChatInput) => void;
  };
};

const cleanText = (text: string) => {
  return text
    .replace(/\\n/g, " ")
    .replace(/\\r/g, " ")
    .replace(/[\n\r]/g, " ")
    .replace(/\W/g, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/[^a-z0-9\s]/gi, "")
    .trim();
};

const useConvoOperation = (props: Props) => {
  const { convo_id } = props;
  const itemsQueryKey = ["chat", "list", convo_id];
  const localItemsQueryKey = ["chat", "list-local", convo_id];
  const createQueryKey = ["chat", "create", convo_id];
  const streamQueryKey = ["chat", "stream", convo_id];
  const sendFeedbackKey = ["chat", "feedback", convo_id];
  const sendFeedbackResponseKey = ["chat", "feedback-response", convo_id];
  const queryClient = useQueryClient();

  const itemsQuery = useQuery({
    queryKey: itemsQueryKey,
    queryFn: () => listQueryFn(convo_id),
    onError: (e: Error) => {
      props?.events?.onListError?.(e);
    },
    onSuccess: () => {}
  });
  const chats = itemsQuery.data || null;

  const itemsLocalQuery = useQuery({
    queryKey: localItemsQueryKey,
    queryFn: () => {
      return [] as Chat[];
    }
  });
  const localChats = itemsLocalQuery.data;

  React.useEffect(() => {
    if (Array.isArray(chats)) {
      queryClient.setQueryData<Chat[]>(localItemsQueryKey, prev => {
        if (!chats.length) return prev || [];

        let lastChat = chats[chats.length - 1];
        let isAlready = false;
        prev?.forEach((c, i) => {
          if (c.id === lastChat?.id) {
            isAlready = true;
          } else {
            const isTextMessage = typeof c.message === "string";
            const lastChatIsTextMessage = typeof lastChat.message === "string";
            if (isTextMessage && lastChatIsTextMessage) {
              const cTxt = cleanText(c.message as string);
              const lastTxt = cleanText(lastChat.message as string);
              if (cTxt === lastTxt) isAlready = true;
            } else if (!isTextMessage && lastChatIsTextMessage) {
              const firstMessage = c.message[0] as Message;
              if (firstMessage.type === "text") {
                const cTxt = cleanText(firstMessage.payload.content as string);
                const lastTxt = cleanText(lastChat.message as string);
                if (cTxt === lastTxt) isAlready = true;
              }
            } else if (isTextMessage && !lastChatIsTextMessage) {
              const firstMessage = lastChat.message[0] as Message;
              if (firstMessage.type === "text") {
                const cTxt = cleanText(c.message as string);
                const lastTxt = cleanText(
                  firstMessage.payload.content as string
                );
                if (cTxt === lastTxt) isAlready = true;
              }
            }
          }
        });

        if (isAlready) return prev || [];

        return [...(prev || []), lastChat];
      });
    }
  }, [chats]);

  const streamMutation = useMutation({
    mutationKey: streamQueryKey,
    mutationFn: streamMutationFn,
    onSuccess: async () => {},
    onSettled: () => {},
    onMutate: async ({ data }: { data: ChatInput }) => {
      const { message, ...otherData } = data;
      await queryClient.cancelQueries({ queryKey: itemsQueryKey });

      const prevItems = queryClient.getQueryData<Chat[]>(localItemsQueryKey);
      queryClient.setQueryData<Chat[]>(localItemsQueryKey, prev => [
        ...(prev || []),
        {
          id: nanoid(8),
          created_at: new Date(),
          message: [
            {
              type: "text",
              payload: {
                content: message
              }
            }
          ],
          ...otherData
        }
      ]);
      return { prevItems };
    },
    onError: (e, v, context) => {
      queryClient.setQueryData(localItemsQueryKey, context?.prevItems);
    }
  });

  const stream = (data: ChatInput) => {
    streamMutation.mutate(
      {
        convo_id,
        data
      },
      {
        onSuccess: async body => {
          const reader = body.getReader();
          const decoder = new TextDecoder();

          let reading = true;
          while (reading) {
            const { done, value } = await reader.read();
            const chunk = decoder.decode(value);

            if (!chunk) {
              if (done) {
                reading = false;
                streamMutation.reset();
                queryClient.invalidateQueries({ queryKey: itemsQueryKey });
              }
              continue;
            }

            const chunks = chunk.split("streamData:").filter(val => {
              return !!val;
            });

            chunks.forEach(c => {
              const ch = getChat(c) as string;
              const parsedContent = safeJSONParse({ value: ch });

              const isChObject = typeof parsedContent !== "string";
              if (isChObject) {
                if (Array.isArray(parsedContent)) {
                  queryClient.setQueryData<Chat[]>(localItemsQueryKey, prev => {
                    const prevChats = prev || [];
                    return produce(prevChats, draft => {
                      for (const content of parsedContent) {
                        const parse = safeJSONParse({ value: content });
                        const jsonChunk = parse as Message;
                        if (jsonChunk.payload?.content) {
                          draft.push({
                            id: nanoid(8),
                            created_at: new Date(),
                            role: "assistant",
                            message: [
                              {
                                type: jsonChunk.type,
                                payload: jsonChunk.payload
                              }
                            ]
                          });
                        }
                      }
                    });
                  });
                } else {
                  const jsonChunk = parsedContent as Message;
                  if (jsonChunk.payload?.content) {
                    queryClient.setQueryData<Chat[]>(
                      localItemsQueryKey,
                      prev => {
                        const prevChats = prev || [];
                        return produce(prevChats, draft => {
                          const lastIndex = draft.length - 1;
                          const lastMessage = draft[lastIndex];
                          if (jsonChunk.type === "text") {
                            const content = jsonChunk.payload.content as string;
                            if (lastMessage.role === "user") {
                              draft.push({
                                id: nanoid(8),
                                created_at: new Date(),
                                role: "assistant",
                                message: content
                              });
                            } else {
                              const lastMessageIsText =
                                typeof lastMessage.message === "string";
                              if (lastMessageIsText) {
                                lastMessage.message =
                                  lastMessage.message + content;
                              } else {
                                draft.push({
                                  id: nanoid(8),
                                  created_at: new Date(),
                                  role: "assistant",
                                  message: content
                                });
                              }
                            }
                          } else {
                            draft.push({
                              id: nanoid(8),
                              created_at: new Date(),
                              role: "assistant",
                              message: [
                                {
                                  type: jsonChunk.type,
                                  payload: jsonChunk.payload
                                }
                              ]
                            });
                          }
                        });
                      }
                    );
                  }
                }
              } else {
                queryClient.setQueryData<Chat[]>(localItemsQueryKey, prev => {
                  const prevChats = prev || [];
                  const jsonChunk = parsedContent as string;
                  return produce(prevChats, draft => {
                    const lastIndex = draft.length - 1;
                    const lastMessage = draft[lastIndex];

                    if (lastMessage.role === "user") {
                      draft.push({
                        id: nanoid(8),
                        created_at: new Date(),
                        role: "assistant",
                        message: jsonChunk
                      });
                    } else {
                      const lastMessageIsText =
                        typeof lastMessage.message === "string";
                      if (lastMessageIsText) {
                        lastMessage.message = lastMessage.message + jsonChunk;
                      } else {
                        draft.push({
                          id: nanoid(8),
                          created_at: new Date(),
                          role: "assistant",
                          message: jsonChunk
                        });
                      }
                    }
                  });
                });
              }
            });

            if (done) {
              reading = false;
              streamMutation.reset();
              return queryClient.invalidateQueries({ queryKey: itemsQueryKey });
            }
          }
        },
        onError: async () => {
          streamMutation.reset();
          return queryClient.invalidateQueries({ queryKey: itemsQueryKey });
        }
      }
    );
  };

  const createMutation = useMutation({
    mutationKey: createQueryKey,
    mutationFn: createMutationFn,
    onSuccess: data => {
      queryClient.setQueryData<Chat[]>(itemsQueryKey, prev => [
        ...(prev || []),
        {
          id: data.answer?.conversation_id || nanoid(8),
          created_at: new Date(),
          role: "assistant",
          message: [
            {
              type: "text",
              payload: {
                content: data.answer?.response[0].text || "N/A"
              }
            }
          ]
        }
      ]);
    },

    onMutate: async ({ data }: { data: ChatInput }) => {
      const { message, ...otherData } = data;
      await queryClient.cancelQueries({ queryKey: itemsQueryKey });
      const prevItems = queryClient.getQueryData<Chat[]>(itemsQueryKey);
      queryClient.setQueryData<Chat[]>(itemsQueryKey, prev => [
        ...(prev || []),
        {
          id: "",
          created_at: new Date(),
          message: [
            {
              type: "text",
              payload: {
                content: message
              }
            }
          ],
          ...otherData
        }
      ]);
      return { prevItems };
    },
    onError: (e, v, context) => {
      queryClient.setQueryData(itemsQueryKey, context?.prevItems);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: itemsQueryKey });
    }
  });

  const create = (data: ChatInput) => {
    createMutation.mutate({
      convo_id,
      data
    });
  };

  const feedbackResponseMutation = useMutation({
    mutationKey: sendFeedbackResponseKey,
    mutationFn: sendFeedbackResponseMutationFn
    // onSuccess: async data => {
    //   queryClient.setQueryData<Chat[]>(itemsQueryKey, prev => [
    //     ...(prev || []),
    //     {
    //       id: nanoid(8),
    //       created_at: new Date(),
    //       role: "assistant",
    //       message: "Terima kasih atas feedback Anda!"
    //     }
    //   ]);
    // },
    // onError: async () => {
    //   queryClient.setQueryData<Chat[]>(itemsQueryKey, prev => [
    //     ...(prev || []),
    //     {
    //       id: nanoid(8),
    //       created_at: new Date(),
    //       role: "assistant",
    //       message: "Error submiting feedback"
    //     }
    //   ]);
    // }
  });
  const sendFeedbackResponse = (data: FeedbackInput) => {
    feedbackResponseMutation.mutate({
      convo_id,
      data
    });
  };

  const feedbackMutation = useMutation({
    mutationKey: sendFeedbackKey,
    mutationFn: sendFeedbackMutationFn,
    onSuccess: async data => {
      queryClient.setQueryData<Chat[]>(itemsQueryKey, prev => [
        ...(prev || []),
        {
          id: data.data.id || nanoid(8),
          created_at: new Date(),
          role: "assistant",
          type: "feedback_chat",
          message: data.data.answer || "N/A"
        }
      ]);
    }
  });

  const sendFeedback = useCallback(() => {
    feedbackMutation.mutate({
      convo_id
    });
  }, []);

  const isListFetching = !!useIsFetching({ queryKey: ["chat", "list"] });
  const isCreateMutating = !!useIsMutating({ mutationKey: ["chat", "create"] });
  const isStreamMutating = !!useIsMutating({ mutationKey: streamQueryKey });
  const isSendFeebackMutating = !!useIsMutating({
    mutationKey: sendFeedbackKey
  });

  return {
    data: {
      chats: localChats,
      isStreaming: streamMutation.data?.locked === true
    },
    variables: {
      create: createMutation.variables
    },
    status: {
      list: {
        error: itemsQuery.error as Error,
        loading: itemsQuery.isLoading,
        fetching: itemsQuery.isFetching || isListFetching
      },
      create: {
        error: createMutation.error as Error,
        busy: isCreateMutating
      },
      stream: {
        idle: streamMutation.isIdle,
        error: streamMutation.error as Error,
        busy: isStreamMutating
      },
      sendFeedback: {
        idle: feedbackMutation.isIdle,
        error: feedbackMutation.error as Error,
        busy: isSendFeebackMutating
      }
    },
    action: {
      create,
      stream,
      sendFeedback,
      sendFeedbackResponse
    }
  };
};

export default useConvoOperation;
