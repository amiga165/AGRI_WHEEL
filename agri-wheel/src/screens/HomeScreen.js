import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  Alert,
  Box,
  Icon,
  VStack,
  Text,
  HStack,
  Button,
  Container
} from "native-base";
import { useSelector } from 'react-redux'
import { RefreshControl, StyleSheet, View, ScrollView, ImageBackground } from 'react-native';
import { theme } from "../AppStyles";
import WheelOfFortune from './../components/WOF';
const HomeScreen = ({ navigation }) => {
  const userInfo = useSelector((state) => state?.user?.userInfo);
  // console.log(userInfo);
  const options = [{
    name: 'FertilizerRecommendation',
    route: '',
  }, {
    name: 'CropRecommendation',
    route: 'CropRecommendation'
  }, {
    name: 'WeedRecommendation',
    route: ''
  }, {
    name: 'DiseaseRecommendation', route: 'DetectDisease'
  }, {
    name: 'SmartIrrigation', route: 'SmartIrrigation'
  }];
  const wheelOptions = {
    rewards: options.map(item => item.name),
    borderWidth: 5,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    textAngle: 'vertical',
    // knobSource: require('./knob.png'),
    onRef: ref => (this.child = ref),
  };
  const handleRoutes = (value) => {
    const route =  options.filter(item => item.name == value)?.[0]?.route;
    if(route!=''){
      navigation.navigate(route);
      return;
    }
    alert(value)
  }
  return (
    <View style={styles.container}>
      <ImageBackground source={require('./../../assets/images/bg.jpg')} style={{ width: '100%', height: '100%' }}>
        <View style={styles.container}>
          {/* <Text fontSize="lg" letterSpacing="md" style={{color: '#eee'}}>Smart and sustainable agriculture </Text> */}
          <WheelOfFortune options={wheelOptions} navigate={handleRoutes} />
        </View>
      </ImageBackground>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
})
export default HomeScreen;
