import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView } from 'react-native';
import Boton from '../../Components/Boton'
import InputText from '../../Components/TextInput';
import OfertasCard from '../../Containers/OfertasCard';
import appFirebase from '../../Services/BasedeDatos/Firebase';

import {
    collection,
    getFirestore,
    query, doc,
    setDoc, getDocs, getDoc,
    deleteDoc
} from 'firebase/firestore';

const db = getFirestore(appFirebase);


export default function Ofertas({ navigation }) {

      const [Ofertass, setOfertass] = useState([]);


        const LeerDatos = async () => {
        const q = query(collection(db, "oferta"));
        const querySnapshot = await getDocs(q);
        const d = [];
        querySnapshot.forEach((doc) => {
            const datosBD = doc.data();
            d.push(
              {
                Ntitulo : datosBD.Ntitulo,
                Nprecio: datosBD.NofertaLibra,

              }
            );
        });
        setOfertass(d);
    }

    useEffect(() => {
        LeerDatos();
    }, []);


  return (
    <View style={styles.container}>

      <InputText

        Valor=''
        onchangetext=''
        placeholder='Buscar'
      />
      <ScrollView>

{Ofertass.map((item, index) => (
  <OfertasCard
    key={index}
    titulo={item.Ntitulo}
    precio={`Precio: C$${item.Nprecio} por libra`}
    navigation={navigation}
  />
))}

      </ScrollView>

    <View style={styles.botoncrear}>   
      <Boton
        nombreB='Crear'
        onPress={() => navigation.navigate('Crear')}
      />
      </View>


    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
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

  botoncrear:{
    marginBottom: 50
  }

});