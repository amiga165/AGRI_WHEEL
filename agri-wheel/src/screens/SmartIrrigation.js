import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  Alert,
  Box,
  Icon,
  VStack,
  Text,
  HStack,
  Button
} from "native-base";
import RNLocation from "react-native-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RefreshControl, ScrollView} from 'react-native';
import { iotService } from "../services/services";
import HomeCardComponent from "../components/HomeCardComponent";
import { API_STATUS, TOAST_STATUS } from "../constants";
import { context } from "../context/context";
import SkeletonLoader from "../components/SkeletonLoader";
import { theme } from "../AppStyles";
const HomeScreen = ({ navigation }) => {
  const contextValue = useContext(context);
  // console.log(contextValue?.userInfo)
  let userData = contextValue?.userInfo["user"];
  let locationData = contextValue?.userInfo["location"];
  let oneSignal = contextValue?.userInfo["onesignal"];
  let fullName = userData && userData["fullname"];
  const [userDevicesData, setUserDevicesData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userDevicesDataError, setUserDevicesDataError] = useState(null);
  const [location, setLocation] = useState("");
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);


  const getUserData = async () => {
    try {
      let userId = await AsyncStorage.getItem("user_ids");
      setUserId(userId);
      iotService.getUserDevices(userId).then((res) => {
        let result = res?.result;
        if (result?.status === API_STATUS.SUCCESS) {
          iotService.getFeedsData().then((res) => {
            if (res) {
              let feeds = res?.feeds;
              if (feeds[0]?.field2 == undefined || feeds[0]?.field2 == null || feeds[0]?.field2 == "" ) {
                iotService
                  .saveFeedsData("0", "0", "null", "1", "0")
                  .then((res) => {
                    if (res) {
                      iotService.getFeedsData().then((res) => {
                        contextValue?.handleUserInfo("feeds", res?.feeds);
                      });
                    }
                  });
              } else {
                contextValue?.handleUserInfo("feeds", res?.feeds);
              }
            }
          });
          setUserDevicesData(result?.data);
          setUserDevicesDataError(null);
          contextValue?.handleUserInfo("crops", result?.data);
        } else if (result?.status === API_STATUS.ERROR) {
          setUserDevicesData(null);
          setUserDevicesDataError(result);
        }
        contextValue?.handleCropData(false);
        setisLoading(false);
      });
      if(oneSignal){
        let params = {
          userId,
          onesignal_id : oneSignal
        }
        iotService.saveOneSignalData(params).then((res) => {
        }); 
      }
    } catch (error) {
      setisLoading(false);
      setUserId(null);
    }
  };
  useEffect(() => {
    if (contextValue?.reloadCropData || refreshing ) {
      setisLoading(true);
      getUserData();
    }
  });
  return (
    <ScrollView
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {isLoading && <SkeletonLoader />}
      {!isLoading && !!userDevicesDataError && (
        <Box m={8} pl={5} pr={5}>
          <Alert
            status={TOAST_STATUS.WARNING}
            w="100%"
            variant="left-accent"
            colorScheme={TOAST_STATUS.WARNING}
          >
            <VStack space={2} flexShrink={1} w="100%">
              <HStack
                flexShrink={1}
                space={2}
                alignItems="center"
                justifyContent="space-between"
              >
                <HStack space={2} flexShrink={1} alignItems="center">
                  <Alert.Icon />
                  <Text>
                    {`Dear ${
                      fullName ?? userId
                    }, Thank you for registering with us.Please add crops`}
                  </Text>
                </HStack>
              </HStack>
            </VStack>
          </Alert>
          <Button
            my={8}
            mx="auto"
            style={{ backgroundColor: theme.colors.primary }}
            _text={{ color: "white" }}
            onPress={() =>
              navigation.navigate("DrawerNavigationRoutes", {
                screen: "AddCrop",
              })
            }
          >
            Add Crop
          </Button>
        </Box>
      )}

      {!isLoading &&
        userDevicesData &&
        !userDevicesDataError &&
        userDevicesData?.map((data, index) => {
          return (
            <HomeCardComponent
              key={index}
              id={index}
              userId={userId}
              motorStatus={data?.motor_status}
              deviceId={data?.device_id}
              cropType={data?.crop_type}
              seedType={data?.seed_type}
              waterLevel={data?.water_level > 0 ? data?.water_level : 10}
              navigation={navigation}
            />
          );
        })}
    </ScrollView>
  );
};

export default HomeScreen;
