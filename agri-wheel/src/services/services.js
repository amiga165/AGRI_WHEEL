import axios from "axios";
import { API_BASE_URL, WEATHER_API_KEY, WEATHER_API, ML_API, FILE_UPLOAD_API } from "../constants";
const fetch = axios.create();
export const iotService = {
  loginCheck: async (params) => {
    let url = API_BASE_URL + "/login.php";
    try {
      let res = await fetch.post(url, params);
      return res.data;
    } catch (err) {
      await Promise.reject(err.response);
    }
  },
  addCrop: async (params) => {
    let url = API_BASE_URL + "/addcrop.php";
    try {
      let res = await fetch.post(url, params);
      return res.data;
    } catch (err) {
      await Promise.reject(err.response);
    }
  },
  fetchWeather: async (lat = 25, lon = 25) => {
    let url =
      WEATHER_API +
      `lat=${lat}&lon=${lon}&APPID=${WEATHER_API_KEY}&units=metric`;
    try {
      let res = await fetch.get(url);
      return res.data;
    } catch (err) {
      await Promise.reject(err.response);
    }
  },
  getUserDevices: async (userId) => {
    let url = API_BASE_URL + "/userdevices.php?" + `userId=${userId}`;
    try {
      let res = await fetch.get(url);
      return res.data;
    } catch (err) {
      await Promise.reject(err.response);
    }
  },
  updateMotorStatus: async (params) => {
    let url = API_BASE_URL + "/changemotorstatus.php";
    try {
      let res = await fetch.post(url, params);
      return res.data;
    } catch (err) {
      await Promise.reject(err.response);
    }
  },
  register: async (params) => {
    let url = API_BASE_URL + "/register.php";
    try {
      let res = await fetch.post(url, params);
      return res.data;
    } catch (err) {
      await Promise.reject(err.response);
    }
  },
  getDeviceData: async (deviceId) => {
    let url = API_BASE_URL + "/getDeviceData.php?" + `deviceId=${deviceId}`;
    try {
      let res = await fetch.get(url);
      return res.data;
    } catch (err) {
      await Promise.reject(err.response);
    }
  },
  getFeedsData: async () => {
    let url =
      "https://api.thingspeak.com/channels/1429722/feeds.json?api_key=F0HD0RSQY9GLSXUF&results=1";
    try {
      let res = await fetch.get(url);
      return res.data;
    } catch (err) {
      await Promise.reject(err.response);
    }
  },
  saveOneSignalData: async (params) => {
    let url = API_BASE_URL + "/onesignalUpdate.php";
    try {
      let res = await fetch.post(url, params);
      return res.data;
    } catch (err) {
      await Promise.reject(err.response);
    }
  },
  getUserData: async (params) => {
    let url = API_BASE_URL + "/getUserData.php";
    try {
      let res = await fetch.post(url, params);
      return res.data;
    } catch (err) {
      await Promise.reject(err.response);
    }
  },
  saveFeedsData: async (field1, field2, field3, field4, field5) => {
    let url =
      "https://api.thingspeak.com/update?api_key=E217V4V6MRFY5IAQ&" +
      `field1=${field1}&field2=${field2}&field3=${field3}&field4=${field4}&field5=${field5}`;
    try {
      let res = await fetch.get(url);
      return res.data;
    } catch (err) {
      await Promise.reject(err.response);
    }
  },
  fileUploadToAzure: async (params) => {
    let url = FILE_UPLOAD_API + "/upload.php";
    try {
      let res = await fetch.post(url, params, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      },);
      return res.data;
    } catch (err) {
      await Promise.reject(err.response);
    }
  },
  getDiseasePrediction: async (params) => {
    let url = 'https://dp24.azurewebsites.net/plant/disease_prediction';
    try {
      let res = await fetch.post(url, params);
      return res.data;
    } catch (err) {
      await Promise.reject(err.response);
    }
  },
  getCropRecommendation: async (params) => {
    let url = 'https://cr24.azurewebsites.net/plant/crop_recommendation';
    try {
      let res = await fetch.post(url, params);
      return res.data;
    } catch (err) {
      await Promise.reject(err.response);
    }
  },
  getSensorsData: async (params) => {
    let url = API_BASE_URL + "/getSensorsData.php";
    try {
      let res = await fetch.post(url,params);
      return res.data;
    } catch (err) {
      await Promise.reject(err.response);
    }
  },
};