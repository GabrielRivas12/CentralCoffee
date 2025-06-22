import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Boton from '../../Components/Boton'
import MapView, { Marker } from 'react-native-maps';
import Feather from '@expo/vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import appFirebase from '../../Services/BasedeDatos/Firebase';
import { useFocusEffect } from '@react-navigation/native';

import {
  collection,
  getFirestore,
  query, doc,
  setDoc, getDocs, getDoc, addDoc,
  deleteDoc
} from 'firebase/firestore';

const db = getFirestore(appFirebase);

export default function Mapa({ navigation }) {

  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [region, setRegion] = useState({
    latitude: 12.8654,
    longitude: -85.2072,
    latitudeDelta: 4.0,
    longitudeDelta: 4.0,
  });

 useFocusEffect(
  useCallback(() => {
  const obtenerLugares = async () => {
    try {
      const lugaresRef = collection(db, 'lugares');
      const snapshot = await getDocs(lugaresRef);
      const lugaresData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          nombre: data.nombre,
          horario: data.horario,
          descripcion: data.descripcion,
          coordinate: {
            latitude: data.latitud,
            longitude: data.longitud
          }
        };
      });

      setMarkers(lugaresData);
    } catch (error) {
      console.error('Error al obtener lugares: ', error);
    }
  };

  obtenerLugares();
}, []));



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
   const { coordinate } = event.nativeEvent;

  Alert.alert(
    'Agregar lugar',
    '¿Deseas registrar un nuevo lugar aquí?',
    [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Sí',
        onPress: () => {
          navigation.navigate('Crear Marcador', { coordinate });
        },
      },
    ],
    { cancelable: true }
  );
  };

  const handleMarkerPress = (marker) => {
    setSelectedMarker(marker);
  };


  return (
    <View style={styles.container}>
      <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1 }}>


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
                 onPress={() => navigation.navigate('Informacion', { marker: selectedMarker })}
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
  bottomPanel: {
    position: 'absolute',
    bottom: 55,
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