import React,{useState,useEffect} from 'react';
import {View, Text, Alert, StyleSheet} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {theme} from './../AppStyles';
const CustomSidebarMenu = (props,passProps) => {  
  return (
    <View style={stylesSidebar.sideMenuContainer}>
      <View style={stylesSidebar.profileHeader}>
        <View style={stylesSidebar.profileHeaderPicCircle}>
          <Text style={{fontSize: 25, color: theme.colors.primary}}>
            {passProps?.fullName ?? 'MM'}
          </Text>
        </View>
        <Text style={stylesSidebar.profileHeaderText}>{'Maneeswar Mutyala'}</Text>
      </View>
      <View style={stylesSidebar.profileHeaderLine} />

      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label={({color}) => <Text style={{color: '#d8d8d8'}}>Logout</Text>}
          onPress={() => {
            props.navigation.toggleDrawer();
            AsyncStorage.clear();
            props.navigation.replace('LoginStack');
          }}
        />
      </DrawerContentScrollView>
    </View>
  );
};

export default CustomSidebarMenu;

const stylesSidebar = StyleSheet.create({
  sideMenuContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.primary,
    paddingTop: 40,
    color: 'white',
  },
  profileHeader: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    padding: 15,
    textAlign: 'center',
  },
  profileHeaderPicCircle: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    color: 'white',
    backgroundColor: '#ffffff',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeaderText: {
    color: 'white',
    alignSelf: 'center',
    paddingHorizontal: 10,
    fontWeight: 'bold',
  },
  profileHeaderLine: {
    height: 1,
    marginHorizontal: 20,
    backgroundColor: '#e2e2e2',
    marginTop: 15,
  },
});
