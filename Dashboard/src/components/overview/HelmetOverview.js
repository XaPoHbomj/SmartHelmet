import { Empty, Space } from "antd";
import { HelmetSkeleton } from "./helmet/Helmet";

export default function HelmetOverview(props) {
  if (props.skeletonVisible && props.skeleton) {
    return props.skeleton
  }
  
  if (props.children && props.children.length > 0) {
    return (
      <Space wrap size="middle">
        {props.children}
      </Space>
    );
  }

  return (
    <Empty
      description="Каски не найдены"
      image={Empty.PRESENTED_IMAGE_SIMPLE}
    />
  );
}

export function HelmetOverviewSkeleton(props) {
  const helmets = [...Array(props.helmetsCount).keys()];

  return (
      <HelmetOverview>
        {helmets.map((helmetIndex) => (
            <HelmetSkeleton
                key={helmetIndex}
                active={props.active}
                size={props.size}
            />
        ))}
      </HelmetOverview>
  );
}