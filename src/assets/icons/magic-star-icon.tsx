import { forwardRef } from "react";

interface MagicStarIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  className?: string;
}

const MagicStarIcon = forwardRef<SVGSVGElement, MagicStarIconProps>(
  ({ color = "#FFC73A", className, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        {...props}
      >
        <path
          d="M14.4082 3.4508L14.3499 6.60913C14.3415 7.04246 14.6166 7.61746 14.9666 7.8758L17.0332 9.44247C18.3582 10.4425 18.1416 11.6675 16.5582 12.1675L13.8666 13.0091C13.4166 13.1508 12.9416 13.6425 12.8249 14.1008L12.1832 16.5508C11.6749 18.4841 10.4082 18.6758 9.35821 16.9758L7.89154 14.6008C7.62487 14.1675 6.99154 13.8425 6.49154 13.8675L3.70824 14.0091C1.71657 14.1091 1.1499 12.9591 2.4499 11.4425L4.09988 9.52579C4.40821 9.16746 4.54988 8.5008 4.40821 8.0508L3.56659 5.35913C3.07492 3.77579 3.95824 2.9008 5.53324 3.41747L7.99158 4.22581C8.40825 4.35914 9.03324 4.26746 9.38324 4.00913L11.9499 2.15913C13.3333 1.15913 14.4415 1.74247 14.4082 3.4508Z"
          fill={color}
        />
        <path
          opacity="0.4"
          d="M17.8669 17.0578L15.3419 14.5328C15.1003 14.2911 14.7003 14.2911 14.4586 14.5328C14.2169 14.7745 14.2169 15.1745 14.4586 15.4161L16.9836 17.9411C17.1086 18.0661 17.2669 18.1245 17.4253 18.1245C17.5836 18.1245 17.7419 18.0661 17.8669 17.9411C18.1086 17.6995 18.1086 17.2995 17.8669 17.0578Z"
          fill={color}
        />
      </svg>
    );
  },
);

MagicStarIcon.displayName = "MagicStarIcon";

export default MagicStarIcon;
