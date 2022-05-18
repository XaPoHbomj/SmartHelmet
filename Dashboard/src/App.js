import HelmetCard from "./components/card/HelmetCard";
import "./styles.css";
import "antd/dist/antd.css";
import {Empty, message, notification, Space, Result} from "antd";
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
  const [connectionFailed, showConnectionFailedPage] = useState(false);
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
  
  const onEventReceived = (event) => {
    const helmet = {
      ...event,
      identificator: event.boardIdentificator,
      dateTime: new Date(event.dateTime).toLocaleTimeString(),
      isOnline: true
    }
    
    setHelmets((previousState) => {
      const existingHelmets = [...previousState]
      const existingHelmetIndex = existingHelmets.findIndex(x => x.identificator === helmet.identificator);

      if (existingHelmetIndex > -1) {
        existingHelmets[existingHelmetIndex] = helmet;

        return existingHelmets;
      }

      return [
        ...existingHelmets,
        helmet
      ];
    });

    notification.info({
      key: "receiving",
      message: "Данные обновлены",
      description: `в ${new Date().toLocaleTimeString()}`
    });
  };

  useEffect(() => {
    hubConnection?.start().then(
      onConnected,
      (error) => {
        showSkeleton(false);
        showConnectionFailedPage(true)

        notification.error({
          message: "Произошла ошибка при первоначальном подключении к серверу. Пожалуйста, обновите страницу"
        });
      }
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

    hubEndpoint.onreconnected((connectionId) => {
      showSkeleton(false);
      
      notification.success({
        key: "reconnecting",
        message: "Переподключение к серверу успешно выполнено",
        description: connectionId
      });
    })
    
    hubEndpoint.onreconnecting((error) => {
      showSkeleton(true);
      
      notification.warning({
        key: "reconnecting",
        message: "Выполняется переподключение",
        duration: 0
      });
    })
    
    hubEndpoint.on(
      "getUpdates", 
      onEventReceived,
      (error) => {
        notification.error({
          message: "Произошла ошибка при получении данных"
        });
      }
    );

    setHubConnection(hubEndpoint);
  }, []);

  const renderOverview = () => {
    if (isInLoading) {
      return <HelmetCardSkeleton active={true} size="small"/>;
    }
    
    if (connectionFailed) {
      return <Result
        status="500"
        title="Сервер недоступен"
        subTitle="Пожалуйста, перезагрузите страницу!"
      />
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
