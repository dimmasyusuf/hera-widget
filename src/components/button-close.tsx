import { useWidgetContext } from "../providers/WidgetProvider";
import TrashIcon from "./icons/TrashIcon";

const CloseSessionButton = ({ buttonColor }: { buttonColor?: string }) => {
  const { setState } = useWidgetContext();

  const handleCloseSession = () => {
    localStorage.clear();
    setState(prev => ({ ...prev, convo_id: undefined, user_id: undefined }));
  };

  return (
    <div
      onClick={handleCloseSession}
      className="heracx-cursor-pointer heracx-flex"
    >
      <TrashIcon
        className="heracx-h-6 heracx-w-6 hover:heracx-cursor-pointer"
        color={buttonColor}
      />
    </div>
  );
};

export default CloseSessionButton;
