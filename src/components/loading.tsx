import { BounceLoader } from "react-spinners";
import useConfig from "../hooks/useConfig";

const Loading = () => {
  const { accent_color } = useConfig();
  return (
    <div className="heracx-w-full heracx-h-full heracx-flex heracx-justify-center heracx-items-center">
      <BounceLoader color={accent_color || "#546FFF"} />
    </div>
  );
};

export default Loading;
