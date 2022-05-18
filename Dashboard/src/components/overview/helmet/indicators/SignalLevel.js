import Indicator from "./Indicator";
import { SignalFilled } from "@ant-design/icons";

export default function SignalLevel(props) {
  return (
    <Indicator
      icon={<SignalFilled />}
      value={props.value}
      tooltip="Уровень сигнала"
    />
  );
}
