import React, { useState, useRef, useContext, useEffect } from "react";
import {
  NativeBaseProvider,
  Box,
  VStack,
  FormControl,
  Modal,
  Input,
  Button,
  useToast,
  Select,
  CheckIcon,
  ScrollView,
  KeyboardAvoidingView,
  InputGroup,
  InputLeftAddon,
  InputRightAddon
} from "native-base";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, Platform, View, Text, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import RNLocation from "react-native-location";
import MapView, { Marker } from "react-native-maps";
import { iotService } from "../services/services";
import Loader from "./../components/Loader";
import {
  API_STATUS,
  TOAST_STATUS,
  PADDY_SEEDS,
  SUGARCANE_SEEDS,
  DEFAULT_SEEDS,
} from "./../constants";
import { context } from "../context/context";

const AddCropScreen = ({ navigation }) => {
  RNLocation.configure({
    distanceFilter: 0,
  });
  const contextValue = useContext(context);
  const toast = useToast();
  const [userId, setUserId] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [typeOfCrop, setTypeOfCrop] = useState("");
  const [typeOfSeed, setTypeOfSeed] = useState("");
  const [typeOfSoil, setTypeOfSoil] = useState("");
  const [dateOfPlantation, setDateOfPlantation] = useState(new Date());
  const [areaOfPlantation, setAreaOfPlantation] = useState("");
  const [show, setShow] = useState(false);
  const [location, setLocation] = useState("");
  const [loaderTxt, setLoaderTxt] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  // const [region, setRegion] = useState(null);
  const [isLoading, setLoader] = useState(false);
  const typeOfCropRef = useRef();
  const mapRef = useRef(null);
  let region = contextValue?.userInfo["region"];
  const getUserData = async () => {
    try {
      let user = await AsyncStorage.getItem("user_ids");
      setUserId(user);
    } catch (error) {
      setUserId("");
    }
  };
  useEffect(() => {
    getUserData();
    // setAreaOfPlantation("");
  }, []);

  const getLocation = async () => {
    setLoader(true);
    let permission = await RNLocation.checkPermission({
      ios: "whenInUse", // or 'always'
      android: {
        detail: "coarse", // or 'fine'
      },
    });
    let location;
    if (!permission) {
      permission = await RNLocation.requestPermission({
        ios: "whenInUse",
        android: {
          detail: "coarse",
          rationale: {
            title: "We need to access your location",
            message: "We use your location to show where you are on the map",
            buttonPositive: "OK",
            buttonNegative: "Cancel",
          },
        },
      });
      location = await RNLocation.getLatestLocation({ timeout: 100 });
      if (location) {
        location.latitudeDelta = 0.04;
        location.longitudeDelta = 0.05;
      }
      setLocation(location);
    } else {
      location = await RNLocation.getLatestLocation({ timeout: 100 });
      if (location) {
        location.latitudeDelta = 0.04;
        location.longitudeDelta = 0.05;
      }
      setLocation(location);
    }
    contextValue?.handleUserInfo("location", location);
    setLoader(false);
    navigation.push("MapView", { location: location });
  };

  // useEffect(() => {
  //   (async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       const id = "locationAccess-error";
  //       if (!toast.isActive(id)) {
  //         toast.show({
  //           id,
  //           title: "Permission to access location was denied",
  //           status: "warning",
  //           description: "Give access for location.",
  //           placement: "bottom",
  //         });
  //       }
  //       setErrorMsg("Permission to access location was denied");
  //       return;
  //     }
  //     let location = await Location.getCurrentPositionAsync({});
  //     setLocations(location);
  //   })();
  // }, []);
  const validateForm = () => {
    setLoader(true);
    if (deviceId?.length < 1) {
      const id = "deviceId-error";
      if (!toast.isActive(id)) {
        toast.show({
          id,
          title: "Device Id Required",
          status: "warning",
          description: "Enter your Device Id.",
          placement: "bottom",
        });
      }
      setLoader(false);
    } else if (typeOfCrop?.length < 1) {
      const id = "typeofcrop-error";
      if (!toast.isActive(id)) {
        toast.show({
          id,
          title: "Type of Crop Required",
          status: "warning",
          description: "Choose type of crop.",
          placement: "bottom",
        });
      }
      setLoader(false);
    } else if (typeOfSeed?.length < 1) {
      const id = "typeofseed-error";
      if (!toast.isActive(id)) {
        toast.show({
          id,
          title: "Type of Seed Required",
          status: "warning",
          description: "Choose type of Seed.",
          placement: "bottom",
        });
      }
      setLoader(false);
    } else if (typeOfSoil?.length < 1) {
      const id = "typeofsoil-error";
      if (!toast.isActive(id)) {
        toast.show({
          id,
          title: "Type of Soil Required",
          status: "warning",
          description: "Choose type of Soil.",
          placement: "bottom",
        });
      }
      setLoader(false);
    } else if (dateOfPlantation?.length < 1) {
      const id = "dop-error";
      if (!toast.isActive(id)) {
        toast.show({
          id,
          title: "Date of Plantation Required",
          status: "warning",
          description: "Choose Date.",
          placement: "bottom",
        });
      }
      setLoader(false);
    } else if (areaOfPlantation?.length < 1) {
      const id = "aop-error";
      if (!toast.isActive(id)) {
        toast.show({
          id,
          title: "Area of Plantation Required",
          status: "warning",
          description: "Enter Area of Plantation.",
          placement: "bottom",
        });
      }
      setLoader(false);
    } else if (!region) {
      const id = "loc-error";
      if (!toast.isActive(id)) {
        toast.show({
          id,
          title: "Location Required",
          status: "warning",
          description: "Choose Location.",
          placement: "bottom",
        });
      }
      setLoader(false);
    } else {
      setLoader(true);
      let location = region?.latitude + "_" + region?.longitude;
      let params = {
        deviceId,
        typeOfCrop,
        typeOfSeed,
        areaOfPlantation,
        dateOfPlantation: dateOfPlantation.toLocaleString('en-GB', { timeZone: 'UTC' }).split(',')[0],
        userId,
        typeOfSoil,
        location,
      };
      iotService
        .addCrop(params)
        .then((res) => {
          // console.log(res,"res")
          let response = res?.result;
          if (response?.status === API_STATUS.SUCCESS) {
            const id = "success";
            if (!toast.isActive(id)) {
              toast.show({
                id,
                title: response?.title,
                status: TOAST_STATUS.SUCCESS,
                description: response?.message,
                placement: "bottom",
                duration: 1000,
              });
            }
            contextValue?.handleCropData(true);
            setLocation("");
            setAreaOfPlantation("");
            setDateOfPlantation("");
            setTypeOfCrop("");
            setTypeOfSeed();
            setDeviceId("");
            setTypeOfSoil("");
            setRegion("");
            navigation.navigate("homeScreenStack");
          } else if (response?.status === API_STATUS.ERROR) {
            const id = response?.message;
            if (!toast.isActive(id)) {
              toast.show({
                id,
                title: response?.title,
                status: TOAST_STATUS.WARNING,
                description: response?.message,
                placement: "bottom",
              });
            }
          }
          setLoader(false);
        })
        .catch((err) => {
          console.log(err);
          setLoader(false);
        });
    }
  };
  const officeLocation = {
    latitude: 16.7936998,
    longitude: 80.8230526,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };
  function onDateSelected(event, value) {
    setShow(false);
    setDateOfPlantation(value);
  };
  function showMode() {
    setShow(true);
  };
  // if(modalVisible && location) {
  //   mapRef?.current?.animateToRegion(region ?? location, 5 * 1000);
  // }
  let ScreenHeight = Dimensions.get("window").height;
  let ScreenWidth = Dimensions.get("window").width;
  return (
    <NativeBaseProvider>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Loader loading={isLoading} />
        {show && (
          <DateTimePicker
            value={dateOfPlantation}
            mode={'date'}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            is24Hour={true}
            onChange={onDateSelected}
            style={styles.datePicker}
          />
        )}
        {/* <Modal
          isOpen={modalVisible}
          onClose={setModalVisible}
          size={"xl"}
          // _backdrop={{
          //   _dark: {
          //     bg: "coolGray.800",
          //   },
          //   bg: "warmGray.50",
          // }}
        >
          <Modal.Content
            minWidth={(ScreenWidth / 100) * 5}
            minH={(ScreenHeight / 100) * 10}
          >
            <Modal.CloseButton />
            <Modal.Body>
              <View style={styles.container}>
                <MapView
                  style={styles.map}
                  ref={mapRef}
                  initialRegion={region ?? location ?? officeLocation}
                  onRegionChangeComplete={(region) => setRegion(region)}
                >
                  <Marker
                    draggable
                    coordinate={region ?? location}
                    onDragEnd={(e) => {
                      console.log("dragEnd", e.nativeEvent.coordinate);
                    }}
                  />
                </MapView>
              </View>
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => {
                    setModalVisible(false), setRegion(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onPress={() => {
                    setModalVisible(false);
                  }}
                >
                  Save
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal> */}

        <ScrollView>
          <Box
            // bg={{
            //   linearGradient: {
            //     colors: ["amber.100", "rose.50"],
            //     start: [0, 0],
            //     end: [1, 1],
            //   },
            // }}
            // bg="fuchsia.100"
            // flex={1}
            p={(5, 5)}
            pt={10}
            w="100%"
          // mx='auto'
          >
            {/* <View style={styles.container}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: 37.78825,
                  longitude: -122.4324,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                showsMyLocationButton={true}
              />
            </View> */}
            <VStack space={2} mt={0}>
              <Input
                variant="underlined"
                style={styles.inputBorder}
                value={deviceId}
                placeholder="Device ID"
                type="text"
                autoComplete="off"
                onClick={(e) => e.stopPropagation()}
                onChangeText={(value) => setDeviceId(value)}
              />
              <Select
                ref={typeOfCropRef}
                selectedValue={typeOfCrop}
                placeholder="Choose Type of Crop"
                onValueChange={(itemValue) => {
                  setTypeOfCrop(itemValue);
                }}
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size={5} />,
                }}
                defaultValue={""}
                style={{ borderColor: "black" }}
                mt={1}
              >
                <Select.Item label="Paddy" value="Paddy" />
                <Select.Item label="Sugarcane" value="Sugarcane" />
                <Select.Item label="Wheat" value="Wheat" />
                <Select.Item label="Potato" value="Potato" />
                <Select.Item label="Corn" value="Corn" />
              </Select>
              <Select
                selectedValue={typeOfSeed}
                placeholder="Choose Type of Seed"
                onValueChange={(itemValue) => {
                  setTypeOfSeed(itemValue);
                }}
                defaultValue={""}
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size={5} />,
                }}
                style={{ borderColor: "black" }}
                mt={1}
              >
                {typeOfCrop === "Paddy"
                  ? PADDY_SEEDS.map((seed, index) => {
                    return (
                      <Select.Item key={index} label={seed} value={seed} />
                    );
                  })
                  : typeOfCrop === "Sugarcane"
                    ? SUGARCANE_SEEDS.map((seed, index) => {
                      return (
                        <Select.Item key={index} label={seed} value={seed} />
                      );
                    })
                    : DEFAULT_SEEDS.map((seed, index) => {
                      return (
                        <Select.Item key={index} label={seed} value={seed} />
                      );
                    })}
              </Select>
              <Select
                selectedValue={typeOfSoil}
                placeholder="Choose Type of Soil"
                onValueChange={(itemValue) => {
                  setTypeOfSoil(itemValue);
                }}
                defaultValue={""}
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size={5} />,
                }}
                style={{ borderColor: "black" }}
                mt={1}
              >
                <Select.Item label="Alluvial soils" value="Alluvial soils" />
                <Select.Item label="Black soils" value="Black soils" />
                <Select.Item
                  label="Red and Yellow soils"
                  value="Red and Yellow soils"
                />
                <Select.Item label="Laterite soils " value="Laterite soils " />
                <Select.Item label="Arid soils " value="Arid soils " />
                <Select.Item label="Saline soils " value="Saline soils" />
                <Select.Item label="Peaty soils  " value="Peaty soils  " />
                <Select.Item label="Forest soils. " value="Forest soils. " />
              </Select>
              <Input
                style={styles.inputBorder}
                placeholder="Area of Plantation(In acres)"
                type="text"
                autoComplete="off"
                onClick={(e) => e.stopPropagation()}
                onChangeText={(value) => setAreaOfPlantation(value)}
                value={areaOfPlantation}
              />
              {/* <VStack space={"md"}>
                <Button
                  leftIcon={
                    <Icon name="calendar" size={24} color="white" />
                  }
                  // onPress={() => {
                  //   setModalVisible(true)
                  // }}
                  onPress={showMode}
                >
                  Choose Date of Plantation
                </Button>
                <Text>
                  Date of Plantation {dateOfPlantation?.toLocaleString('en-GB', { timeZone: 'UTC' }).split(',')[0]}
                </Text>
              </VStack> */}
              <Text>
                Lat: {region?.latitude} Long: {region?.longitude}
              </Text>
              <VStack space={"md"}>
                <Input type="date" value={dateOfPlantation?.toLocaleString('en-GB', { timeZone: 'UTC' }).split(',')[0]}  InputRightElement={
                <Icon name="calendar" onPress={(e) => { e.stopPropagation(); showMode() }} size={24} />} placeholder="Date of Plantation" />
              </VStack>
              <VStack space={"md"}>
                <Button
                  leftIcon={
                    <Icon name="location-pin" size={24} color="white" />
                  }
                  // onPress={() => {
                  //   setModalVisible(true)
                  // }}
                  onPress={getLocation}
                >
                  Choose Crop location
                </Button>
              </VStack>
              <VStack space={"md"}>
                <Button
                  style={{ backgroundColor: "#307ecc" }}
                  _text={{ color: "white" }}
                  onPress={() => validateForm()}
                >
                  Add Crop
                </Button>
              </VStack>
            </VStack>
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </NativeBaseProvider>
  );
};
export default AddCropScreen;
const styles = StyleSheet.create({
  inputBorder: {
    borderColor: "grey",
  },
  buttonStyle: {
    backgroundColor: "blue",
  },
  map: {
    flex: 1,
    height: 400,
    // width : 200
  },
  container: {
    flex: 4, //the container will fill the whole screen.
  },
  datePicker: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: 320,
    height: 260,
    display: 'flex',
  },
});