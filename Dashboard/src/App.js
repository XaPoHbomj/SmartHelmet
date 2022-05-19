import HubListener from "./components/signalr/HubListener";
import SiteHeader from "./components/header/SiteHeader";
import { CloudOutlined } from "@ant-design/icons";
import HelmetOverview from "./components/overview/HelmetOverview";
import React, { Fragment, useState } from "react";
import HelmetPreview from "./components/overview/helmet/HelmetPreview";
import SignalLevel from "./components/overview/helmet/indicators/SignalLevel";
import BatteryLevel from "./components/overview/helmet/indicators/BatteryLevel";
import Timestamp from "./components/overview/helmet/indicators/Timestamp";
import { notification } from "antd";
import moment from "moment";
import Dashboard from "./components/dashboard/Dashboard";

export default function App() {
  const [canShowOverviewSkeleton, showOverviewSkeleton] = useState(true);
  const [isDashboardOpen, showDashboard] = useState(false);
  const [events, updateEvents] = useState([]);

  const handleEvent = (event) => {
    updateEvents((previousState) => {
      const existingEvents = [...previousState];
      const elementIndex = existingEvents.findIndex(
        (existingEvent) => existingEvent.boardIdentificator === event.boardIdentificator
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
        (existingEvent) => existingEvent.boardIdentificator !== identificator
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
    <Fragment>
      <HubListener
        endpoint="https://localhost:7217/board/"
        target="getUpdates"
        callbacks={hubCallbacks}
      />
      <SiteHeader
        header="SmartHelmet"
        icon={<CloudOutlined/>}
      />
      <HelmetOverview
        showSkeleton={canShowOverviewSkeleton}
        skeletonSettings={{
          helmetsCount: 6,
          active: true,
          size: "small"
        }}
      >
        {events.map((event) => (
          <HelmetPreview
            key={event.boardIdentificator}
            identificator={event.boardIdentificator}
            isOnline={event.isOnline}
            charging={event.charging}
            onHelmetRemove={onHelmetRemove}
            onDashboardOpen={onDashboardOpen}
          >
            <SignalLevel value={event.signalLevel}/>
            <BatteryLevel value={event.batteryLevel}/>
            <Timestamp value={moment(event.dateTime).format("HH:mm:ss")}/>
          </HelmetPreview>
        ))}
      </HelmetOverview>
      <Dashboard
        isOpened={isDashboardOpen}
        onClose={onDashboardClose}  
      />
    </Fragment>
  );
}
