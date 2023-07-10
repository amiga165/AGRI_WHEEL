import { View, Text, SafeAreaView } from 'react-native';
import { Camera, CameraPermissionStatus, useCameraDevices, frameRateIncluded } from 'react-native-vision-camera';
import React, { useEffect, useState, useCallback } from 'react';
const PermissionsPage = ({ navigation }) => {
  const [cameraPermissionStatus, setCameraPermissionStatus] = useState('not-determined');
  const requestCameraPermission = useCallback(async () => {
    console.log('Requesting camera permission...');
    const permission = await Camera.requestCameraPermission();
    console.log(`Camera permission status: ${permission}`);
    if (permission === 'denied') await Linking.openSettings();
    setCameraPermissionStatus(permission);
  }, []);
  useEffect(() => {
    if (cameraPermissionStatus === 'authorized') navigation.replace('CameraPage');
  }, [cameraPermissionStatus, navigation]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 16 }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
         {cameraPermissionStatus !== 'authorized' && (
          <Text >
            Vision Camera needs <Text>Camera permission</Text>.{' '}
            <Text onPress={requestCameraPermission}>
              Grant
            </Text>
          </Text>
        )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PermissionsPage;
