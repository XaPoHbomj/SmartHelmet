import { Badge, Button, Space, Tooltip, Skeleton, message } from "antd";
import { ThunderboltOutlined, CopyOutlined } from "@ant-design/icons";
import { useEffect, useRef } from "react";

const baseChargingIconStyle = {
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

export default function PreviewHeader(props) {
  const identificatorNode = useRef();

  useEffect(() => {
    identificatorNode.current.parentNode.style.minWidth = '250px';
  }, [identificatorNode]);

  const view = props.isOnline
    ? connectionStates.online
    : connectionStates.offline;

  const onIdentificatorCopying = (identificator) => {
    navigator.clipboard.writeText(identificator).then(
      () => message.success("Идентификатор успешно скопирован в буфер обмена"),
      () => message.error("Не удалось скопировать идентификатор в буфер обмена")
    );
  };
  
  const onClick = () => onIdentificatorCopying(props.identificator);

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
            onClick={onClick}
          />
        </Tooltip>
      )}
      {props.charging && (
        <Tooltip title="Заряжается">
          <ThunderboltOutlined style={baseChargingIconStyle} />
        </Tooltip>
      )}
    </Space>
  );
}

export function PreviewHeaderSkeleton(props) {
  return (
    <Space>
      <Skeleton.Avatar {...props} />
      <Skeleton.Input {...props} />
      <Skeleton.Button {...props} shape="round" />
      <Skeleton.Avatar {...props} />
    </Space>
  );
}
