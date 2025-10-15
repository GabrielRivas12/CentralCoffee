import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Boton from '../../Components/Boton'
import MapView, { Marker } from 'react-native-maps';
import Feather from '@expo/vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import appFirebase from '../../Services/Firebase';
import { useFocusEffect } from '@react-navigation/native';

import { handleMapPress, zoomIn, zoomOut, handleMarkerPress } from '../../Containers/AccionesMapa';
import { obtenerLugaresMapa } from '../../Containers/ObtenerLugaresMapa';

import { PROVIDER_GOOGLE } from 'react-native-maps';
import {
  getFirestore,
} from 'firebase/firestore';

const db = getFirestore(appFirebase);

export default function Mapa({ navigation, user }) {

  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showMessage, setShowMessage] = useState(true);
  const [region, setRegion] = useState({
    latitude: 12.8654,
    longitude: -85.2072,
    latitudeDelta: 4.0,
    longitudeDelta: 4.0,
  });

  useFocusEffect(
    useCallback(() => {
      obtenerLugaresMapa(db, setMarkers);

      // Mostrar el mensaje cada vez que la pantalla recibe foco
      setShowMessage(true);

      // Configurar el temporizador para ocultar el mensaje después de 8 segundos
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 8000);

      // Limpiar el temporizador cuando el componente se desmonte o pierda foco
      return () => clearTimeout(timer);
    }, [])
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={'top'}>
        {showMessage && (
          <View style={styles.floatingMessage}>
            <Feather name="info" size={14} color="#fff" style={styles.messageIcon} />
            <Text style={styles.messageText}>
              ¿Eres comerciante? Registra tu finca pulsando la pantalla
            </Text>
          </View>
        )}

        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
          onPress={() => setSelectedMarker(null)}
          onLongPress={(event) => handleMapPress(event, navigation, user)}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={marker.coordinate}
              onPress={() => handleMarkerPress(marker, setSelectedMarker)}
            />
          ))}
        </MapView>

        <View style={styles.zoomControls}>
          <View style={{ marginHorizontal: 5 }}>
            <Boton
              nombreB="+"
              onPress={() => zoomIn(region, setRegion)}
              backgroundColor="#fff"
              ancho="40"
              alto="40"
            />
          </View>
          <View style={{ marginHorizontal: 5 }}>
            <Boton nombreB="-"
              onPress={() => zoomOut(region, setRegion)}
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
                onPress={() => navigation.navigate('Más Información', { marker: selectedMarker })}
                backgroundColor="#fff"
                ancho="90"
                alto="40"
              />
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    flex: 1,
  },
  floatingMessage: {
    position: 'absolute',
    top: 10,
    left: 20,
    right: 20,
    backgroundColor: '#b55034',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  messageIcon: {
    marginRight: 6,
  },
  messageText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 10,
    borderRadius: 10,
    height: 70,
    width: 373
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
    position: 'absolute',
    top: 15,
    left: 70
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
    backgroundColor: 'Transparent',
    borderRadius: 8,
    bottom: 130,
    right: 10,
  },
});