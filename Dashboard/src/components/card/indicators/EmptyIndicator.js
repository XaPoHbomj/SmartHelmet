import Indicator from "./Indicator";
import { ApiOutlined } from "@ant-design/icons";

const style = {
  width: "100%"
};

export default function EmptyIndicator(props) {
  return (
    <Indicator
      style={style}
      icon={<ApiOutlined />}
      value="Нет данных"
      width="100%"
    />
  );
}
