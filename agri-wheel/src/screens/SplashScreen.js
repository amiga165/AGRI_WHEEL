import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet, Image, Text } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../AppStyles';

const SplashScreen = ({ navigation }) => {
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setAnimating(false);
      AsyncStorage.getItem('user_ids').then((value) =>
        navigation.replace(value === null ? 'LoginStack' : 'AuthStack'),
      );
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('./../../assets/images/wheel.png')}
        style={{ width: '100%', resizeMode: 'contain', margin: 30 }}
      />
      <ActivityIndicator
        animating={animating}
        color="#307ecc"
        size="large"
        style={styles.activityIndicator}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  }
});
