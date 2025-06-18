import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import Boton from '../../Components/Boton'
import InputText from '../../Components/TextInput';
import appFirebase from '../../Services/BasedeDatos/Firebase';
import LeerDatos from './Ofertas';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  collection,
  getFirestore,
  query, doc,
  setDoc, getDocs, getDoc,
  deleteDoc, addDoc
} from 'firebase/firestore';


export default function CrearOferta({ navigation, route }) {

  const db = getFirestore(appFirebase);

  const guardarNuevo = async (nuevo) => {
    await addDoc(collection(db, 'oferta'), nuevo);
  }




  const [Titulo, setTitulo] = useState('');
  const [TipoCafe, setTipoCafe] = useState('');
  const [Variedad, setVariedad] = useState('');
  const [EstadoGrano, setEstadoGrano] = useState('');
  const [Clima, setClima] = useState('');
  const [Altura, setAltura] = useState('');
  const [ProcesoCorte, setProcesoCorte] = useState('');
  const [FechaCosecha, setFechaCosecha] = useState('');
  const [CantidadProduccion, setCantidadProduccion] = useState('');
  const [OfertaLibra, setOfertaLibra] = useState('');

  const guardar = () => {
    if (!Titulo || !TipoCafe || !Variedad || !EstadoGrano || !Clima || !Altura || !ProcesoCorte || !FechaCosecha || !CantidadProduccion || !OfertaLibra) return null;
    const nuevaOferta = {
      Ntitulo: Titulo,
      NtipoCafe: TipoCafe,
      Nvariedad: Variedad,
      NestadoGrano: EstadoGrano,
      Nclima: Clima,
      Naltura: Altura,
      NprocesoCorte: ProcesoCorte,
      NfechaCosecha: FechaCosecha,
      NcantidadProduccion: CantidadProduccion,
      NofertaLibra: OfertaLibra,
    }

    guardarNuevo(nuevaOferta);
    Alert.alert('Datos almacenados', `
    Titulo: ${Titulo}
    Tipo de café: ${TipoCafe}
    Variedad: ${Variedad}
    Estado del grano: ${EstadoGrano}
    Clima: ${Clima}
    Altura: ${Altura}
    Proceso de corte: ${ProcesoCorte}
    Fecha de cosecha: ${FechaCosecha}
    Cantidad de produccion: ${CantidadProduccion}
    Oferta por libra: ${OfertaLibra}`
      , [
        {
          text: 'Aceptar',
          onPress: () => {
            if (route.params?.onGoBack) {
              route.params.onGoBack(); // llamo para que recargue la lista
            }
            navigation.goBack();
          }
        }
      ]

    );




    setTitulo('');
    setTipoCafe('');
    setVariedad('');
    setEstadoGrano('');
    setClima('');
    setAltura('');
    setProcesoCorte('');
    setFechaCosecha('');
    setCantidadProduccion('');
    setOfertaLibra('');

  }

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1 }}>
      <ScrollView style={styles.scrol}>


        <View style={styles.containerImagen}>


        </View>


        <View style={styles.formContainer}>

          <InputText
            NombreLabel='Titulo'
            Valor={Titulo}
            onchangetext={setTitulo}
            placeholder='Ingrese el título de la oferta'
          />

          <InputText
            NombreLabel='Tipo de café'
            Valor={TipoCafe}
            onchangetext={setTipoCafe}
            placeholder='Ingrese el tipo de café'
          />

          <InputText
            NombreLabel='Variedad'
            Valor={Variedad}
            onchangetext={setVariedad}
            placeholder='Ingrese la variedad'
          />

          <InputText
            NombreLabel='Estado del grano'
            Valor={EstadoGrano}
            onchangetext={setEstadoGrano}
            placeholder='Ingrese el estado del grano'
          />

          <InputText
            NombreLabel='Clima'
            Valor={Clima}
            onchangetext={setClima}
            placeholder='Ingrese el clima'
          />

          <InputText
            NombreLabel='Altura'
            Valor={Altura}
            onchangetext={setAltura}
            placeholder='Ingrese la altura'
          />

          <InputText
            NombreLabel='Proceso de corte'
            Valor={ProcesoCorte}
            onchangetext={setProcesoCorte}
            placeholder='Ingrese el proceso de corte'
          />

          <InputText
            NombreLabel='Fecha de cosecha'
            Valor={FechaCosecha}
            onchangetext={setFechaCosecha}
            placeholder='Ingrese la fecha de cosecha'
          />

          <InputText
            NombreLabel='Cantidad de produccion'
            Valor={CantidadProduccion}
            onchangetext={setCantidadProduccion}
            placeholder='Ingrese la cantidad de producción'
          />

          <InputText
            NombreLabel='Oferta por libra'
            Valor={OfertaLibra}
            onchangetext={setOfertaLibra}
            placeholder='Ingrese la oferta por libra'
          />
        </View>
     
     
      <Boton
        nombreB='Publicar'
        onPress={guardar}
      />

 </ScrollView>
 </SafeAreaView>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  containerImagen: {
    width: 350,
    height: 150,
    backgroundColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginTop: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#999'

  },
  formContainer: {
    alignItems: 'center',
    width: '100%',
    paddingVertical: 20,
  },
  scrol: {
  },
containerbb: {
}


});
