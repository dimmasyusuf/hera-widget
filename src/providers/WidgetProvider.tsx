import * as React from "react";
import { getParams } from "../lib/getParams";
import store from "store2";
import useAttributeConfig from "../hooks/useAttributeConfig";

const DEFAULT_STORE_KEY = "heracx-userdata";

interface StoreProps {}

interface ProviderProps extends StoreProps {
  children?: React.ReactNode;
}

type ContextType = {
  setState: React.Dispatch<React.SetStateAction<ContextType["state"]>>;
  state: {
    open: boolean;
    fullscreen: boolean;
    convo_id?: string;
    user_id?: string;
  };
  data: {};
  action: {};
};

const initialValues: ContextType = {
  setState: () => {},
  state: {
    open: false,
    fullscreen: false
  },
  data: {},
  action: {}
};

const context = React.createContext<ContextType>(initialValues);

export const useWidgetContext = () => {
  const store = React.useContext(context);
  if (!store) {
    throw new Error(
      "Cannot use `useWidgetContext` outside of a WidgetProvider"
    );
  }
  return store;
};

const Store = (props: StoreProps) => {
  const attributes = useAttributeConfig();

  const params = getParams();
  const stateParams = params?.get("state")?.split(",");

  const [state, setState] = React.useState<ContextType["state"]>({
    ...initialValues.state,
    fullscreen:
      !!stateParams?.includes("fullscreen") || !!attributes.fullscreen,
    open: !!stateParams?.includes("open") || !!attributes.fullscreen
  });

  const lsData = store.get(DEFAULT_STORE_KEY) || attributes.user;

  React.useEffect(() => {
    if (!lsData) {
      setState(prev => ({ ...prev, convo_id: undefined }));
    }
  }, [lsData]);

  return {
    state,
    setState,
    data: {},
    action: {}
  };
};

export const WidgetProvider = (props: ProviderProps) => {
  const { children, ...storeData } = props;
  return <context.Provider value={Store(storeData)} {...props} />;
};
