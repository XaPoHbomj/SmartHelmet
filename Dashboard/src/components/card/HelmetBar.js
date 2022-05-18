import { Badge, Button, Space, Tooltip } from "antd";
import { ThunderboltOutlined, CopyOutlined } from "@ant-design/icons";

const chargingIconStyle = {
  color: "orange"
};

const connectionStates = {
  online: {
    status: "success",
    tooltip: "В сети"
  },
  offline: {
    status: "error",
    tooltip: "Не в сети"
  }
};

export default function HelmetBar(props) {
  const view = props.isOnline
    ? connectionStates.online
    : connectionStates.offline;

  return (
    <Space>
      <Tooltip title={view.tooltip}>
        <Badge status={view.status} />
      </Tooltip>
      {props.identificator ?? "Идентификатор не определен"}
      {props.identificator && (
        <Tooltip title="Скопировать в буфер обмена">
          <Button
            type="text"
            icon={<CopyOutlined />}
            onClick={() => props.onIdentificatorCopying(props.identificator)}
          />
        </Tooltip>
      )}
      {props.charging && (
        <Tooltip title="Заряжается">
          <ThunderboltOutlined style={chargingIconStyle} />
        </Tooltip>
      )}
    </Space>
  );
}
