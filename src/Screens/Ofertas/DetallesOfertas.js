import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Image } from 'react-native';
import Boton from '../../Components/Boton'
import appFirebase from '../../Services/BasedeDatos/Firebase';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  collection,
  getFirestore,
  query, doc,
  setDoc, getDocs, getDoc,
  deleteDoc
} from 'firebase/firestore';

const db = getFirestore(appFirebase);


export default function DetallesOferta({ navigation, route }) {

  const { oferta } = route.params;

  const [Ofertass, setOfertass] = useState([]);


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
  }, []);


  return (
    <View style={styles.container}>
      <SafeAreaView style={{ backgroundColor: '#fff', flex: 1, width: 390,  }}>

      <View style={styles.containerListaImagen}>
        <Image

          source={{ uri: oferta.Nimagen }}
          style={{ width: '100%', height: '100%', borderRadius: 10 }}
          resizeMode="cover"
        />
      </View>


      <Text style={styles.Titulo}>{oferta.Ntitulo}</Text>

      <View style={styles.containerInformacion}>
        <Text style={styles.TextoInfo}>Características</Text>

        <Text style={styles.TextoDato}>
          <Text style={styles.TextoInfo}>Tipo de café: </Text>
          {oferta.NtipoCafe}
        </Text>

        <Text style={styles.TextoDato}>
          <Text style={styles.TextoInfo}>Variedad: </Text>
          {oferta.Nvariedad}
        </Text>

        <Text style={styles.TextoDato}>
          <Text style={styles.TextoInfo}>Estado del grano: </Text>
          {oferta.NestadoGrano}
        </Text>

        <Text style={styles.TextoDato}>
          <Text style={styles.TextoInfo}>Clima: </Text>
          {oferta.Nclima}
        </Text>

        <Text style={styles.TextoDato}>
          <Text style={styles.TextoInfo}>Altura: </Text>
          {oferta.Naltura}
        </Text>

        <Text style={styles.TextoDato}>
          <Text style={styles.TextoInfo}>Proceso de corte: </Text>
          {oferta.NprocesoCorte
          }
        </Text>

        <Text style={styles.TextoDato}>
          <Text style={styles.TextoInfo}>Fecha de cosecha: </Text>
          {oferta.NfechaCosecha}
        </Text>

        <Text style={styles.TextoDato}>
          <Text style={styles.TextoInfo}>Cantidad de producción: </Text>
          {oferta.NcantidadProduccion}
        </Text>

        <Text style={styles.TextoDato}>
          <Text style={styles.TextoInfo}>Oferta por libra: </Text>
          {oferta.NofertaLibra}

        </Text>


      </View>

      <View style={styles.BotonesContacto}>
        <Boton
          nombreB='Correo'
          ancho='190'
          iconName="mail"
        />
        <Boton
          nombreB='Whatsapp'
          ancho='190'
          ColorBoton="#F8DBD7"
          borderColor="#F8DBD7"
          ColorTexto='#ED6D4A'

        />

      </View>
    </SafeAreaView>
    </View >

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerInformacion: {
    backgroundColor: '#EBEBEB',
    width: 373,
    height: 300,
    borderRadius: 10,
    marginLeft: 10

  },
  TextoInfo: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 10
  },
  containerListaImagen: {
    width: 370,
    height: 140,
    backgroundColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#999',
    marginBottom: 10,
    marginLeft: 10,
    marginTop: 10
  },
  BotonesContacto: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  Titulo: {
    marginLeft: 15,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',

  },
  TextoDato: {
    marginLeft: 10,
    marginTop: 10,
  }

});