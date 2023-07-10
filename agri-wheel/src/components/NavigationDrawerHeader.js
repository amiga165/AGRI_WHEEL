import React from 'react';
import {View,  TouchableOpacity} from 'react-native';
import Icon from "react-native-vector-icons/AntDesign";
import { theme } from '../AppStyles';
const NavigationDrawerHeader = (props) => {
  const toggleDrawer = () => {
    props.navigationProps.toggleDrawer();
  };

  return (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity onPress={toggleDrawer}>
        <Icon name="menufold" size={24} color={theme.colors.primary} style={{width: 50, height: 30, marginLeft: 10}}/>
      </TouchableOpacity>
    </View>
  );
};
export default NavigationDrawerHeader;
