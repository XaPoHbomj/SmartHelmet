import { Card, Skeleton, Space, Tooltip, Typography } from "antd";

const baseIndicatorStyle = {
  textAlign: "center",
  backgroundColor: "#77777707"
};

export default function Indicator(props) {
  const indicatorStyle = { ...baseIndicatorStyle };

  if (props.stretch) {
    indicatorStyle.width = "100%";
  }

  return (
    <Tooltip title={props.tooltip}>
      <Card.Grid hoverable={false} style={indicatorStyle}>
        <Space direction="vertical">
          {props.icon}
          <Typography.Text strong>{props.value}</Typography.Text>
        </Space>
      </Card.Grid>
    </Tooltip>
  );
}

export function IndicatorSkeleton(props) {
  return (
    <Card.Grid hoverable={false} style={baseIndicatorStyle}>
      <Space direction="vertical">
        <Skeleton.Avatar {...props} />
        <Skeleton.Button {...props} />
      </Space>
    </Card.Grid>
  );
}
