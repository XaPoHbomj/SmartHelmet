import { Divider, Space, Typography } from "antd";

export default function ContentHeader(props) {
  return (
    <Divider orientation="left">
      <Typography.Title level={3}>
        <Space>
          {props.icon}
          {props.header}
        </Space>
      </Typography.Title>
    </Divider>
  );
}
