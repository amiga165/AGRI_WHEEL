import React from "react";
import {
  VStack,
  Text,
  Box,
  Stack,
  Heading,
  HStack,
  Button,
  Alert,
  IconButton,
  CloseIcon,
} from "native-base";

function HomeCardComponent(props) {
  const {
    cropType = "Paddy",
    waterLevel = 0,
    seedType = "Paddy",
    deviceId = "DEVICE ID",
    userId,
    id
  } = props;
  const redirectToRoute = (deviceId) => {
    props.navigation.push("ViewDetails", { deviceId: deviceId });
  };
  return (
    <Box bg="white" shadow={2} rounded="lg" m={(5, 5)}>
      <Stack space={4} p={[4, 4, 8]}>
        <Text color="gray.400">{deviceId}</Text>
        <Heading size={["sm"]} noOfLines={2}>
          {cropType} - {seedType}
        </Heading>
        {cropType == "Paddy"  && id != 0 && (
          <Alert w="100%" status={"info"}>
            <VStack space={2} flexShrink={1} w="100%">
              <HStack flexShrink={1} space={2} justifyContent="space-between">
                <HStack space={2} flexShrink={1}>
                  <Alert.Icon mt="1" />
                  <Text fontSize="md" color="coolGray.800">
                    We have currently one device. So use latest crop
                  </Text>
                </HStack>
                <IconButton
                  variant="unstyled"
                  icon={<CloseIcon size="3" color="coolGray.600" />}
                />
              </HStack>
            </VStack>
          </Alert>
        )}
        {cropType != "Paddy" && (
          <Alert w="100%" status={"info"}>
            <VStack space={2} flexShrink={1} w="100%">
              <HStack flexShrink={1} space={2} justifyContent="space-between">
                <HStack space={2} flexShrink={1}>
                  <Alert.Icon mt="1" />
                  <Text fontSize="md" color="coolGray.800">
                    We don't have devices for this seed.
                  </Text>
                </HStack>
                <IconButton
                  variant="unstyled"
                  icon={<CloseIcon size="3" color="coolGray.600" />}
                />
              </HStack>
            </VStack>
          </Alert>
        )}
        {cropType == "Paddy"  && id == 0 && (
          <Button mx={1} onPress={() => redirectToRoute(deviceId)}>
            View Details
          </Button>
        )}
      </Stack>
    </Box>
  );
}

export default HomeCardComponent;
