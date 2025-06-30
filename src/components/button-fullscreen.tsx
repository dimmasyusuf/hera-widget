import { useWidgetContext } from "../providers/WidgetProvider";
import MaximizeIcon from "./icons/MaximizeIcon";
import MinimizeIcon from "./icons/MinimizeIcon";

const FullscreenButton = ({ buttonColor }: { buttonColor?: string }) => {
  const { state, setState } = useWidgetContext();
  const toggle = () => {
    setState(prev => ({ ...prev, fullscreen: !prev.fullscreen }));
  };
  if (state.fullscreen)
    return (
      <div className="heracx-cursor-pointer heracx-flex" onClick={toggle}>
        <MinimizeIcon
          className="heracx-h-6 heracx-w-6 hover:heracx-cursor-pointer"
          color={buttonColor}
        />
      </div>
    );
  return (
    <div className="heracx-cursor-pointer heracx-flex" onClick={toggle}>
      <MaximizeIcon
        className="heracx-h-6 heracx-w-6 hover:heracx-cursor-pointer"
        color={buttonColor}
      />
    </div>
  );
};

export default FullscreenButton;
