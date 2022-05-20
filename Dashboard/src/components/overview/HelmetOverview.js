import { Empty, Space } from "antd";
import { HelmetPreviewSkeleton } from "./helmet/HelmetPreview";
import RcQueueAnim from "rc-queue-anim";
import SpaceRef from "./../helpers/SpaceRef"
import React, { Fragment } from "react";

export default function HelmetOverview(props) {
  const canShowSkeleton = props.showSkeleton && props.skeletonSettings;
  const isEmpty = !props.children || props.children.length === 0;

  const renderEmpty = () => {
    if (!isEmpty || canShowSkeleton) {
      return null;
    }

    return (
      <div key="emptyOverview">
        <Empty
          description="Каски не найдены"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  const renderComplete = () => {
    if (canShowSkeleton) {
      return (
        <div key="skeleton">
          {props.skeleton ?? <HelmetOverviewSkeleton {...props.skeletonSettings} />}
        </div>
      );
    }

    return props.children.map(
      (element) => (
        <div key={element.key}>
          {element}
        </div>
      )
    )
  }

  return (
    <Fragment>
      <RcQueueAnim
        type={["top"]}
        leaveReverse
      >
        {renderEmpty()}
      </RcQueueAnim>
      <RcQueueAnim
        component={SpaceRef}
        componentProps={{
          wrap: true, 
          size:"middle"
        }}
        type={["bottom"]}
        leaveReverse
      >
        {renderComplete()}
      </RcQueueAnim>
    </Fragment>
  );
}

export function HelmetOverviewSkeleton(props) {
  const helmets = [
    ...Array(props.helmetsCount).keys()
  ];

  return (
    <HelmetOverview>
      {helmets.map((helmetIndex) => (
        <HelmetPreviewSkeleton
          key={helmetIndex}
          active={props.active}
          size={props.size}
        />
      ))}
    </HelmetOverview>
  );
}