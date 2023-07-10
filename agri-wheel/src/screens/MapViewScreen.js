import React, { useState, useRef, useContext, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { StyleSheet,View, } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { context } from "../context/context";
const MapViewScreen = ({ navigation }) => {
  const route = useRoute();
  const contextValue = useContext(context);
  const mapRef = useRef(null);
  const [region, setRegion] = useState(null);
  const [location, setLocation] = useState(route.params?.location);
  const officeLocation = {
    latitude: 16.7936998,
    longitude: 80.8230526,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };
  const saveRegion = (region)=>{
    setRegion(region);
    contextValue?.handleUserInfo("region", region);
  }
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        ref={mapRef}
        initialRegion={region ?? location ?? officeLocation}
        onRegionChangeComplete={(region) => saveRegion(region)}
      >
        <Marker
          draggable
          coordinate={region ?? location}
          onDragEnd={(e) => {
            console.log("dragEnd", e.nativeEvent.coordinate);
          }}
        />
      </MapView>
    </View>
  );
};
const styles = StyleSheet.create({
    inputBorder: {
      borderColor: 'grey',
    },
    buttonStyle: {
      backgroundColor: 'blue',
    },
    map: {
      flex: 1,
      height: 400,
      // width : 200
    },
    container: {
      flex: 4, //the container will fill the whole screen.
    },
  });
export default MapViewScreen;
