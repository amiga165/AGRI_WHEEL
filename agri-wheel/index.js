import { AppRegistry } from "react-native";
import React, { useState, useEffect } from "react";
import OneSignal from "react-native-onesignal";
import { Provider as ReduxProvider } from 'react-redux';
import App from "./App";
import { name as appName } from "./app.json";
import { store } from './src/store';
import { context } from "./src/context/context";

const swadeshi = () => {
  OneSignal.setLogLevel(6, 0);
  OneSignal.setAppId("caf88217-7a2b-4cc3-ae23-3fa84533c18a");
  OneSignal.setNotificationWillShowInForegroundHandler(
    (notificationReceivedEvent) => {
      let notification = notificationReceivedEvent.getNotification();
      // console.log("notification: ", notification);
      const data = notification.additionalData;
      // console.log("additionalData: ", data);
      // Complete with null means don't show a notification.
      notificationReceivedEvent.complete(notification);
    }
  );
  OneSignal.setNotificationOpenedHandler((notification) => {
    // console.log("OneSignal: notification opened:", notification);
  });
  const { Provider } = context;
  const [reloadCropData, setreloadCropData] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [isSubscribed, setisSubscribed] = useState(false);
  const handleCropData = (value) => {
    setreloadCropData(value);
  };
  const handleUserInfo = (userKey, value) => {
    if (userKey === "user") {
      setUserInfo((prev) => {
        return { ...prev, user: value };
      });
    }
    if (userKey === "crops") {
      setUserInfo((prev) => {
        return { ...prev, crops: value };
      });
    }
    if (userKey === "location") {
      setUserInfo((prev) => {
        return { ...prev, location: value };
      });
    }
    if (userKey === "feeds") {
      setUserInfo((prev) => {
        return { ...prev, feeds: value };
      });
    }
    if (userKey === "onesignal") {
      setUserInfo((prev) => {
        return { ...prev, onesignal: value };
      });
    }
    if (userKey === "region") {
      setUserInfo((prev) => {
        return { ...prev, region: value };
      });
    }
  };
  const isSubscribedForOneSignal = async () => {
    const deviceState = await OneSignal.getDeviceState();
    setisSubscribed(deviceState.isSubscribed);
    handleUserInfo("onesignal", deviceState.userId)
  }
  useEffect(() => {
    isSubscribedForOneSignal();
  }, [isSubscribed])

  return (
    <Provider
      value={{
        reloadCropData: reloadCropData,
        handleCropData: handleCropData,
        userInfo: userInfo,
        handleUserInfo: handleUserInfo,
      }}
    >
      <ReduxProvider store={store}>
        <App />
      </ReduxProvider>
    </Provider>
  );
};
AppRegistry.registerComponent(appName, () => swadeshi);
