import useConfig from "../hooks/useConfig";
import RecordingIcon from "./icons/RecordingIcon";

const RecordAudioButton = () => {
  const { accent_color } = useConfig();

  const handleButtonClick = () => {};

  return (
    <div
      className="heracx-w-6 heracx-h-6 heracx-flex heracx-items-center heracx-justify-center heracx-cursor-pointer heracx-text-gray-500 hover:heracx-text-blue-500"
      onClick={handleButtonClick}
    >
      <RecordingIcon color={accent_color || "#546FFF"} />
    </div>
  );
};

export default RecordAudioButton;
