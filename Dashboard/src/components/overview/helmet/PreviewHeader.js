import { Badge, Button, Space, Tooltip, Skeleton, message } from "antd";
import {
  ThunderboltOutlined,
  CopyOutlined,
  WarningOutlined,
  AlertOutlined
} from "@ant-design/icons";
import { Fragment, useEffect, useRef } from "react";
import { FallingIcon } from "../../../extra/FallingIcon";
import SpaceRef from "../../helpers/SpaceRef";
import RcQueueAnim from "rc-queue-anim";

const baseOrangeIconStyle = {
  color: "orange"
};

const baseRedIconStyle = {
  color: "rgb(255, 89, 94)"
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

  const renderChargingIcon = () => {
    if (!props.charging) {
      return null;
    }

    return (
      <div key="chargingIcon">
        <Tooltip title="Заряжается">
          <ThunderboltOutlined style={baseOrangeIconStyle}/>
        </Tooltip>
      </div>
    );
  }

  const renderDismountedIcon = () => {
    if (!props.isDismounted) {
      return null;
    }

    return (
      <div key="dismountedIcon">
        <Tooltip title="Сотрудник снял каску">
          <WarningOutlined style={baseOrangeIconStyle}/>
        </Tooltip>
      </div>
    );
  }

  const renderFellOffIcon = () => {
    if (!props.isFellOff) {
      return null;
    }

    return (
      <div key="fellOffIcon">
        <Tooltip title="Зафиксировано падение каски">
          <div>
            <FallingIcon style={baseRedIconStyle}/>
          </div>
        </Tooltip>
      </div>
    );
  }

  const renderHighSmokeLevelIcon = () => {
    if (!props.isHighSmokeLevel) {
      return null;
    }

    return (
      <div key="highSmokeLevelIcon">
        <Tooltip title="Очень высокие показатели датчика дыма">
          <AlertOutlined style={baseRedIconStyle}/>
        </Tooltip>
      </div>
    );
  }

  return (
    <Fragment>
      <Space>
        <Tooltip title={view.tooltip}>
          <Badge status={view.status}/>
        </Tooltip>
        <div ref={identificatorNode}>
          {props.identificator ?? "Идентификатор не определен"}
        </div>
        {props.identificator && (
          <Tooltip title="Скопировать в буфер обмена">
            <Button
              type="text"
              icon={<CopyOutlined/>}
              onClick={onClick}
            />
          </Tooltip>
        )}
      </Space>
      <RcQueueAnim
        component={SpaceRef}
        type={["right"]}
      >
        {renderChargingIcon()}
        {renderDismountedIcon()}
        {renderFellOffIcon()}
        {renderHighSmokeLevelIcon()}
      </RcQueueAnim>
    </Fragment>
  );
}

export function PreviewHeaderSkeleton(props) {
  return (
    <Space>
      <Skeleton.Avatar {...props} />
      <Skeleton.Input {...props} />
      <Skeleton.Button {...props} shape="round"/>
      <Skeleton.Avatar {...props} />
    </Space>
  );
}
