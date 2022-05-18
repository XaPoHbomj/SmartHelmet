import Indicator from "./Indicator";
import { BatteryIcon } from "../../../extra/BatteryIcon";

export default function BatteryLevel(props) {
  const batteryLevel = props.value ?? 0;
  const percentages = batteryLevel * 100;

  return (
    <Indicator
      icon={<BatteryIcon />}
      value={`${percentages}%`}
      tooltip="Заряд батареи"
    />
  );
}
