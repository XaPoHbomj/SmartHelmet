import { Card, Skeleton } from "antd";
import { IndicatorSkeleton } from "./indicators/Indicator";
import DeleteHelmetAction from "./actionButtons/DeleteHelmetAction";
import OpenDashboardAction from "./actionButtons/OpenDashboardAction";
import EmptyIndicator from "./indicators/EmptyIndicator";
import PreviewHeader, { PreviewHeaderSkeleton } from "./PreviewHeader";

const baseRootIndicatorStyle = {
  display: "none"
};

const baseHelmetStyle = {
  width: "max-content"
};

export default function HelmetPreview(props) {
  const deleteHelmetAction = (
    <DeleteHelmetAction
      identificator={props.identificator}
      onExecute={props.onHelmetRemove}
    />
  );

  const openDashboardAction = (
    <OpenDashboardAction
      identificator={props.identificator}
      onExecute={props.onDashboardOpen}
    />
  );

  const header = (
    <PreviewHeader
      identificator={props.identificator}
      isOnline={props.isOnline}
      charging={props.charging}
      isDismounted={props.isDismounted}
      isFellOff={props.isFellOff}
      isHighSmokeLevel={props.isHighSmokeLevel}
    />
  );
  
  if (props.isOnline && props.children && props.children.length > 0) {
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

export function HelmetPreviewSkeleton(props) {
  const actions = [
    <Skeleton.Button {...props} shape="round" />,
    <Skeleton.Button {...props} shape="round" />
  ];

  const header = <PreviewHeaderSkeleton {...props} />;

  return (
    <Card actions={actions} title={header} style={baseHelmetStyle}>
      <Card.Grid style={baseRootIndicatorStyle} />
      <IndicatorSkeleton {...props} />
      <IndicatorSkeleton {...props} />
      <IndicatorSkeleton {...props} />
    </Card>
  );
}
