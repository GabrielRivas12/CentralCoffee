import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Image } from 'react-native';
import Boton from '../../Components/Boton'
import appFirebase from '../../Services/Firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';

import { obtenerDatosUsuario } from '../../Containers/ObtenerUsuario';
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
        setSelectedMarker({ id: docSnap.id, ...docSnap.data() });

      } else {
        console.log("No se encontró el lugar");
      }
    } catch (error) {
      console.error("Error al obtener el lugar:", error);
    }
  };

  const iniciarChat = async () => {
    try {
      const datos = await obtenerDatosUsuario(oferta.userId);

      navigation.navigate('Chat', {
        otroUsuarioId: oferta.userId,
        nombre: datos.nombre,
        fotoPerfil: datos.fotoPerfil,
        ofertaReferencia: oferta
      });
    } catch (error) {
      console.error('Error al iniciar chat:', error);
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
              <View style={styles.TextoDato}>
                <Text style={styles.TextoInfo}>Tipo de café:</Text>
                <Text>{oferta.tipoCafe}</Text>
              </View>
            </View>
            <View style={styles.col}>
              <View style={styles.TextoDato}>
                <Text style={styles.TextoInfo}>Variedad:</Text>
                <Text>{oferta.variedad}</Text>
              </View>
            </View>
          </View>


          <View style={styles.row}>
            <View style={styles.col}>
              <View style={styles.TextoDato}>
                <Text style={styles.TextoInfo}>Estado del grano:</Text>
                <Text>{oferta.estadoGrano}</Text>
              </View>
            </View>
            <View style={styles.col}>
              <View style={styles.TextoDato}>
                <Text style={styles.TextoInfo}>Clima:</Text>
                <Text>{oferta.clima}</Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <View style={styles.TextoDato}>
                <Text style={styles.TextoInfo}>Altura:</Text>
                <Text>{oferta.altura}</Text>
              </View>
            </View>
            <View style={styles.col}>
              <View style={styles.TextoDato}>
                <Text style={styles.TextoInfo}>Proceso de corte:</Text>
                <Text>{oferta.procesoCorte}</Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <View style={styles.TextoDato}>
                <Text style={styles.TextoInfo}>Oferta por libra:</Text>
                <Text>{oferta.ofertaLibra}</Text>
              </View>
            </View>
            <View style={styles.col}>
              <View style={styles.TextoDato}>
                <Text style={styles.TextoInfo}>Fecha de cosecha:</Text>
                <Text>{oferta.fechaCosecha}</Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <View style={styles.TextoDato}>
                <Text style={styles.TextoInfo}>Cantidad de producción:</Text>
                <Text>{oferta.cantidadProduccion}</Text>
              </View>
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
                onPress={() => navigation.navigate('Más Información', {
                  marker: {
                    id: selectedMarker.id,
                    nombre: selectedMarker.nombre,
                    horario: selectedMarker.horario,
                    descripcion: selectedMarker.descripcion,
                    coordinate: {
                      latitude: selectedMarker.latitud,
                      longitude: selectedMarker.longitud
                    }
                  }
                })}
                backgroundColor="#fff"
                ancho="90"
                alto="40"

              />
            </View>
          </View>
        )}


        <View style={styles.BotonesContacto}>

          <Boton
            nombreB='Iniciar Chat'
            ancho='150'
            Textoright='10'
            ColorBoton="#ED6D4A"
            onPress={iniciarChat}
          />
          <Feather name="send" size={24} color="white" position='absolute' left='60%' bottom='12' />
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
    width: 355,
    height: 300,
    borderRadius: 10,
  },

  containerListaImagen: {
    width: 355,
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
    left: '26.9%'
  },
  Titulo: {
    marginLeft: 15,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',

  },

  TextoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    top: 5,
    left: 20
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
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    height: 70,
    top: 30
    

  },
  BotonInfo: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 18,
    right: 0,
   
  },
  Icono: {
    width: 50,
    height: 50,
    backgroundColor: '#ddd',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    right: 10

  },
  infoTitle: {
    marginLeft: 60,
    position: 'absolute',
    top: 15,
  },
  infoText: {
    marginLeft: 60,
    position: 'absolute',
    top: 35,
  },
  TextoDato: {
    marginLeft: 30,
    marginTop: 15,
  },
  TextoInfo: {
    fontSize: 13,
    fontWeight: 'bold',
  }
});