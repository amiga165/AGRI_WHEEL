import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Dimensions, TouchableHighlight, Text
} from 'react-native'
import WheelOfFortune from './../components/WOF';
const Circle = ({ navigation }) => {
  // const participants = [
  //   'Disease Recommendation',
  //   'Crop Recommendation',
  //   'Weed Recommendation',
  //   'Smart Recommendation',
  //   'Fertilizer Recommendation',
  // ];
  const participants = [
    'Fertilizer Recommendation',
    'Crop Recommendation',
    'Weed Recommendation',
    'Disease Recommendation',
    'Smart Recommendation',
  ];
  const wheelOptions = {
    rewards: participants,
    borderWidth: 5,
    borderColor: '#fff',
    backgroundColor: 'transparent',
    textAngle: 'vertical',
    // knobSource: require('./knob.png'),
    onRef: ref => (this.child = ref),
  };
  return (
    <View style={styles.container}>
      <WheelOfFortune options={wheelOptions} getWinner={(value, index) => {
        console.log(index);
      }} />
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
})

export default Circle;