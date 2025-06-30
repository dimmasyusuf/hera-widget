import { useEffect, useState } from "react";

export default function BlinkStarIcon({ className }: { className?: string }) {
  const useAnimateColor = () => {
    const [color, setColor] = useState("#FFC73A");

    useEffect(() => {
      const interval = setInterval(() => {
        setColor(prev => {
          if (prev == "#FFC73A") return "#8E92BC";
          return "#FFC73A";
        });
      }, 300);

      return () => clearInterval(interval);
    });

    return `${color}`;
  };

  const animateColor = useAnimateColor();

  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.4072 3.44982L14.3489 6.60815C14.3406 7.04148 14.6156 7.61649 14.9656 7.87482L17.0323 9.44149C18.3573 10.4415 18.1406 11.6665 16.5572 12.1665L13.8656 13.0082C13.4156 13.1498 12.9406 13.6415 12.8239 14.0998L12.1822 16.5498C11.6739 18.4832 10.4072 18.6748 9.35724 16.9748L7.89056 14.5998C7.62389 14.1665 6.99057 13.8415 6.49057 13.8665L3.70726 14.0082C1.7156 14.1082 1.14892 12.9582 2.44892 11.4415L4.0989 9.52482C4.40724 9.16648 4.5489 8.49983 4.40723 8.04983L3.56561 5.35815C3.07394 3.77482 3.95726 2.89983 5.53226 3.41649L7.99061 4.22483C8.40727 4.35816 9.03226 4.26649 9.38226 4.00815L11.9489 2.15815C13.3323 1.15815 14.4406 1.74149 14.4072 3.44982Z"
        fill={animateColor}
      />
      <path
        opacity="0.4"
        d="M17.8669 17.0588L15.3419 14.5338C15.1003 14.2921 14.7003 14.2921 14.4586 14.5338C14.2169 14.7755 14.2169 15.1755 14.4586 15.4171L16.9836 17.9421C17.1086 18.0671 17.2669 18.1255 17.4253 18.1255C17.5836 18.1255 17.7419 18.0671 17.8669 17.9421C18.1086 17.7005 18.1086 17.3005 17.8669 17.0588Z"
        fill={animateColor}
      />
    </svg>
  );
}
