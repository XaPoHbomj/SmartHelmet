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
import useStateRef from 'react-usestateref'

export default function App() {
  const [canShowOverviewSkeleton, showOverviewSkeleton] = useState(true);
  const [isDashboardOpen, showDashboard, isDashboardOpenRef] = useStateRef(false);
  
  const [
    helmets, 
    updateHelmets, 
    helmetsRef
  ] = useStateRef([]);
  
  const [
    dashboardValues, 
    updateDashboardValues, 
    dashboardValuesRef
  ] = useStateRef([]);
  
  const [
    dashboardTargetIdentificator, 
    setDashboardTargetIdentificator, 
    dashboardTargetIdentificatorRef
  ] = useStateRef(null);

  const updateOverview = (event) => {
    const existingHelmets = [...helmetsRef.current];
    const helmetIndex = existingHelmets.findIndex(
      (helmet) => helmet.boardIdentificator === event.boardIdentificator
    );

    if (helmetIndex > -1) {
      existingHelmets[helmetIndex] = event;
      updateHelmets(existingHelmets);
    }
    else {
      updateHelmets([
        ...existingHelmets,
        event
      ]);
    }
  }
  
  const updateDashboard = (event) => {
    const boardIdentificator = event.boardIdentificator;
    const timestamp = moment(event.timestamp).format("HH:mm:ss");

    const existingDashboardValues = [...dashboardValuesRef.current];
    const dashboardValuesIndex = existingDashboardValues.findIndex(
      (dashboardValues) => dashboardValues.identificator === boardIdentificator
    );

    const eventValues = {
      timestamp,
      smokeValue: event.smokeValue,
      gyroscope: event.gyroscope
    };

    if (dashboardValuesIndex > -1) {
      const boardValues = existingDashboardValues[dashboardValuesIndex].boardValues;
      boardValues.push(eventValues);

      if (boardValues.length > 15) {
        boardValues.shift();
      }
    }
    else {
      existingDashboardValues.push({
        identificator: boardIdentificator,
        boardValues: [eventValues]
      });
    }
    
    updateDashboardValues(existingDashboardValues);

    if (isDashboardOpenRef.current && dashboardTargetIdentificatorRef.current === boardIdentificator) {
      notification.info({
        key: "dashboardUpdated",
        message: "Данные обновлены",
        description: moment().format("DD.MM.yyyy г. в HH:mm:ss")
      });
    }
  }
  
  const handleEvent = (event) => {
	updateOverview(event);
    updateDashboard(event);
  };

  const hubCallbacks = {
    onStarted: () => {
      showOverviewSkeleton(false);
    },
    onEventReceived: (event) => handleEvent({
      ...event,
      isOnline: true
    })
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

    setDashboardTargetIdentificator(helmet.boardIdentificator);
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
            <Timestamp value={moment(helmet.timestamp).format("HH:mm")}/>
          </HelmetPreview>
        ))}
      </HelmetOverview>
      <Dashboard
        targetIdentificator={dashboardTargetIdentificator}
        values={dashboardValues}
        isOpened={isDashboardOpen}
        onClose={onDashboardClose}
      />
    </Fragment>
  );
}
