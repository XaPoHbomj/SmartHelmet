import { Card, Skeleton } from "antd";
import { IndicatorSkeleton } from "./indicators/Indicator";
import DeleteHelmetAction from "./actionButtons/DeleteHelmetAction";
import OpenDashboardAction from "./actionButtons/OpenDashboardAction";
import EmptyIndicator from "./indicators/EmptyIndicator";
import HelmetHeader, { HelmetHeaderSkeleton } from "./HelmetHeader";

const baseRootIndicatorStyle = {
  display: "none"
};

const baseHelmetStyle = {
  width: "max-content"
};

export default function Helmet(props) {
  const deleteHelmetAction = (
    <DeleteHelmetAction
      data={props.data}
      onExecute={props.onHelmetRemove}
    />
  );

  const openDashboardAction = (
    <OpenDashboardAction
      data={props.data}
      onExecute={props.onDashboardOpen}
    />
  );

  const header = (
    <HelmetHeader data={props.data} />
  );
  
  if (props.data.isOnline && props.children) {
    return (
      <Card
        actions={[openDashboardAction, deleteHelmetAction]}
        title={header}
        style={baseHelmetStyle}
      >
        <Card.Grid style={baseRootIndicatorStyle} />
        {props.children}
      </Card>
    );
  }
  
  return (
    <Card actions={[deleteHelmetAction]} title={header}>
      <Card.Grid style={baseRootIndicatorStyle} />
      <EmptyIndicator />
    </Card>
  );
}

export function HelmetSkeleton(props) {
  const actions = [
    <Skeleton.Button {...props} shape="round" />,
    <Skeleton.Button {...props} shape="round" />
  ];

  const header = <HelmetHeaderSkeleton {...props} />;

  return (
    <Card actions={actions} title={header} style={baseHelmetStyle}>
      <Card.Grid style={baseRootIndicatorStyle} />
      <IndicatorSkeleton {...props} />
      <IndicatorSkeleton {...props} />
      <IndicatorSkeleton {...props} />
    </Card>
  );
}
