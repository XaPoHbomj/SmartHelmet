import HubContext from "./components/signalr/HubContext";
import SiteHeader from "./components/header/SiteHeader";
import { CloudOutlined } from "@ant-design/icons";
import HelmetOverview, { HelmetOverviewSkeleton } from "./components/overview/HelmetOverview";
import React, { useState } from "react";
import Helmet from "./components/overview/helmet/Helmet";
import SignalLevel from "./components/overview/helmet/indicators/SignalLevel";
import BatteryLevel from "./components/overview/helmet/indicators/BatteryLevel";
import Timestamp from "./components/overview/helmet/indicators/Timestamp";
import { notification } from "antd";
import moment from "moment";

export default function App() {
  const [overviewSkeletonVisible, showOverviewSkeleton] = useState(true);
  const [isDashboardOpen, showDashboard] = useState(false);
  const [events, updateEvents] = useState([]);

  const handleEvent = (event) => {
    updateEvents((previousState) => {
      const existingEvents = [...previousState];
      console.log(1, existingEvents)
      const elementIndex = existingEvents.findIndex(
        (existingEvent) => existingEvent.identificator === event.identificator
      );

      if (elementIndex > -1) {
        existingEvents[elementIndex] = event;
        console.log(2, existingEvents)
        return existingEvents;
      }

      console.log(3, existingEvents)
      return [
        ...existingEvents,
        event
      ];
    });
  };
  
  const hubCallbacks = {
    onStarted: () => {
      showOverviewSkeleton(false);
    },
    onEventReceived: (event) => {
      if (isDashboardOpen) {
        const timestamp = moment().format("DD.MM.yyyy г. в HH:mm:ss");

        notification.info({
          message: "Данные обновлены",
          description: timestamp
        });
      }

      handleEvent({
        ...event,
        isOnline: true
      });
    }
  };

  const onHelmetRemove = (identificator) => {
    updateEvents(
      events.filter(
        (existingEvent) => existingEvent.identificator !== identificator
      )
    );
  };

  const onDashboardOpen = (identificator) => {
    showDashboard(true);
  };

  const onDashboardClose = () => {
    showDashboard(false);
  };
  
  return (
    <HubContext
      endpoint="https://localhost:7217/board/"
      target="getUpdates"
      callbacks={hubCallbacks}
    >
      <SiteHeader header="SmartHelmet" icon={<CloudOutlined />} />
      <HelmetOverview 
          skeletonVisible={overviewSkeletonVisible} 
          skeleton={<HelmetOverviewSkeleton helmetsCount={6} active={true} size="small" />}>
        {events.map((event) => (
          <Helmet
            key={event.boardIdentificator}
            identificator={event.boardIdentificator}
            isOnline={event.isOnline}
            charging={event.charging}
            timestamp={event.dateTime}
            onHelmetRemove={onHelmetRemove}
            onDashboardOpen={onDashboardOpen}
          >
            <SignalLevel value={event.signalLevel} />
            <BatteryLevel value={event.batteryLevel} />
            <Timestamp value={moment(event.dateTime).format("HH:mm:ss")} />
          </Helmet>
        ))}
      </HelmetOverview>
    </HubContext>
  );
}
