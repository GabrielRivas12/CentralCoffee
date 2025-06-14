import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions  } from 'react-native';
import Boton from '../../Components/Boton'
import MapView, { Marker } from 'react-native-maps';

export default function Mapa({navigation}) {
  
  const [markers, setMarkers] = useState([]);

  const handleMapPress = (event) => {
    const newMarker = event.nativeEvent.coordinate;
    setMarkers([...markers, newMarker]);
  };
  
  return (
    <View style={styles.container}>
       <MapView
        style={styles.map}
       initialRegion={{
  latitude: 12.8654,
  longitude: -85.2072,
  latitudeDelta: 4.0,
  longitudeDelta: 4.0,
}}

        onPress={handleMapPress}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker}
            title={`Marcador ${index + 1}`}
            description={`Lat: ${marker.latitude}, Lng: ${marker.longitude}`}
          />
        ))}
      </MapView>

      <View style={styles.bottomPanel}>
        <Text>Toque el mapa para agregar un marcador</Text>
        <Boton
          nombreB="Ir a Info"
          onPress={() => navigation.navigate('Informacion')}
          backgroundColor="#fff"
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
   map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
   bottomPanel: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 10,
    borderRadius: 10,
  },

});