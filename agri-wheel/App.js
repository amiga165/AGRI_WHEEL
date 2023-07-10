import "react-native-gesture-handler";
import React from "react";
import { NativeBaseProvider } from "native-base";
import AppNavigator from "./src/navigation/AppNavigation";


const App = () => {
  return (
    <NativeBaseProvider>
      <AppNavigator />
    </NativeBaseProvider>
  );
};
export default App;
