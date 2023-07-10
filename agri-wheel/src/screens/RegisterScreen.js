import React, { useState, createRef } from "react";
import {
  NativeBaseProvider,
  Box,
  VStack,
  FormControl,
  Input,
  Button,
  useToast,
  Select,
  CheckIcon,
  ScrollView,
} from "native-base";
import { StyleSheet } from "react-native";
import { iotService } from "../services/services";
import { API_STATUS, TOAST_STATUS } from "./../constants";
import Loader from "./../components/Loader";

const RegisterScreen = ({ navigation }) => {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [fullname, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [acres, setAcres] = useState("");
  const [isLoading, setLoader] = useState(false);

  const validateForm = () => {
    setLoader(true);
    if (fullname?.length < 1) {
      const id = "fname-error";
      if (!toast.isActive(id)) {
        toast.show({
          id,
          title: "Fullname Required",
          status: "warning",
          description: "Enter your fullname.",
          placement: "bottom",
        });
      }
      setLoader(false);
    } else if (email?.length < 1) {
      const id = "email-error";
      if (!toast.isActive(id)) {
        toast.show({
          id,
          title: "Email Required",
          status: "warning",
          description: "Enter your email.",
          placement: "bottom",
        });
      }
      setLoader(false);
    } else if (mobile?.length < 1) {
      const id = "mobile-error";
      if (!toast.isActive(id)) {
        toast.show({
          id,
          title: "Mobile Number Required",
          status: "warning",
          description: "Enter your Mobile Number.",
          placement: "bottom",
        });
      }
      setLoader(false);
    }else if (mobile?.length > 10) {
      const id = "mobilelong-error";
      if (!toast.isActive(id)) {
        toast.show({
          id,
          title: "Mobile Number Should have 10 digits only",
          status: "warning",
          description: "Enter Valid Mobile Number.",
          placement: "bottom",
        });
      }
      setLoader(false);
    } else if (address?.length < 1) {
      const id = "address-error";
      if (!toast.isActive(id)) {
        toast.show({
          id,
          title: "Address Required",
          status: "warning",
          description: "Enter your address.",
          placement: "bottom",
        });
      }
      setLoader(false);
    } else if (acres?.length < 1) {
      const id = "acres-error";
      if (!toast.isActive(id)) {
        toast.show({
          id,
          title: "Acres Required",
          status: "warning",
          description: "Enter your acres.",
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
          description: "Enter your Password.",
          placement: "bottom",
        });
      }
      setLoader(false);
    } else if (confirmPassword?.length < 1) {
      const id = "confirmPassword-error";
      if (!toast.isActive(id)) {
        toast.show({
          id,
          title: "Confirm Password Required",
          status: "warning",
          description: "Re Enter your Password.",
          placement: "bottom",
        });
      }
      setLoader(false);
    } else if (password != confirmPassword) {
      const id = "pass-error";
      if (!toast.isActive(id)) {
        toast.show({
          id,
          title: "Passwords Not matched",
          status: "warning",
          description: "Re Enter your password.",
          placement: "bottom",
        });
      }
      setLoader(false);
    } else if (password?.length >= 1 && password?.length < 8) {
      const id = "passlen-error";
      if (!toast.isActive(id)) {
        toast.show({
          id,
          title: "Password should be at least 8 characters",
          status: "warning",
          description:
            "Use special characters, numbers, and lowercase letters.",
          placement: "bottom",
        });
      }
      setLoader(false);
    } else {
      let params = {
        email,
        password,
        address,
        acres,
        mobile,
        fullname,
      };
      iotService
        .register(params)
        .then((res) => {
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
              });
            }
            navigation.replace("Auth");
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

  return (
    <NativeBaseProvider>
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
          flex={1}
          p={(5, 5)}
          pt={10}
          w="100%"
          // mx='auto'
        >
        <Loader loading={isLoading} />
          <VStack space={2} mt={0}>
            <Input
              style={styles.inputBorder}
              placeholder="Enter your fullname"
              type="text"
              autoComplete="off"
              onClick={(e) => e.stopPropagation()}
              onChangeText={(value) => setFullName(value)}
            />
            <Input
              style={styles.inputBorder}
              placeholder="Enter your email"
              type="email"
              autoComplete="off"
              onClick={(e) => e.stopPropagation()}
              onChangeText={(value) => setEmail(value)}
            />
            <Input
              style={styles.inputBorder}
              placeholder="Enter your mobile number"
              type="number"
              autoComplete="off"
              onClick={(e) => e.stopPropagation()}
              onChangeText={(value) => setMobile(value)}
            />
            <Input
              style={styles.inputBorder}
              placeholder="Enter your address"
              type="text"
              autoComplete="off"
              onClick={(e) => e.stopPropagation()}
              onChangeText={(value) => setAddress(value)}
            />
            <Input
              style={styles.inputBorder}
              placeholder="Enter No Of acres"
              type="number"
              autoComplete="off"
              onClick={(e) => e.stopPropagation()}
              onChangeText={(value) => setAcres(value)}
            />
            <Input
              style={styles.inputBorder}
              placeholder="Enter your Password"
              type="password"
              autoComplete="off"
              onClick={(e) => e.stopPropagation()}
              onChangeText={(value) => setPassword(value)}
            />
            <Input
              style={styles.inputBorder}
              placeholder="Retype entered Password"
              type="password"
              autoComplete="off"
              onClick={(e) => e.stopPropagation()}
              onChangeText={(value) => setConfirmPassword(value)}
            />
            <VStack space={"md"}>
              <Button
                my={8}
                mx="auto"
                isLoading={isLoading}
                _loading={{
                  bg: "blue.700",
                  _text: {
                    color: "coolGray.700",
                  },
                }}
                style={{ backgroundColor: "#307ecc"}}
                _text={{ color: "white" }}
                onPress={validateForm}
              >
                Register With Us
              </Button>
            </VStack>
          </VStack>
        </Box>
      </ScrollView>
    </NativeBaseProvider>
  );
};
export default RegisterScreen;

const styles = StyleSheet.create({
  inputBorder: {
    borderColor: "grey",
  },
  buttonStyle: {
    backgroundColor: "blue",
  },
});
