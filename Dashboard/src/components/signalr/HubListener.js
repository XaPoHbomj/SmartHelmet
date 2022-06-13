import { HubConnectionBuilder } from "@microsoft/signalr";
import { notification } from "antd";
import { useEffect, useState } from "react";

export default function HubListener(props) {
  const [connection, setConnection] = useState();

  const notifyAboutEvent = (event) => {
    props.callbacks.onEventReceived && props.callbacks.onEventReceived(event);
  };
  
  const onStarted = () => {
    notification.success({
      key: "connecting",
      message: "Подключение к серверу успешно выполнено",
      description: connection.connectionId
    });

    props.callbacks.onStarted && props.callbacks.onStarted();
  };

  const onStartFailed = (error) => {
    setTimeout(startConnection, 5000);

    notification.error({
      message: "Не удалось подключиться к серверу"
    });

    props.callbacks.onStartFailed && props.callbacks.onStartFailed();
  };

  const onConnectionClosed = (error) => {
    notification.error({
      message: "Произошло отключение от сервера"
    });

    props.callbacks.onConnectionClosed && props.callbacks.onConnectionClosed();
  };

  const onReconnecting = (error) => {
    notification.warning({
      key: "reconnecting",
      message: "Выполняется переподключение к серверу...",
      duration: 0
    });

    props.callbacks.onReconnecting && props.callbacks.onReconnecting();
  };

  const onReconnected = (connectionId) => {
    notification.success({
      key: "reconnecting",
      message: "Переподключение к серверу успешно выполнено",
      description: connectionId
    });

    props.callbacks.onReconnected && props.callbacks.onReconnected();
  };

  const onEventReceived = (event) => {
    notifyAboutEvent(event);
  };

  const onEventReceivedFailed = () => {
    notification.error({
      message: "Произошла ошибка при получении данных"
    });
  };

  const initializeConnection = () => {
    props.callbacks.onInitialize && props.callbacks.onInitialize();

    const hubConnection = new HubConnectionBuilder()
      .withUrl(props.endpoint)
      .withAutomaticReconnect()
      .build();

    hubConnection.onclose(onConnectionClosed);
    hubConnection.onreconnecting(onReconnecting);
    hubConnection.onreconnected(onReconnected);
    hubConnection.on(props.target, onEventReceived, onEventReceivedFailed);

    setConnection(hubConnection);
  };

  const startConnection = () => {
    notification.warning({
      key: "connecting",
      message: "Выполняется подключение к серверу...",
      duration: 0
    });

    if (connection) {
      connection.start().then(onStarted, onStartFailed);
    }
  };
  
  useEffect(initializeConnection, []);
  useEffect(startConnection, [connection]);
}
