import { Space, Card, Skeleton } from "antd";

const skeletonCardStyle = {
  width: "max-content"
};

const skeletonIndicatorStyle = {
  textAlign: "center",
  backgroundColor: "#77777707"
};

export default function HelmetCardSkeleton(props) {
  const { active, size } = props;
  const indicators = [...Array(3).keys()];
  const cards = [...Array(6).keys()];

  const actions = [
    <Skeleton.Button active={active} size={size} shape="round" />,
    <Skeleton.Button active={active} size={size} shape="round" />
  ];

  const title = (
    <Space>
      <Skeleton.Avatar active={active} size={size} />
      <Skeleton.Input active={active} size={size} />
      <Skeleton.Button active={active} size={size} shape="round" />
      <Skeleton.Avatar active={active} size={size} />
    </Space>
  );

  const createIndicatorSkeleton = (key) => (
    <Card.Grid key={key} hoverable={false} style={skeletonIndicatorStyle}>
      <Space direction="vertical">
        <Skeleton.Avatar active={active} size={size} />
        <Skeleton.Button active={active} size={size} />
      </Space>
    </Card.Grid>
  );

  const createCardSkeleton = (key) => (
    <Card key={key} actions={actions} title={title} style={skeletonCardStyle}>
      {indicators.map(createIndicatorSkeleton)}
    </Card>
  );

  return (
    <Space wrap size="middle">
      {cards.map(createCardSkeleton)}
    </Space>
  );
}
