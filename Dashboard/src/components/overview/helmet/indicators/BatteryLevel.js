import Indicator from "./Indicator";
import { BatteryIcon } from "../../../../extra/BatteryIcon";

export default function BatteryLevel(props) {
  const percentages = `${props.value}%`;

  return (
    <Indicator
      icon={<BatteryIcon />}
      value={percentages}
      tooltip="Заряд батареи"
    />
  );
}
