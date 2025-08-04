import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Image } from 'react-native';
import Boton from '../../Components/Boton'
import appFirebase from '../../Services/Firebase';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  collection,
  getFirestore,
  query, doc,
  setDoc, getDocs, getDoc,
  deleteDoc
} from 'firebase/firestore';

const db = getFirestore(appFirebase);


export default function DetallesOferta({ route }) {

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
      <StatusBar backgroundColor='#ED6D4A' barStyle='light-content' />
      <SafeAreaView edges={['bottom']} style={{ backgroundColor: '#fff', flex: 1 }}>

        <View style={styles.containerListaImagen}>
          <Image
            source={{ uri: oferta.Nimagen }}
            style={{ width: '100%', height: '100%', borderRadius: 10 }}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.Titulo}>{oferta.Ntitulo}</Text>

        <View style={styles.containerInformacion}>
          <Text style={styles.TextoTitulo}>Características</Text>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.TextoDato}>
                <Text style={styles.TextoInfo}>Tipo de café: </Text>
                {oferta.NtipoCafe}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.TextoDato}>
                <Text style={styles.TextoInfo}>Variedad: </Text>
                {oferta.Nvariedad}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.TextoDato}>
                <Text style={styles.TextoInfo}>Estado del grano: </Text>
                {oferta.NestadoGrano}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.TextoDato}>
                <Text style={styles.TextoInfo}>Clima: </Text>
                {oferta.Nclima}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.TextoDato}>
                <Text style={styles.TextoInfo}>Altura: </Text>
                {oferta.Naltura}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.TextoDato}>
                <Text style={styles.TextoInfo}>Proceso de corte: </Text>
                {oferta.NprocesoCorte}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.TextoDato}>
                <Text style={styles.TextoInfo}>Fecha de cosecha: </Text>
                {oferta.NfechaCosecha}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.TextoDato}>
                <Text style={styles.TextoInfo}>Cantidad de producción: </Text>
                {oferta.NcantidadProduccion}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.TextoDato}>
                <Text style={styles.TextoInfo}>Oferta por libra: </Text>
                {oferta.NofertaLibra}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.BotonesContacto}>
          <Boton
            nombreB='Correo'
            ancho='180'
            iconName="mail"
          />
          <Boton
            nombreB='Whatsapp'
            ancho='180'
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
    marginTop: 10,
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
});