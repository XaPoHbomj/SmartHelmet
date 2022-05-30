import { Button, Empty } from "antd";
import Modal from "antd/lib/modal/Modal";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import moment from "moment";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard(props) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top'
      },
      title: {
        display: true,
        text: "Датчик дыма",
      }
    }
  };
  
  const renderModal = (body) => {
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
        {body}
      </Modal>
    );
  }
  
  if (props.targetIdentificator) {
    const dashboardValues = props.values.find(
      (targetValues) => targetValues.identificator === props.targetIdentificator
    );
    
    if (dashboardValues) {
      const boardValues = dashboardValues.boardValues.sort(
        (left, right) => left.unix - right.unix
      );

      const chartData = {
        labels: boardValues.map(boardValue => boardValue.timestamp),
        datasets: [{
          label: "Уровень задымления",
          data: boardValues.map(boardValue => boardValue.smokeValue),
          borderColor: 'rgb(255, 99, 132, 0.7)',
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
          borderWidth: 2
        }]
      };

      return renderModal(
        <Line
          data={chartData}
          options={options}
        />
      );
    }
  }
  
  return renderModal(
    <Empty
      description="Статистика не найдена"
      image={Empty.PRESENTED_IMAGE_SIMPLE}
    />
  );
}
