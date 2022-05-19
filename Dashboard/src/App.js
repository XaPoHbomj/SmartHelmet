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

  const hubCallbacks = {
    onStarted: () => {
      showOverviewSkeleton(false);
    },
    onEventReceived: (event) => {
      event.isOnline = true;
      
      if (isDashboardOpen) {
        const timestamp = moment().format("DD.MM.yyyy г. в HH:mm:ss");

        notification.info({
          message: "Данные обновлены",
          description: timestamp
        });
      }

      updateEvents((previousState) => {
        const existingEvents = [...previousState];
        const elementIndex = existingEvents.findIndex(
          (existingEvent) => existingEvent.identificator === event.identificator
        );

        if (elementIndex > -1) {
          existingEvents[elementIndex] = event;
          return existingEvents;
        }

        return [
          ...existingEvents, 
          event
        ];
      });
    }
  };

  const onHelmetRemove = (event) => {
    updateEvents(
      events.filter(
        (existingEvent) => existingEvent.identificator !== event.identificator
      )
    );
  };

  const onDashboardOpen = (event) => {
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
        <Helmet isOnline={true}>
          <SignalLevel value={2} />
        </Helmet>
        {events.map((event) => (
          <Helmet
            key={event.boardIdentificator}
            data={{
              identificator: event.boardIdentificator,
              isOnline: event.isOnline,
              charging: event.charging,
              timestamp: event.dateTime
            }}
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
