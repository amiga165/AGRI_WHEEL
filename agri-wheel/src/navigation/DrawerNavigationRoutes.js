import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import AddCropScreen from '../screens/AddCropScreen';
import ContactScreen from '../screens/ContactScreen';
import DetectDisease from '../screens/DetectDisease';
import circle from '../screens/circle';
import CustomSidebarMenu from './../components/CustomSidebarMenu';
import NavigationDrawerHeader from './../components/NavigationDrawerHeader';
import { headerStyles } from './../AppStyles';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const HomeScreenRoutes = ({ navigation }) => {
  return (
    <Stack.Navigator initialRouteName="HomeScreen"
    screenOptions={{
      headerLeft: () => (
        <NavigationDrawerHeader navigationProps={navigation} />
      ),
      ...headerStyles
    }}>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: 'Home',
        }}
      />
    </Stack.Navigator>
  );
};

const CropScreenRoutes = ({ navigation }) => {
  const config = {
    animation: 'spring',
    config: {
      stiffness: 1000,
      damping: 500,
      mass: 3,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
  };
  return (
    <Stack.Navigator
      initialRouteName="CropScreen"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerHeader navigationProps={navigation} />
        ),
        ...headerStyles,
      }}>
      <Stack.Screen
        name="CropScreen"
        component={AddCropScreen}
        options={{transitionSpec: {
          open: config,
          close: config,
        },
          title: 'Add Crop', 
        }}
      />
    </Stack.Navigator>
  );
};



const DetectDiseaseRoutes = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="PhotoScreen"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerHeader navigationProps={navigation} />
        ),
        ...headerStyles
      }}>
      <Stack.Screen
        name="PhotoScreen"
        component={DetectDisease}
        options={{
          title: 'Detect Disease', //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
};

const CircleScreenStack = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="CircleScreen"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerHeader navigationProps={navigation} />
        ),
        ...headerStyles
      }}>
      <Stack.Screen
        name="CircleScreen"
        component={circle}
        options={{
          title: 'Circle', //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
};

const ContactScreenRoutes = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="ContactScreen"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerHeader navigationProps={navigation} />
        ),
        ...headerStyles
      }}>
      <Stack.Screen
        name="ContactScreen"
        component={ContactScreen}
        options={{
          title: 'Contact', //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
};

const DrawerNavigatorRoutes = (props) => {
  return (
    <Drawer.Navigator
      drawerContentOptions={{
        activeTintColor: '#cee1f2',
        color: '#cee1f2',
        itemStyle: { marginVertical: 6, color: 'white' },
        labelStyle: {
          color: '#d8d8d8',
        },
      }}
      screenOptions={{ headerShown: false }}
      drawerContent={CustomSidebarMenu}
      // drawerType={'slide'}
      statusBarAnimation='fade'
      >
      <Drawer.Screen
        name="home"
        options={{ drawerLabel: 'Home' }}
        component={HomeScreenRoutes}
      />
      <Drawer.Screen
        name="AddCrop"
        options={{ drawerLabel: 'Add Crop' }}
        component={CropScreenRoutes}
      />
      <Drawer.Screen
        name="disease"
        options={{ drawerLabel: 'Detect Disease' }}
        component={DetectDiseaseRoutes}
      />
      <Drawer.Screen
        name="contact"
        options={{ drawerLabel: 'Contact Us' }}
        component={ContactScreenRoutes}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigatorRoutes;
