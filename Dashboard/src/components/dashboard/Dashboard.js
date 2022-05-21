import { Button } from "antd";
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
import { useEffect, useState } from "react";
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
  const [smokeValues, updateSmokeValues] = useState([]);
  
  useEffect(() => {
    console.log('props changed')
    if (props.target) {
      updateSmokeValues((previousState) => [
        ...previousState,
        {
          label: moment(props.target.dateTime).format("HH:mm:ss"),
          value: props.target.smokeValue
        }
      ]);
    }
  }, [props.target]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: "Датчик дыма",
      },
    },
  };
  
  const chart = {
    labels: smokeValues.map(smokeValue => smokeValue.label),
    datasets: [{
      label: "Уровень задымления",
      data: smokeValues.map(smokeValue => smokeValue.value)
    }]
  };
  
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
     <Line 
       data={chart} 
       options={options} 
     /> 
    </Modal>
  );
}
