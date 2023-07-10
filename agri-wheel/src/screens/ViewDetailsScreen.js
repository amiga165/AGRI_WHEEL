import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from "react-native";
import {
  VStack,
  Progress,
  Box,
  Stack,
  Heading,
  Switch,
  HStack,
  useToast,
  Button,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { context } from "../context/context";
import { API_STATUS, TOAST_STATUS, weatherConditions } from "../constants";
import { iotService } from "../services/services";
import SkeletonLoader from "./../components/SkeletonLoader";
import Loader from "./../components/Loader";

const ViewDetailsScreen = ({ navigation }) => {
  const contextValue = useContext(context);
  const route = useRoute();
  let cropsData = contextValue?.userInfo["crops"];
  let feedsData = contextValue?.userInfo["feeds"];
  const [userDevicesData, setUserDevicesData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState({});
  const [feedData, setfeedData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [userDevicesDataError, setUserDevicesDataError] = useState(null);
  const getDeviceData = async () => {
    setisLoading(true);
    try {
      let userId = await AsyncStorage.getItem("user_ids");
      setUserId(userId);
      iotService.getDeviceData(route.params?.deviceId).then((res) => {
        let result = res?.result;
        if (result?.status === API_STATUS.SUCCESS) {
          setUserDevicesData(result?.data);
          setUserDevicesDataError(null);
          let location = result.data[0].location;
          let splittedValues = location.split("_");
          let lat = splittedValues && splittedValues[0];
          let lon = splittedValues && splittedValues[1];
          iotService.fetchWeather(lat, lon).then((res) => {
            setWeatherData(res);
          });
          iotService.getFeedsData().then((res) => {
            if (res) {
              let feeds = res?.feeds;
              if (feeds[0]?.field2 == undefined || feeds[0]?.field2 == null || feeds[0]?.field2 == "" ) {
                iotService
                  .saveFeedsData("0", "0",feeds[0]?.field3 ,feeds[0]?.field4 , feeds[0]?.field5 , "2" )
                  .then((res) => {
                    if (res) {
                      iotService.getFeedsData().then((res) => {
                        contextValue?.handleUserInfo("feeds", res?.feeds);
                        setfeedData(res?.feeds)
                      });
                    }
                  });
              } else {
                contextValue?.handleUserInfo("feeds", res?.feeds);
                setfeedData( res?.feeds)
              }
            }
          });
        } else if (result?.status === API_STATUS.ERROR) {
          setUserDevicesData(null);
          setUserDevicesDataError(result);
        }
      });
    } catch (error) {
      setisLoading(false);
      setUserId(null);
    }
    setisLoading(false);
  };
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
  
  useEffect(() => {
    if (refreshing || (!!cropsData && !userDevicesData)) {
      getDeviceData();
    }
  }, [route.params?.deviceId]);
  const [motor, setMotor] = useState(feedsData && feedsData[0]?.field2);
  const toast = useToast();
  const deviceId = route.params?.deviceId;
  

  const changeMotorStatus = (motorValue) => {
    setLoading(true);
    // let params = {
    //   field1 : feedsData && feedsData[0]?.field1,
    //   field2 : motorValue,
    //   field3 : feedsData && feedsData[0]?.field3,
    //   field4 : feedsData && feedsData[0]?.field4,
    //   field5 : feedsData && feedsData[0]?.field5,
    // };
    iotService
      .saveFeedsData(
        feedsData && feedsData[0]?.field1,
        motorValue,
        feedsData && feedsData[0]?.field3,
        feedsData && feedsData[0]?.field4,
        feedsData && feedsData[0]?.field5
      )
      .then((res) => {
        let result = res;
        if (result) {
          const id = "success";
          if (!toast.isActive(id)) {
            toast.show({
              id,
              title: "Motor Switched " + (motorValue == 0 ? "Off" : "On"),
              status: TOAST_STATUS.SUCCESS,
              description: "We Will take care about the further things",
              placement: "bottom",
            });
          }
          setMotor(motorValue);
          iotService.getFeedsData().then((res) => {
            contextValue?.handleUserInfo("feeds", res?.feeds);
          });
        } else {
          const id = "error";
          if (!toast.isActive(id)) {
            toast.show({
              id,
              title: "Sorry, Motor Not Switched ",
              status: TOAST_STATUS.WARNING,
              description:
                "Please retry once.if facing issue report to our team",
              placement: "bottom",
            });
          }
          setMotor(motor);
        }
        setLoading(false);
      });
  };
  let weather = (weatherData.base && weatherData?.weather[0]?.main) || "Cloud";
  let temperature = (weatherData.base && weatherData?.main?.temp) || "0";
  let name = (weatherData.base && weatherData?.name) || "NA";
  return (
    <ScrollView
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {isLoading && <SkeletonLoader />}
      <Loader loading={loading} />
      {weatherData.base && (
        <View
          style={[
            styles.weatherContainer,
            { backgroundColor: weatherConditions[weather].color },
          ]}
        >
          <View style={styles.headerContainer}>
            <Icon
              size={30}
              name={weatherConditions[weather].icon}
              color={"#fff"}
            />
            <Text style={styles.tempText}>{temperature}˚</Text>
          </View>
          <View style={styles.bodyContainer}>
            <Text style={styles.title}>{weatherConditions[weather].title}</Text>
            <Text style={styles.subtitle}>{name}</Text>
          </View>
        </View>
      )}
      {!isLoading && userDevicesData && (
        <Box bg="white" shadow={2} rounded="lg" m={(5, 5)}>
          <Stack space={4} p={[4, 4, 8]}>
            <Text color="gray.400">Crop Details</Text>
            <HStack alignItems="center" space={"sm"}>
              <Icon name="sprout" size={20} />
              <Heading size={["sm"]} noOfLines={2}>
                {(userDevicesData && userDevicesData[0].crop_type) || "NA"}
              </Heading>
            </HStack>
            {feedsData && (
              <HStack alignItems="center" space={"lg"}>
                <Text fontSize="lg">Motor Status: {motor == 0 ? "Off" : "On"} State</Text>
                <Switch
                  onToggle={() => changeMotorStatus(motor == 0 ? 1 : 0)}
                  isChecked={motor == 0 ? false : true}
                />
              </HStack>
            )}
            <HStack alignItems="center" space={"sm"}>
              <Text fontSize="lg">Seed Type: </Text>
              <Text fontSize="lg" style={{ fontWeight: "bold" }}>
                {(userDevicesData && userDevicesData[0].seed_type) || "NA"}
              </Text>
            </HStack>
            <HStack alignItems="center" space={"sm"}>
              <Text fontSize="lg">Soil Type: </Text>
              <Text fontSize="lg" style={{ fontWeight: "bold" }}>
                {(userDevicesData && userDevicesData[0].soil_type) || "NA"}
              </Text>
            </HStack>
            <HStack alignItems="center" space={"sm"}>
              <Text fontSize="lg">Date Of Plantation: </Text>
              <Text fontSize="lg" style={{ fontWeight: "bold" }}>
                {(userDevicesData && userDevicesData[0].dateop) || "NA"}
              </Text>
            </HStack>
            <HStack alignItems="center" space={"sm"}>
              <Text fontSize="lg">Area Of Plantation: </Text>
              <Text fontSize="lg" style={{ fontWeight: "bold" }}>
                {(userDevicesData && userDevicesData[0].areaop) || "NA"}
                {""} acres
              </Text>
            </HStack>
            {feedsData && (
              <VStack mx={0} space="md">
                <Text color="gray.400">Water Level</Text>
                <Progress
                  colorScheme="primary"
                  value={(feedsData && feedsData[0]?.field4) ?? 0 }
                  max={2}
                />
              </VStack>
            )}
          </Stack>
        </Box>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  weatherContainer: {
    flex: 1,
  },
  headerContainer: {
    flex: 1,
    flexDirection: "row",
    paddingLeft: 22,
    paddingRight: 22,
    paddingTop: 10,
    // alignItems: "center",
    justifyContent: "space-between",
  },
  tempText: {
    fontSize: 30,
    color: "#fff",
  },
  bodyContainer: {
    flex: 1,
    alignItems: "flex-start",
    paddingLeft: 22,
    marginBottom: 20,
  },
  title: {
    fontSize: 25,
    color: "#fff",
  },
  subtitle: {
    fontSize: 15,
    color: "#fff",
  },
});

export default ViewDetailsScreen;
