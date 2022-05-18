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
      identificator={props.identificator}
      onClick={props.onHelmetRemove}
    />
  );

  const openDashboardAction = (
    <OpenDashboardAction
      identificator={props.identificator}
      onClick={props.onDashboardOpen}
    />
  );

  const header = (
    <HelmetHeader
      identificator={props.identificator}
      isOnline={props.isOnline}
      charging={props.charging}
    />
  );
  
  if (props.isOnline && props.children && props.children.length > 0) {
    console.log('such')
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
