import { EllipsisOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

export default function OpenDashboardAction(props) {
  const onClick = () => props.onExecute && props.onExecute(props.identificator);
  
  return (
    <Tooltip title="Статистика" placement="bottom">
      <EllipsisOutlined
        key="openDashboard"
        onClick={onClick}
      />
    </Tooltip>
  );
}
