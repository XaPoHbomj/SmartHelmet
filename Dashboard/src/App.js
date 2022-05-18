import HubContext from "./components/signalr/HubContext";
import SiteHeader from "./components/header/SiteHeader";
import { CloudOutlined } from "@ant-design/icons";
import HelmetOverview, { HelmetOverviewSkeleton } from "./components/overview/HelmetOverview";
import React, { useState } from "react";
import Helmet from "./components/overview/helmet/HelmetHeader";
import SignalLevel from "./components/overview/helmet/indicators/SignalLevel";
import BatteryLevel from "./components/overview/helmet/indicators/BatteryLevel";
import Timestamp from "./components/overview/helmet/indicators/Timestamp";
import {Card, notification} from "antd";
import moment from "moment";
import EmptyIndicator from "./components/overview/helmet/indicators/EmptyIndicator";

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
      <HelmetOverview>
        <Helmet identificator={1} isOnline={true}>
        </Helmet>
      </HelmetOverview>
      {/*<HelmetOverview 
          skeletonVisible={overviewSkeletonVisible} 
          skeleton={<HelmetOverviewSkeleton helmetsCount={6} active={true} size="small" />}>
        {events.map((event) => (
          <Helmet
            key={event.boardIdentificator}
            identificator={event.boardIdentificator}
            charging={event.charging}
            isOnline={event.isOnline}
            onHelmetRemove={onHelmetRemove}
            onDashboardOpen={onDashboardOpen}
          >
            <SignalLevel value={event.signalLevel} />
            <BatteryLevel value={event.batteryLevel} />
            <Timestamp value={event.timestamp} />
          </Helmet>
        ))}
      </HelmetOverview>*/}
    </HubContext>
  );
}
