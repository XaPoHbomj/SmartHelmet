import { Popconfirm, Tooltip } from "antd";
import { QuestionCircleOutlined, DeleteOutlined } from "@ant-design/icons";

const baseActionStyle = {
  color: "#FF4500"
};

export default function DeleteHelmetAction(props) {
  const onConfirm = () => props.onExecute(props.identificator);
  
  return (
    <Popconfirm
      title="Вы действительно хотите удалить каску из списка?"
      okText="Удалить"
      cancelText="Отмена"
      icon={<QuestionCircleOutlined style={baseActionStyle} />}
      onConfirm={onConfirm}
    >
      <Tooltip title="Удалить" placement="bottom">
        <DeleteOutlined 
          key="removeHelmet"
          style={baseActionStyle} />
      </Tooltip>
    </Popconfirm>
  );
}
