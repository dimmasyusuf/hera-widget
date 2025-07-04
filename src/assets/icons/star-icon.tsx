import { forwardRef } from "react";

interface StarIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  className?: string;
}

const StarIcon = forwardRef<SVGSVGElement, StarIconProps>(
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
          d="M11.4421 2.92422L12.9087 5.85755C13.1087 6.26589 13.6421 6.65755 14.0921 6.73255L16.7504 7.17422C18.4504 7.45755 18.8504 8.69089 17.6254 9.90755L15.5587 11.9742C15.2087 12.3242 15.0171 12.9992 15.1254 13.4826L15.7171 16.0409C16.1837 18.0659 15.1087 18.8492 13.3171 17.7909L10.8254 16.3159C10.3754 16.0492 9.63375 16.0492 9.17541 16.3159L6.68375 17.7909C4.90041 18.8492 3.81708 18.0576 4.28375 16.0409L4.87541 13.4826C4.98375 12.9992 4.79208 12.3242 4.44208 11.9742L2.37541 9.90755C1.15875 8.69089 1.55041 7.45755 3.25041 7.17422L5.90875 6.73255C6.35041 6.65755 6.88375 6.26589 7.08375 5.85755L8.55041 2.92422C9.35041 1.33255 10.6504 1.33255 11.4421 2.92422Z"
          fill={color}
        />
      </svg>
    );
  },
);

StarIcon.displayName = "StarIcon";

export default StarIcon;
