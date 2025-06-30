import {
  useIsFetching,
  useIsMutating,
  useMutation,
  useQuery,
  useQueryClient
} from "react-query";
import { getWidget, initWidget } from "../api/widget";
import { getParams } from "../lib/getParams";
import {
  InitWidgetResponseData,
  MutationResponse,
  WidgetInput
} from "../api/type";
import { useState } from "react"; // Import useState for managing loading state

const detailQueryFn = async () => {
  const r = await getWidget();
  if (r.status !== 200) {
    throw new Error(r.response.json.message || r.response.text || r.statusText);
  }
  return r.response.json.data;
};

const initMutationFn = async (params: WidgetInput) => {
  const r = await initWidget(params);
  if (r.status !== 200) {
    throw new Error(r.response.json.message || r.statusText || r.response.text);
  }
  return r.response.json;
};

type Props = {
  events?: {
    onInitSuccess?: (r: MutationResponse<InitWidgetResponseData>) => void;
    onInitError?: (e: Error) => void;
    onDetailError?: (e: Error) => void;
    onReset?: () => void;
  };
};

const useWidgetOperation = (props?: Props) => {
  const params = getParams();
  const d = params?.get("d");

  const queryClient = useQueryClient();
  const [isResetting, setIsResetting] = useState(false); // State for reset loading

  const itemQuery = useQuery({
    queryKey: ["widget", "detail"],
    queryFn: detailQueryFn,
    enabled: !d,
    onError: (e: Error) => {
      props?.events?.onDetailError?.(e);
    }
  });
  const widget = itemQuery.data || null;

  const initMutation = useMutation({
    mutationKey: ["widget", "init"],
    mutationFn: initMutationFn,
    onSuccess: r => {
      queryClient.invalidateQueries("widget");
      props?.events?.onInitSuccess?.(r);
    },
    onError: (e: Error) => {
      props?.events?.onInitError?.(e);
    }
  });
  const init = (data: WidgetInput) => {
    initMutation.mutate(data);
  };

  const resetWidget = async () => {
    localStorage.clear();
    queryClient.invalidateQueries("widget");
    setIsResetting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsResetting(false);
    props?.events?.onReset?.();
  };

  const isInitMutating = !!useIsMutating({ mutationKey: ["widget", "init"] });
  const isDetailFetching = !!useIsFetching({ queryKey: ["widget", "detail"] });

  return {
    data: {
      widget
    },
    status: {
      init: {
        error: initMutation.error as Error,
        busy: initMutation.isLoading || isInitMutating
      },
      detail: {
        error: itemQuery.error as Error,
        loading: itemQuery.isLoading,
        fetching: itemQuery.isFetching || isDetailFetching
      },
      reset: {
        loading: isResetting
      }
    },
    action: {
      init,
      resetWidget
    }
  };
};

export default useWidgetOperation;
