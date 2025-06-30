import { motion } from "motion/react";

import BoxContainer from "./components/box-container";
import LauncherButton from "./components/button-launcher";

import { classNames } from "./lib/helper";

import useAttributeConfig from "./hooks/useAttributeConfig";

import { useWidgetContext } from "./providers/WidgetProvider";

function App() {
  const {
    state: { open, fullscreen },
    setState,
  } = useWidgetContext();
  const attributes = useAttributeConfig();
  const showChatbox = open;
  const showLauncherButton = !fullscreen || !open;

  return (
    <div
      id="heracx"
      className={classNames(
        "heracx-text-md heracx-fixed heracx-bottom-0 heracx-right-0 heracx-box-border heracx-flex heracx-flex-col heracx-justify-end heracx-gap-5",
        open && "heracx-h-screen",
        open &&
          (fullscreen
            ? "heracx-w-screen"
            : "heracx-w-screen sm:heracx-w-[85vw] md:heracx-w-[500px]"),
        attributes.fullscreen ? "heracx-p-0" : "heracx-p-6",
      )}
      style={{ zIndex: 9999 }}
    >
      {showChatbox && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
          className="heracx-h-full"
        >
          <BoxContainer />
        </motion.div>
      )}

      {showLauncherButton && (
        <div className="heracx-flex heracx-justify-end">
          <LauncherButton
            onClick={() => {
              setState((prev) => ({ ...prev, open: !prev.open }));
            }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
