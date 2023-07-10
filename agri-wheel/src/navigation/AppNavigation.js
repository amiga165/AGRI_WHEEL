import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { headerStyles } from './../AppStyles';
import SplashScreen from "./../screens/SplashScreen";
import LoginScreen from "./../screens/LoginScreen";
import RegisterScreen from "./../screens/RegisterScreen";
import ViewDetailsScreen from "./../screens/ViewDetailsScreen";
import MapViewScreen from "./../screens/MapViewScreen";
import PermissionsPage from './../screens/PermissionsPage';
import DrawerNavigationRoutes from "./DrawerNavigationRoutes";
import SmartIrrigation from './../screens/SmartIrrigation';
import DetectDisease from '../screens/DetectDisease';
import CropRecommendation from './../screens/CropRecommendation';
const Stack = createNativeStackNavigator();

const LoginStack = () => {
    return (
        <Stack.Navigator initialRouteName="LoginScreen">
            <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="RegisterScreen"
                component={RegisterScreen}
                options={{
                    title: "Register",
                    ...headerStyles
                }}
            />
        </Stack.Navigator>
    );
};
const AuthStack = () => {
    return (
        <Stack.Navigator
            initialRouteName="DrawerNavigationRoutes"
        >
            <Stack.Screen
                name="DrawerNavigationRoutes"
                component={DrawerNavigationRoutes}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ViewDetails"
                component={ViewDetailsScreen}
                options={({ route }) => ({
                    title: "Details of " + route?.params?.deviceId,
                })}
            />
            <Stack.Screen
                name="MapView"
                component={MapViewScreen}
                options={({ route }) => ({
                    title: "Choose Location",
                })}
            />
            <Stack.Screen
                name="SmartIrrigation"
                component={SmartIrrigation}
                options={({ route }) => ({
                    title: "Smart Irrigation",
                })}
            />
             <Stack.Screen
                name="DetectDisease"
                component={DetectDisease}
                options={({ route }) => ({
                    title: "Disease Prediction",
                })}
            />
            <Stack.Screen
                name="CropRecommendation"
                component={CropRecommendation}
                options={({ route }) => ({
                    title: "Crop Recommendation",
                })}
            />
            <Stack.Screen name="PermissionsPage" component={PermissionsPage} />
        </Stack.Navigator>
    )
}

const AppNavigator = () => (
    <NavigationContainer>
        <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen}
            />
            <Stack.Screen name="LoginStack" component={LoginStack} />
            <Stack.Screen name="AuthStack" component={AuthStack} />
        </Stack.Navigator>
    </NavigationContainer>
);
export default AppNavigator;  