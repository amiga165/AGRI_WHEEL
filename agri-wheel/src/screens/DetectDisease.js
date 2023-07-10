import { CheckIcon, Select, Box } from 'native-base';
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
  Button,
  Dimensions
} from 'react-native'
import { theme } from './../AppStyles';
import { iotService } from './../services/services';
import DocumentPicker from 'react-native-document-picker';
import {
  LineChart,
} from "react-native-chart-kit";

const DetectDisease = ({ navigation }) => {
  const [typeOfCrop, setTypeOfCrop] = useState(null);
  const [image, setImages] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState({});

  async function base64File(url) {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
    });
  }
  const getPredictions = async (image) => {
    console.log(image);
    setLoading(true);
    setError(null);
    const image_url = `https://awheel1.blob.core.windows.net/images/${image}`;
    // const base64img = await base64File(image_url);
    const params = {
      image: image_url,
      plant_name: typeOfCrop.toLowerCase()
    }
    // console.log(params);
    iotService.getDiseasePrediction(params).then((res => {
      // const orderedList = res?.results?.sort((a, b) => {
      //   a.percentage = Number(a.percentage)
      //   b.percentage = Number(b.percentage)
      //   return b.percentage - a.percentage
      // })
      // if (orderedList[0]?.disease == 'None') {
      //   setError('Not a valid crop image')
      //   setPrediction({})
      // } else {
      //   setPrediction(orderedList);
      // }
      setPrediction(res?.results);
    })).catch(err => {
      setError('Prediction Service is not available');
    }).finally(() => setLoading(false))


  }
  const uploadImageToAzure = async () => {
    setPrediction({})
    setError(null);
    if (!typeOfCrop) {
      setError('Please Choose type of crop');
      return;
    } else if (!image) {
      setError('Please Choose Image');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", ...image);
    formData.append("crop", typeOfCrop.toLowerCase());
    iotService.fileUploadToAzure(formData)
      .then(res => {
        console.log(res);
        if (res?.result?.status == 'success') {
          getPredictions(res?.result?.data);
        } else {
          setError(res?.result?.message);
        
          setLoading(false);
        }
      })
      .catch(err => { setError('Image Upload Failed. Retry Once'); setLoading(false); })

  }
  const selectOnlyImage = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],

      });
      setImages(res);
    } catch (err) {
      setImages(null);
    }
  }
  return (
    <View style={styles.container}>
      <Select
        selectedValue={typeOfCrop}
        placeholder="Choose Type of Crop"
        onValueChange={(itemValue) => {
          setTypeOfCrop(itemValue);
        }}
        _selectedItem={{
          bg: "teal.600",
          endIcon: <CheckIcon size={5} />,
        }}
        defaultValue={"Choose Crop"}
        style={{ borderColor: "black" }}
        mt={4}
        w="80%"
      >
        <Select.Item label="Tomato" value="Tomato" />
        <Select.Item label="Paddy" value="Paddy" />
        <Select.Item label="Sugarcane" value="Sugarcane" />
        <Select.Item label="Wheat" value="Wheat" />
        <Select.Item label="Potato" value="Potato" />
        <Select.Item label="Corn" value="Corn" />
      </Select>
      <TouchableOpacity
        style={styles.imageWrapper}
        onPress={selectOnlyImage}>
        {image && <Image source={image} style={styles.imageContainer} />}

        {!image && (
          <Text style={styles.transparentText} onPress={selectOnlyImage}>Tap to choose image</Text>
        )}
      </TouchableOpacity>
      <View style={styles.predictionWrapper}>
        {loading && <ActivityIndicator size={"large"} />}
        {/* <Text onPress={requestCameraPermission} style={styles.transparentText}>Camera Launch</Text> */}
        {error && <Text style={styles.errorText}>
          {
            error
          }
        </Text>}

        <Button
          color={theme.colors.primary}
          _text={{ color: "white" }}
          title=" Get Predictions"
          disabled={!imgUrl && !typeOfCrop}
          onPress={() => uploadImageToAzure()}
        >
        </Button>
      </View>

      <Text style={styles.disease}>
        {prediction.length && (
          <LineChart
            data={{
              labels: prediction.map(item => item.disease),
              datasets: [
                {
                  data: prediction.map(item => item.percentage)
                }
              ]
            }}
            width={Dimensions.get("window").width} // from react-native
            height={220}
            yAxisSuffix="%"
            yAxisInterval={1} // optional, defaults to 1
            xLabelsOffset={2}
            chartConfig={{
              backgroundColor: theme.colors.primary,
              backgroundGradientFrom: "#0d5941",
              backgroundGradientTo: "#5eba7d",
              decimalPlaces: 0, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#0d5941"
              }
            }}
            bezier
            style={{
              marginVertical: 0,
              borderRadius: 0
            }}
          />
        )}
      </Text>
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
    height: 'auto',
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
    fontSize: 15,
    marginBottom: 10,
    marginTop: 10
  }

})

export default DetectDisease;