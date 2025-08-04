import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Boton from '../../Components/Boton'
import MapView, { Marker } from 'react-native-maps';
import { Linking } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { DirigirGoogleMaps } from '../../Containers/DirigirGoogleMaps';


export default function DetallesMapa({ route }) {
  const { marker } = route.params;

  return (
    <View style={styles.container}>
      <SafeAreaView edges={[ 'bottom']} style={{ backgroundColor: '#fff', flex: 1 }}>
        <View style={styles.mapaContainer}>
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



        <View style={styles.PanelUbicacion}>
          <View style={styles.Icono}>
            <Feather name="map-pin" size={24} color="black" />
          </View>

            <Text style={styles.infoNombre}>{marker.nombre}</Text>
            <Text style={styles.infoHorario}>Horario: {marker.horario}</Text>
        </View>

          <View style={styles.containerDescripcion}>
          <Text style={styles.DescripcionText}>Descripción:</Text>
          <Text>{marker.descripcion}</Text>
        </View>


        <View>
          <Boton
            nombreB="Cómo llegar"
            onPress={() => DirigirGoogleMaps (marker.coordinate)}
            backgroundColor="#ddd"
            ancho='375'
          />
          <MaterialCommunityIcons name="directions" size={30} color="white" position='absolute' left='230' top='13' />
        </View>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  previewMap: {
    flex: 1
  },
  mapaContainer: {
    width: 375,
    height: 200,
    marginBottom: 15,
    top: 10,
    borderRadius: 10,
    borderColor: '#000', 
    overflow: 'hidden',  
  },
  containerDescripcion: {
    width: 375,
    height: 200
  },
  PanelUbicacion: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 10,
    height: 70,
    bottom: 50,
    top: 0
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
  infoNombre: {
    position: 'absolute',
    top: 5,
    left: 60
  },
  infoHorario: {
    position: 'absolute',
    top: 25,
    left: 60,
  },
  DescripcionText: {
    fontWeight: 'bold',
    fontSize: 16
  }
});