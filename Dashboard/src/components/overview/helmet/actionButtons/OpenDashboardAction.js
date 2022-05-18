import { EllipsisOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

export default function OpenDashboardAction(props) {
  return (
    <Tooltip title="Статистика" placement="bottom">
      <EllipsisOutlined
        key="openDashboard"
        onClick={() => props.onClick(props.identificator)}
      />
    </Tooltip>
  );
}
