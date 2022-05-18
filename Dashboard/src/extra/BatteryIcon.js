import Icon from "@ant-design/icons";

const icon = () => (
  <svg width="1em" height="1em" fill="currentColor" viewBox="64 64 896 896">
    <path d="M824.1 422c11 0 20 9 20 20v240c0 11-9 20-20 20h-680c-11 0-20-9-20-20V442c0-11 9-20 20-20h680m0-60h-680c-44.2 0-80 35.8-80 80v240c0 44.2 35.8 80 80 80h680c44.2 0 80-35.8 80-80V442c0-44.2-35.8-80-80-80z" />
    <path d="M932.1 462h-28v200h28c15.5 0 28-12.5 28-28V490c0-15.5-12.5-28-28-28z" />
    <path d="M144.1 442h680v240h-680z" />
  </svg>
);

export const BatteryIcon = (props) => <Icon component={icon} />;
