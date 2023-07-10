import React, { useState, useRef, useContext } from "react";
import {
  NativeBaseProvider,
  Box,
  Heading,
  VStack,
  FormControl,
  Input,
  Link,
  HStack,
  Image,
  useToast,
  Button
} from "native-base";
import { View, KeyboardAvoidingView, StyleSheet, Text, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from 'react-redux'
import { updateUserInfo } from './../reducers/userSlice'


import { iotService } from "../services/services";
import { API_STATUS, TOAST_STATUS } from "./../constants";
import Loader from "./../components/Loader";
import { context } from "./../context/context";
import { theme } from "../AppStyles";

const LoginScreen = ({ navigation }) => {
  const contextValue = useContext(context);
  const dispatch = useDispatch()
  const toast = useToast();
  const [mobile, setMobile] = useState("");
  const [res, setres] = useState(null)
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setLoader] = useState(false);
  const userIdRef = useRef();
  const passwordRef = useRef();
  const saveData = async (userId) => {
    try {
      await AsyncStorage.setItem("user_ids", userId);
      navigation.replace("AuthStack");
    } catch (e) {
      const id = "login-error";
      if (!toast.isActive(id)) {
        toast.show({
          id,
          title: "Login Error",
          status: "warning",
          description: "Retry Once.",
          placement: "bottom",
        });
      }
      console.log(e);
    }
  };
  const validateLoginForm = () => {
    setLoader(true);
    if (mobile?.length < 1) {
      const id = "userId-error";
      if (!toast.isActive(id)) {
        toast.show({
          id,
          title: "User Id Required",
          status: "warning",
          description: "Enter your User Id.",
          placement: "bottom",
        });
      }
      setLoader(false);
    } else if (password?.length < 1) {
      const id = "password-error";
      if (!toast.isActive(id)) {
        toast.show({
          id,
          title: "Password Required",
          status: "warning",
          description: "Enter your password.",
          placement: "bottom",
        });
      }
      setLoader(false);
    } else {
      let params = {
        mobile,
        password,
      };
      iotService
        .loginCheck(params)
        .then((res) => {
          let response = res?.result;
          if (response?.status === API_STATUS.SUCCESS) {
            saveData(response?.userId);
            dispatch(updateUserInfo(response?.data))
            contextValue?.handleUserInfo("user", response?.data);
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
          setres(err);
          console.log(err);
          setLoader(false);
        });
    }
  };
  return (
    <NativeBaseProvider>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <VStack space={2}>
              <HStack justifyContent="center">
                <Image
                  source={require("./../../assets/images/wheel.png")}
                  alt="Alternate Text"
                  size={70}
                />
              </HStack>
              <Text style={styles.header}>Sign in to continue!</Text>
              <FormControl isRequired>
                <FormControl.Label
                  _text={{ color: "muted.700", fontSize: "sm", fontWeight: 600 }}
                >
                  Mobile Number
                </FormControl.Label>
                <Input
                  type="number"
                  autoComplete="off"
                  style={styles.inputBorder}
                  placeholder="Enter your Mobile Number"
                  autofocus="on"
                  ref={userIdRef}
                  onClick={(e) => e.stopPropagation()}
                  onChangeText={(value) => setMobile(value)}
                />
              </FormControl>
              <FormControl mb={5} isRequired>
                <FormControl.Label
                  _text={{ color: "muted.700", fontSize: "sm", fontWeight: 600 }}
                >
                  Password
                </FormControl.Label>
                <Input
                  type="password"
                  style={styles.inputBorder}
                  autoComplete="off"
                  placeholder="Enter your password"
                  ref={passwordRef}
                  onClick={(e) => e.stopPropagation()}
                  onChangeText={(value) => setPassword(value)}
                />
                {/* <Link
              _text={{ fontSize: 'xs', fontWeight: '700', color: 'cyan.500' }}
              alignSelf="flex-end"
              mt={1}
            >
              Forget Password?
            </Link> */}
              </FormControl>
              <VStack space={2}>
                <Button
                  isLoading={isLoading}
                  colorScheme="blue"
                  _loading={{
                    bg: "blue.700",
                    _text: {
                      color: "coolGray.700",
                    },
                  }}

                  _text={{ color: "white" }}
                  onPress={validateLoginForm}
                >
                  Login
                </Button>
              </VStack>
              <HStack justifyContent="center">
                <Text fontSize="sm" color="muted.700" fontWeight={400}>
                  I'm a new user.{" "}
                </Text>
                <Link
                  _text={{ bold: true, fontSize: "sm" }}
                  style={{ color: "blue" }}
                  onPress={() => navigation.navigate("RegisterScreen")}
                >
                  Sign Up
                </Link>
              </HStack>
            </VStack>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

    </NativeBaseProvider>
  );
};
export default LoginScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    padding: 24,
    width: '100%',
    // borderWidth: 5,
    // borderColor: 'red'
    backgroundColor: '#fff',

  },
  header: {
    fontSize: 24,
    marginBottom: 10,
    alignSelf: 'center'
  },
  textInput: {
    height: 40,
    borderColor: "#000000",
    borderBottomWidth: 1,
    marginBottom: 1
  },
  btnContainer: {
    backgroundColor: "white",
    marginTop: 12
  }
});
