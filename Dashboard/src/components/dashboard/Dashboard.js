import { Button, Empty } from "antd";
import Modal from "antd/lib/modal/Modal";

export default function Dashboard(props) {
  return (
    <Modal
      title="Статистика"
      visible={props.isOpened}
      onCancel={props.onClose}
      footer={[
        <Button key="close" onClick={props.onClose}>
          Закрыть
        </Button>
      ]}
    >
      <Empty
        description="Статистика не найдена"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    </Modal>
  );
}
