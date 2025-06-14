import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Linking  } from 'react-native';
import Boton from '../../Components/Boton'
import MapView, { Marker } from 'react-native-maps';
import Feather from '@expo/vector-icons/Feather';

export default function Mapa({ navigation }) {

  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [region, setRegion] = useState({
  latitude: 12.8654,
  longitude: -85.2072,
  latitudeDelta: 4.0,
  longitudeDelta: 4.0,
});

const zoomIn = () => {
  setRegion(prev => ({
    ...prev,
    latitudeDelta: prev.latitudeDelta / 2,
    longitudeDelta: prev.longitudeDelta / 2,
  }));
};

const zoomOut = () => {
  setRegion(prev => ({
    ...prev,
    latitudeDelta: prev.latitudeDelta * 2,
    longitudeDelta: prev.longitudeDelta * 2,
  }));
};

  const handleMapPress = (event) => {
    const newMarker = {
      coordinate: event.nativeEvent.coordinate,
      nombre: `Finca los pinos `,
      horario: '8:00 AM - 5:00 PM'
    };
    setMarkers([...markers, newMarker]);
    setSelectedMarker(null); // Ocultar info al agregar nuevo marcador
  };

    const handleMarkerPress = (marker) => {
    setSelectedMarker(marker);
  };

  const handleGoToMaps = () => {
    if (!selectedMarker) return;
    const { latitude, longitude } = selectedMarker.coordinate;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  };


  return (
    <View style={styles.container}>
  


      <MapView
  style={styles.map}
  region={region}
  onRegionChangeComplete={setRegion}
  onPress={() => setSelectedMarker(null)}
  onLongPress={handleMapPress}
>
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.coordinate}
            onPress={() => handleMarkerPress(marker)}
          />
        ))}
      </MapView>
      <View style={styles.zoomControls}>
  <View style={{ marginHorizontal: 5 }}>
    <Boton
     nombreB="+"
      onPress={zoomIn} 
      backgroundColor="#fff"
      ancho="40"
      alto="40"
      />
  </View>
  <View style={{ marginHorizontal: 5 }}>
    <Boton nombreB="-" 
    onPress={zoomOut} 
    backgroundColor="#fff"
    ancho="40"
      alto="40" />
  </View>
</View>

{selectedMarker && (
  <View style={styles.bottomPanel}>
    <View style={styles.Icono}>  
      <Feather name="map-pin" size={24} color="black" />
    </View>

    <Text style={styles.infoTitle}>{selectedMarker.nombre}</Text>
    <Text style={styles.infoText}>Horario: {selectedMarker.horario}</Text>

    <View style={styles.BotonInfo}>
      <Boton
        nombreB="Ir a Info"
        onPress={() => navigation.navigate('Informacion')}
        backgroundColor="#fff"
        ancho="90"
        alto="40"
      />
    </View>

    <Boton
      nombreB="Cómo llegar"
      onPress={handleGoToMaps}
      backgroundColor="#ddd"
    />
    
  </View>
)}
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
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 10,
    borderRadius: 10,
    height: 190

  },
  Icono: {
    width: 50,
    height: 50,
    backgroundColor: '#ddd',
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTitle: {
    marginLeft: 60,
    position: 'absolute',
    top: 15,
    left: 10,
  },
  infoText: {
    marginLeft: 60,
     position: 'absolute',
    top: 35,
    left: 10,
  },
  BotonInfo: {
    alignItems: 'center',
    position: 'absolute',
    top: 15,
    right: 10,
  },

zoomControls: {
  position: 'absolute',
  backgroundColor: 'Transparent', // fondo para que se vean bien
  borderRadius: 8,
  top: 450,
  right: 10,
},


});