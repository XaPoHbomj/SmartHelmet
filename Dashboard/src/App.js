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
  const [dashboardTarget, setDashboardTarget] = useState({});
  const [helmets, updateHelmets] = useState([]);

  const handleEvent = (event) => {
    updateHelmets((previousState) => {
      const existingHelmets = [...previousState];
      const elementIndex = existingHelmets.findIndex(
        (existingHelmet) => existingHelmet.boardIdentificator === event.boardIdentificator
      );

      if (elementIndex > -1) {
        existingHelmets[elementIndex] = event;
        return existingHelmets;
      }

      return [
        ...existingHelmets,
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
        charging: true,
        isOnline: true
      });
    }
  };

  const onHelmetRemove = (identificator) => {
    updateHelmets(
      helmets.filter(
        (existingHelmet) => existingHelmet.boardIdentificator !== identificator
      )
    );
  };

  const onDashboardOpen = (identificator) => {
    const helmet = helmets.find(
      (existingHelmet) => existingHelmet.boardIdentificator === identificator
    );
    
    setDashboardTarget(helmet);
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
        {helmets.map((helmet) => (
          <HelmetPreview
            key={helmet.boardIdentificator}
            identificator={helmet.boardIdentificator}
            isOnline={helmet.isOnline}
            charging={helmet.charging}
            isDismounted={helmet.isDismounted}
            isFellOff={helmet.isFellOff}
            isHighSmokeLevel={helmet.isHighSmokeLevel}
            onHelmetRemove={onHelmetRemove}
            onDashboardOpen={onDashboardOpen}
          >
            <SignalLevel value={helmet.signalLevel}/>
            <BatteryLevel value={helmet.batteryLevel}/>
            <Timestamp value={moment(helmet.dateTime).format("HH:mm:ss")}/>
          </HelmetPreview>
        ))}
      </HelmetOverview>
      <Dashboard
        target={dashboardTarget}
        isOpened={isDashboardOpen}
        onClose={onDashboardClose}  
      />
    </Fragment>
  );
}
