import Indicator from "./Indicator";
import { ApiOutlined } from "@ant-design/icons";

export default function EmptyIndicator(props) {
  return <Indicator icon={<ApiOutlined />} value="Нет данных" stretch={true} />;
}
