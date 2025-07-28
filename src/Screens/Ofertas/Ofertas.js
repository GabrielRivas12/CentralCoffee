import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView } from 'react-native';
import Boton from '../../Components/Boton'
import InputText from '../../Components/TextInput';
import OfertasCard from '../../Containers/OfertasCard';
import appFirebase from '../../Services/BasedeDatos/Firebase';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Octicons from '@expo/vector-icons/Octicons';
import Feather from '@expo/vector-icons/Feather';


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




  return (
    <View style={styles.container}>
      <SafeAreaView edges={['bottom']}  style={{ backgroundColor: '#fff', flex: 1, width: 390, alignItems: 'center' }}>


        <View style={styles.containerBusqueda}>
          <InputText

            Valor=''
            onchangetext=''
            placeholder='Buscar'
            ancho='370'
          />
        </View>

        <ScrollView >


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

       
      </SafeAreaView>
    </View>





  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerLista: {
    width: 350,
    height: 230,
    backgroundColor: '#EBEBEB',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EBEBEB'

  },
  containerListaB: {
    marginLeft: 250,
    marginTop: 180,
    position: 'absolute'
  },
  containerListaImagen: {
    width: 330,
    height: 140,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#999',
    marginBottom: 1
  },
  Titulo: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tituloContainer: {
    width: '90%',
    alignItems: 'flex-start',
    marginTop: 5
  },
  precio: {
    fontSize: 12
  },

  botoncrear: {
    marginBottom: 50,
    position: 'absolute',
    bottom: 20,
    right: 10,
    borderRadius: 50,
    backgroundColor: 'transparent',
  },
  botoneditar: {
    marginBottom: 50,
    position: 'absolute',
    bottom: 60,
    right: 10,
    borderRadius: 50,
    backgroundColor: 'transparent',
  },
  containerBusqueda: {
    alignItems: 'center',
    bottom: 10,
    height: 70
  }

});