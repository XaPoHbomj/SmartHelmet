import { Divider, Space, Typography } from "antd";

export default function SiteHeader(props) {
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
