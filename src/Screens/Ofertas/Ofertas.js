import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView } from 'react-native';
import Boton from '../../Components/Boton'
import InputText from '../../Components/TextInput';
import OfertasCard from '../../Containers/OfertasCard';
import appFirebase from '../../Services/BasedeDatos/Firebase';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Octicons from '@expo/vector-icons/Octicons';


import {
  collection,
  getFirestore,
  query, doc,
  setDoc, getDocs, getDoc,
  deleteDoc
} from 'firebase/firestore';

const db = getFirestore(appFirebase);


export default function Ofertas({ navigation }) {

  useFocusEffect(
    React.useCallback(() => {
      LeerDatos();
    }, [])
  );

  const [Ofertass, setOfertass] = useState([]);
  const [valorBusqueda, setValorBusqueda] = useState('');


 const LeerDatos = async () => {
  const q = query(collection(db, "oferta"));
  const querySnapshot = await getDocs(q);
  const d = [];
  querySnapshot.forEach((doc) => {
    const datosBD = doc.data();
    if (datosBD.estado === 'Activo') {
      d.push(datosBD);
    }
  });
  setOfertass(d);
}

  const buscarOferta = async (valorbuscado) => {
    if (!valorbuscado || valorbuscado.trim() === '') return;

    const q = query(collection(db, "oferta"));
    const querySnapshot = await getDocs(q);
    const resultados = [];

    const textoBuscado = valorbuscado.toLowerCase();

    querySnapshot.forEach((doc) => {
      const ofertaEncontrado = doc.data();

      if (
        ofertaEncontrado.Ntitulo &&
        ofertaEncontrado.Ntitulo.toLowerCase().includes(textoBuscado)

      ) {
        resultados.push(ofertaEncontrado);
      }
    });

    setOfertass(resultados);

  };



  return (
    <View style={styles.container}>
      <StatusBar backgroundColor='#ED6D4A' barStyle='light-content' />
      <SafeAreaView edges={['bottom']} style={{ backgroundColor: '#fff', flex: 1, alignItems: 'center' }}>


        <View style={styles.containerBusqueda}>
          <InputText

            Valor={valorBusqueda}
            onchangetext={async (texto) => {
              setValorBusqueda(texto);
              if (texto.trim() !== '') {
                await buscarOferta(texto);

              } else {
                LeerDatos();
              }
            }}
            placeholder='Buscar'
            ancho='370'
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}  >


          {Ofertass.map((item, index) => (
            <OfertasCard
              key={index}
              ImagenOferta={item.Nimagen}
              oferta={item}
              titulo={item.Ntitulo}
              precio={`Precio: C$${item.NofertaLibra} por libra`}
              navigation={navigation}
            />
          ))}

        </ScrollView>
        <View style={styles.botoncrear}>
          <Boton
            onPress={() => navigation.navigate('Crear')}
            alto={60}
            ancho={60}
            borderRadius={40}
            marginRight={0} />
          <Octicons name="pencil" size={24} color="white" position='absolute' top={20} left={20} />
        </View>

        <View style={styles.botonbuscar}>
          <Boton
            onPress={buscarOferta}
            ColorBoton='transparent'
            borderColor= 'transparent'
            alto={50}
            ancho={50}
            borderRadius={5}
            marginRight={0} />
          <Octicons name="search" size={24} color="#666" position='absolute' top={16} left={15} />
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
  botoncrear: {
    flex: 1,
    position: 'absolute',
    bottom: 20,
    right: 10,
    backgroundColor: 'transparent',
  },
  containerBusqueda: {
    alignItems: 'center',
    bottom: 10,
    height: 70
  },
  botonbuscar: {
    marginBottom: 50,
    position: 'absolute',
    top: 9,
    right: 12,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  }

});