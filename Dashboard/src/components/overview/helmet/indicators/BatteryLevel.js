import Indicator from "./Indicator";
import { BatteryIcon } from "../../../../extra/BatteryIcon";

export default function BatteryLevel(props) {
  return (
    <Indicator
      icon={<BatteryIcon />}
      value={props.value}
      tooltip="Заряд батареи"
    />
  );
}
