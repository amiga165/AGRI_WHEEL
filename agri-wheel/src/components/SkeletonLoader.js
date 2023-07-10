import React from "react";
import { View } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
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
const SkeletonLoader = () => {
  return (
    <Box m={(5, 5)}>
      <SkeletonPlaceholder>
        <Stack space={4} p={[4, 4, 8]}>
          <VStack mx={0} space="md">
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ width: 60, height: 60, borderRadius: 50 }} />
              <View style={{ marginLeft: 20 }}>
                <View style={{ width: 120, height: 20, borderRadius: 4 }} />
                <View
                  style={{
                    marginTop: 6,
                    width: 80,
                    height: 20,
                    borderRadius: 4,
                  }}
                />
              </View>
            </View>
          </VStack>
        </Stack>
      </SkeletonPlaceholder>
    </Box>
  );
};
export default SkeletonLoader;
