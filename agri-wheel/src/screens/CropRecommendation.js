import { CheckIcon, Select, Box, Input } from 'native-base';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  StatusBar,
  Image,
  TouchableOpacity,
  Platform,
  Button
} from 'react-native'
import { theme } from '../AppStyles';
import { iotService } from '../services/services';
import AsyncStorage from "@react-native-async-storage/async-storage";

const CropRecommendation = ({ navigation }) => {
  const [deviceId, setDeviceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [sensorData, setSensorData] = useState(null);
  const [userId, setUserId] = useState("");
  const getUserData = async () => {
    try {
      let user = await AsyncStorage.getItem("user_ids");
      setUserId(user);
    } catch (error) {
      setUserId("");
    }
  };
  const getPredictions = (payload) => {
    setLoading(true);
    setError(null);
    setPrediction(null);
    const params = {
      "data": { ...payload }
    }
    iotService.getCropRecommendation(params).then((res => {
      setPrediction(res);
    })).catch(err => {
      setError(err);
    }).finally(() => setLoading(false))
  }
  const getSensorData = () => {
    setLoading(true);
    setError(null);
    setPrediction(null);
    const params = {
      user_id: userId,
      device_id: deviceId.toUpperCase()
    }
    iotService.getSensorsData(params).then((res => {
      if (res?.result?.status == 'SUCCESS') {
        const sensorData = res?.result?.data;
        const payload = {
          temperature: Number(sensorData?.temperature),
          humidity: Number(sensorData?.humidity),
          ph: Number(sensorData?.ph_value),
          N: Number(sensorData?.n_value),
          P: Number(sensorData?.p_value),
          K: Number(sensorData?.k_value)
        }
        setSensorData(payload);
        getPredictions(payload);
      } else {
        setError(res?.result?.message);
      }
    })).catch(err => {
      setError(err);
    }).finally(() => setLoading(false))


  }
  useEffect(() => {
    getUserData();
    // setAreaOfPlantation("");
  }, []);


  return (
    <View style={styles.container}>
      <Input
        variant="underlined"
        style={styles.inputBorder}
        value={deviceId}
        placeholder="Device ID"
        type="text"
        autoComplete="off"
        onClick={(e) => e.stopPropagation()}
        onChangeText={(value) => setDeviceId(value)}
        mt={4}
        mb={4}
        w="80%"
      />
      <View style={styles.predictionWrapper}>
        {loading && <ActivityIndicator size={"large"} />}
        {/* <Text onPress={requestCameraPermission} style={styles.transparentText}>Camera Launch</Text> */}
        {prediction && <Text style={styles.disease}>
          {
            <>
              <Text>
                Crop : {prediction?.prediction}
              </Text>
            </>
          }
        </Text>}
        {error && <Text style={styles.errorText}>
          {
            error
          }
        </Text>}
        {sensorData &&
          <>
            <Text> Temperature: {sensorData?.temperature}</Text>
            <Text>Humidity: {sensorData?.humidity}</Text>
            <Text>PH: {sensorData?.ph}</Text>
            <Text>N: {sensorData?.N}</Text>
            <Text>P: {sensorData?.P}</Text>
            <Text>K: {sensorData?.K}</Text>
          </>
        }
        <Button
          style={{ backgroundColor: "#307ecc" }}
          _text={{ color: "white" }}
          title=" Get Predictions"
          disabled={!deviceId}
          onPress={() => getSensorData()}
        >
        </Button>

      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondary,
    alignItems: 'center',
  },
  imageWrapper: {
    width: 280,
    height: 280,
    padding: 10,
    borderColor: theme.colors.primary,
    borderWidth: 5,
    borderStyle: 'dashed',
    marginTop: 40,
    marginBottom: 10,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageContainer: {
    width: 250,
    height: 250,
    position: 'absolute',
    top: 10,
    left: 10,
    bottom: 10,
    right: 10
  },
  predictionWrapper: {
    height: 100,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center'
  },
  transparentText: {
    color: theme.colors.primary,
    opacity: 0.7
  },
  errorText: {
    color: theme.colors.error,
    marginBottom: 10,
  },
  disease: {
    color: 'black',
    fontSize: 20,
    marginBottom: 10

  },
  inputBorder: {
    borderColor: "grey",
  },

})

export default CropRecommendation;