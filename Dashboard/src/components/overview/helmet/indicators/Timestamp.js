import Indicator from "./Indicator";
import { SyncOutlined } from "@ant-design/icons";

export default function Timestamp(props) {
  return (
    <Indicator
      icon={<SyncOutlined />}
      value={props.value}
      tooltip="Дата получения данных сервером"
    />
  );
}
