import { Button, Empty } from "antd";
import Modal from "antd/lib/modal/Modal";

export default function Dashboard(props) {
  const closeButton = (
    <Button key="close" onClick={props.onDashboardClosed}>
      Закрыть
    </Button>
  );

  return (
    <Modal
      title="Статистика"
      visible={props.isDashboardOpened}
      onCancel={props.onDashboardClosed}
      footer={[closeButton]}
    >
      <Empty
        description="Статистика не найдена"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    </Modal>
  );
}
