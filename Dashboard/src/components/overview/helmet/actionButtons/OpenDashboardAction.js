import { LineChartOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

const baseActionStyle = {
  color: "#40a9ff"
};

export default function OpenDashboardAction(props) {
  const onClick = () => props.onExecute && props.onExecute(props.identificator);
  
  return (
    <Tooltip title="Статистика" placement="bottom">
      <LineChartOutlined
        key="openDashboard"
        onClick={onClick}
        style={baseActionStyle}
      />
    </Tooltip>
  );
}
