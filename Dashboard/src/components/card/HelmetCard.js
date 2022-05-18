import { Badge, Card, Popconfirm, Tooltip } from "antd";
import {
  EllipsisOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
  WarningOutlined
} from "@ant-design/icons";
import HelmetBar from "./HelmetBar";
import SignalLevel from "./indicators/SignalLevel";
import BatteryLevel from "./indicators/BatteryLevel";
import Timestamp from "./indicators/Timestamp";
import EmptyIndicator from "./indicators/EmptyIndicator";

const cardStyle = {
  width: "100%"
};

const warningIconStyle = {
  fontSize: 16
};

const removeIconStyle = {
  color: "#FF4500"
};

export default function HelmetCard(props) {
  const host = <Card.Grid style={{ display: "none" }} />;
  const openDashboardAction = (
    <Tooltip title="Статистика" placement="bottom">
      <EllipsisOutlined
        key="dashboard"
        onClick={() => props.onDashboardOpening(props.helmet)}
      />
    </Tooltip>
  );

  const removeAction = (
    <Popconfirm
      title="Вы действительно хотите удалить каску из списка?"
      okText="Удалить"
      cancelText="Отмена"
      icon={<QuestionCircleOutlined style={removeIconStyle} />}
      onConfirm={() => props.onHelmetRemoving(props.helmet)}
    >
      <Tooltip title="Удалить" placement="bottom">
        <DeleteOutlined key="remove" style={removeIconStyle} />
      </Tooltip>
    </Popconfirm>
  );

  const title = (
    <HelmetBar
      identificator={props.helmet.identificator}
      isOnline={props.helmet.isOnline}
      charging={props.helmet.charging}
      onIdentificatorCopying={props.onIdentificatorCopying}
    />
  );

  const card = (
    <Card
      actions={[openDashboardAction, removeAction]}
      title={title}
      style={cardStyle}
    >
      <SignalLevel value={props.helmet.signalLevel} />
      <BatteryLevel value={props.helmet.batteryLevel} />
      <Timestamp value={props.helmet.dateTime} />
      {host}
    </Card>
  );

  const emptyCard = (
    <Badge.Ribbon
      text={<WarningOutlined />}
      color="orange"
      style={warningIconStyle}
    >
      <Card actions={[removeAction]} title={title}>
        <EmptyIndicator />
        {host}
      </Card>
    </Badge.Ribbon>
  );

  return props.helmet.isOnline ? card : emptyCard;
}
