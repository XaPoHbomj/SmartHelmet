import HelmetCard from "./components/card/HelmetCard";
import "./styles.css";
import "antd/dist/antd.css";
import {Empty, message, notification, Space} from "antd";
import {CloudOutlined} from "@ant-design/icons";
import {Fragment, useState, useEffect} from "react";
import ContentHeader from "./components/ContentHeader";
import {remoteHelmets} from "./data/Helmets";
import Dashboard from "./components/Dashboard";
import HelmetCardSkeleton from "./components/card/skeletons/HelmetCardSkeleton";
import {HubConnectionBuilder} from "@microsoft/signalr";

export default function App() {
  const [hubConnection, setHubConnection] = useState(null);
  const [helmets, setHelmets] = useState([]);
  const [isInLoading, showSkeleton] = useState(false);
  const [isDashboardOpened, openDashboard] = useState(false);

  const onIdentificatorCopying = (identificator) => {
    navigator.clipboard.writeText(identificator).then(
      () => message.success("Идентификатор успешно скопирован в буфер обмена"),
      () => message.error("Не удалось скопировать идентификатор в буфер обмена")
    );
  };

  const onDashboardOpening = (helmet) => {
    openDashboard(true);
  };

  const onDashboardClosed = () => {
    openDashboard(false);
  };

  const onHelmetRemoving = (helmet) => {
    setHelmets(
      helmets.filter((x) => x.identificator !== helmet.identificator)
    );
  };

  const onConnected = () => {
    showSkeleton(false);

    notification.success({
      message: "Подключение к серверу успешно выполнено"
    });
  };

  const onConnectionFailed = (error) => {
    notification.error({
      message: "Произошла ошибка при подключении к серверу"
    });
  };

  const onEventReceived = (event) => {
    const helmet = {
      ...event,
      identificator: event.boardIdentificator,
      dateTime: new Date(event.dateTime).toLocaleTimeString(),
      isOnline: true
    }
    
    setHelmets((previousState) => {
      const existingHelmetIndex = previousState.findIndex(x => x.identificator == helmet.identificator);

      if (existingHelmetIndex > -1) {
        previousState[existingHelmetIndex] = helmet;

        return previousState;
      }

      return [
        ...previousState,
        helmet
      ];
    });

    notification.info({
      message: "Данные обновлены",
      description: helmet.identificator
    });
  };

  const onEventReceivingFailed = (error) => {
    notification.error({
      message: "Произошла ошибка при получении данных"
    });
  };

  useEffect(() => {
    hubConnection?.start().then(
      onConnected, 
      onConnectionFailed
    );
  }, [hubConnection]);

  const renderHelmetBar = (helmet) => (
    <HelmetCard
      key={helmet.identificator}
      helmet={helmet}
      onDashboardOpening={onDashboardOpening}
      onIdentificatorCopying={onIdentificatorCopying}
      onHelmetRemoving={onHelmetRemoving}
    />
  );

  useEffect(() => {
    showSkeleton(true);

    const hubEndpointBuilder = new HubConnectionBuilder();

    const hubEndpoint = hubEndpointBuilder
      .withUrl("https://localhost:7217/board/")
      .withAutomaticReconnect()
      .build();

    hubEndpoint.on(
      "getUpdates", 
      onEventReceived, 
      onEventReceivingFailed
    );

    setHubConnection(hubEndpoint);
  }, []);

  const renderOverview = () => {
    if (isInLoading) {
      return <HelmetCardSkeleton active={true} size="small"/>;
    }

    if (helmets.length > 0) {
      return (
        <Space wrap size="middle">
          {helmets.map(renderHelmetBar)}
        </Space>
      );
    }

    return (
      <Empty
        description="Устройства не найдены"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  };

  return (
    <Fragment>
      <ContentHeader icon={<CloudOutlined/>} header="SmartHelmet"/>
      {renderOverview()}
      <Dashboard
        isDashboardOpened={isDashboardOpened}
        onDashboardClosed={onDashboardClosed}
      />
    </Fragment>
  );
}
