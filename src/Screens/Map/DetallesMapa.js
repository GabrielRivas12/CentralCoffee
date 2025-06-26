import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Boton from '../../Components/Boton'
import MapView, { Marker } from 'react-native-maps';
import { Linking } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function DetallesMapa({ navigation, route }) {
  const { marker } = route.params;

  const handleGoToMaps = () => {
    if (!marker || !marker.coordinate) return;

    const { latitude, longitude } = marker.coordinate;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  };



  return (
    <View style={styles.container}>
      <SafeAreaView edges={[ 'bottom']} style={{ backgroundColor: '#fff', flex: 1, width: 390 }}>
        <View style={styles.mapContainer}>
          {marker.coordinate && (
            <MapView
              style={styles.previewMap}
              initialRegion={{
                latitude: marker.coordinate.latitude,
                longitude: marker.coordinate.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
              rotateEnabled={false}
              pitchEnabled={false}
            >
              <Marker coordinate={marker.coordinate} />
            </MapView>
          )}
        </View>

        <View style={styles.containerDescripcion}>
          <Text style={styles.DescripcionText}>Descripción:</Text>
          <Text>{marker.descripcion}</Text>
        </View>

        <View style={styles.bottomPanel}>
          <View style={styles.Icono}>
            <Feather name="map-pin" size={24} color="black" />
          </View>

          <Text style={styles.infoTitle}>{marker.nombre}</Text>
          <Text style={styles.infoText}>Horario: {marker.horario}</Text>
        </View>


        <View style={styles.botonllegar}>
          <Boton
            nombreB="Cómo llegar"
            onPress={handleGoToMaps}
            backgroundColor="#ddd"
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  previewMap: {
    flex: 1
  },
  mapContainer: {
    width: 355,
    height: 200,
    marginBottom: 15,
    marginLeft: 20,
    top: 10,
    borderRadius: 10,
    borderColor: '#000', // o el color que desees
    overflow: 'hidden',  // 🔑 Esto hace que borderRadius funcione correctamente
  },
  containerDescripcion: {
    marginLeft: 20,
    top: 120
  },
  bottomPanel: {
    position: 'absolute',
    top: 250,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 10,
    borderRadius: 10,
    height: 70

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
  botonllegar: {
    top: 300
  },
  DescripcionText: {
    fontWeight: 'bold',
    fontSize: 16
  }
});