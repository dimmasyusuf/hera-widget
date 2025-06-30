import React from "react";
import FlexLayout from "./layout-flex";

type Props = {
  message?: string;
  autoHide?: boolean;
};

const AlertError = ({ message, autoHide = false }: Props) => {
  const [visible, setVisible] = React.useState(true);
  React.useEffect(() => {
    setTimeout(() => {
      if (!autoHide) return;
      setVisible(false);
    }, 2345);
  });
  if (!visible) return null;
  return (
    <FlexLayout className="heracx-text-sm heracx-px-6 heracx-py-4 heracx-bg-red-50 heracx-text-red-700 heracx-border-0 heracx-border-b heracx-border-solid heracx-border-red-100">
      {message || "Oops! something wrong in our system!"}
    </FlexLayout>
  );
};

export default AlertError;
