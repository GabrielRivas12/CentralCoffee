import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Image } from 'react-native';
import Boton from '../../Components/Boton'
import appFirebase from '../../Services/Firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import {
  collection,
  getFirestore,
  query, doc,
  setDoc, getDocs, getDoc,
  deleteDoc
} from 'firebase/firestore';

const db = getFirestore(appFirebase);


export default function DetallesOferta({ route, navigation }) {

  const { oferta } = route.params;
  const [Ofertass, setOfertass] = useState([]);

  const [selectedMarker, setSelectedMarker] = useState(null);


  const LeerDatos = async () => {
    const q = query(collection(db, "oferta"));
    const querySnapshot = await getDocs(q);
    const d = [];
    querySnapshot.forEach((doc) => {
      const datosBD = doc.data();
      d.push(datosBD);
    });
    setOfertass(d);
  }

  useEffect(() => {
    LeerDatos();
    obtenerLugar();
  }, []);

  const obtenerLugar = async () => {
    try {
      const docRef = doc(db, "lugares", oferta.lugarSeleccionado);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setSelectedMarker(docSnap.data());
      } else {
        console.log("No se encontró el lugar");
      }
    } catch (error) {
      console.error("Error al obtener el lugar:", error);
    }
  };


  return (
    <View style={styles.container}>
      <StatusBar backgroundColor='#ED6D4A' barStyle='light-content' />
      <SafeAreaView edges={['bottom']} style={{ backgroundColor: '#fff', flex: 1 }}>

        <View style={styles.containerListaImagen}>
          <Image
            source={{ uri: oferta.imagen }}
            style={{ width: '100%', height: '100%', borderRadius: 10 }}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.Titulo}>{oferta.titulo}</Text>

        <View style={styles.containerInformacion}>
          <Text style={styles.TextoTitulo}>Características</Text>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.TextoDato}>
                <Text style={styles.TextoInfo}>Tipo de café: </Text>
                {oferta.tipoCafe}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.TextoDato}>
                <Text style={styles.TextoInfo}>Variedad: </Text>
                {oferta.variedad}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.TextoDato}>
                <Text style={styles.TextoInfo}>Estado del grano: </Text>
                {oferta.estadoGrano}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.TextoDato}>
                <Text style={styles.TextoInfo}>Clima: </Text>
                {oferta.clima}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.TextoDato}>
                <Text style={styles.TextoInfo}>Altura: </Text>
                {oferta.altura}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.TextoDato}>
                <Text style={styles.TextoInfo}>Proceso de corte: </Text>
                {oferta.procesoCorte}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.TextoDato}>
                <Text style={styles.TextoInfo}>Fecha de cosecha: </Text>
                {oferta.fechaCosecha}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.TextoDato}>
                <Text style={styles.TextoInfo}>Cantidad de producción: </Text>
                {oferta.cantidadProduccion}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.TextoDato}>
                <Text style={styles.TextoInfo}>Oferta por libra: </Text>
                {oferta.ofertaLibra}
              </Text>
            </View>
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
                onPress={() => navigation.navigate('Más Información', { marker: selectedMarker, })}
                backgroundColor="#fff"
                ancho="90"
                alto="40"
              />
            </View>
          </View>
        )}


        <View style={styles.BotonesContacto}>

          <Boton
            nombreB='Iniciar Chat '
            iconName='send'
            iconLibrary="Feather"
            marginRight='90'
            ancho='150'
            leftTexto='10'
            ColorBoton="#ED6D4A"
            onPress={() => navigation.navigate('Chat', {
              otroUsuarioId: oferta.userId, ofertaReferencia: oferta,  
            })}
          />

        </View>
      </SafeAreaView>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  containerInformacion: {
    backgroundColor: '#EBEBEB',
    width: 373,
    height: 250,
    borderRadius: 10,
  },
  TextoInfo: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 20
  },
  containerListaImagen: {
    width: 373,
    height: 140,
    backgroundColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#999',
    marginBottom: 10,
    marginTop: 10
  },
  BotonesContacto: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    marginTop: 50,
    left: '20%'
  },
  Titulo: {
    marginLeft: 15,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',

  },
  TextoDato: {
    marginLeft: 5,
    marginTop: 10,
  },
  TextoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    top: 5,
    left: 15
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10
  },
  col: {
    flex: 1,
    paddingRight: 10,
  },
  bottomPanel: {
    position: 'relative',
    left: 0,
    right: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    height: 70,
    top: 10

  },
  BotonInfo: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    right: 10,
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
});