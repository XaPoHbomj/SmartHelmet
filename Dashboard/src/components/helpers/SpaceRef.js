import React from "react";
import { Space } from "antd";

const SpaceRef = React.forwardRef((props, ref) => {
  return (
    <Space ref={ref} {...props}>
      {props.children}
    </Space>
  );
});

export default SpaceRef;