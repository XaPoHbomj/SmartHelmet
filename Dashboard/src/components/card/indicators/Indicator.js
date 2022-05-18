import { Space, Typography, Tooltip, Card } from "antd";

const getIndicatorStyle = (width) => {
  return {
    textAlign: "center",
    backgroundColor: "#77777707",
    width
  };
};

export default function Indicator(props) {
  return (
    <Tooltip title={props.tooltip}>
      <Card.Grid hoverable={false} style={getIndicatorStyle(props.width)}>
        <Space direction="vertical">
          {props.icon}
          <Typography.Text strong>{props.value}</Typography.Text>
        </Space>
      </Card.Grid>
    </Tooltip>
  );
}
