import Indicator from "./Indicator";
import { SignalFilled } from "@ant-design/icons";

export default function SignalLevel(props) {
  const percentages = `${props.value}%`;

  return (
    <Indicator
      icon={<SignalFilled />}
      value={percentages}
      tooltip="Уровень сигнала"
    />
  );
}
