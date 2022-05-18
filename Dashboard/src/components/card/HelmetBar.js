import { Badge, Button, Space, Tooltip } from "antd";
import { ThunderboltOutlined, CopyOutlined } from "@ant-design/icons";
import { useEffect, useRef } from "react";

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
  const identificatorNode = useRef(null)

  useEffect(() => {
    identificatorNode.current.parentNode.style.minWidth = '250px'
  }, [identificatorNode])

  const view = props.isOnline
    ? connectionStates.online
    : connectionStates.offline;

  return (
    <Space>
      <Tooltip title={view.tooltip}>
        <Badge status={view.status} />
      </Tooltip>
      <div ref={identificatorNode}>
        {props.identificator ?? "Идентификатор не определен"}
      </div>
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
