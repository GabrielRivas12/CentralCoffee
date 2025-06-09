import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import Boton from '../../Components/Boton'
import InputText from '../../Components/TextInput';
import appFirebase from '../../Services/BasedeDatos/Firebase';

import {
    collection,
    getFirestore,
    query, doc,
    setDoc, getDocs, getDoc,
    deleteDoc
} from 'firebase/firestore';


export default function CrearOferta({ navigation }) {
 
  const db = getFirestore(appFirebase);

   const guardarNuevo = async (nuevo) => {
        await setDoc(doc(db, 'oferta', nuevo.Ntitulo), nuevo);
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
      ,[
        {
          text: 'Aceptar',
          onPress: () => navigation.navigate('Ofertas')
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
      <ScrollView style={styles.scrol}>

        <View style={styles.containerImagen}>


        </View>


        <View style={styles.formContainer}>

          <InputText
            NombreLabel='Titulo'
            Valor={Titulo}
            onchangetext={setTitulo}
            placeholder='nombre'
          />

          <InputText
            NombreLabel='Tipo de café'
            Valor={TipoCafe}
            onchangetext={setTipoCafe}
            placeholder='nombre'
          />

          <InputText
            NombreLabel='Variedad'
            Valor={Variedad}
            onchangetext={setVariedad}
            placeholder='nombre'
          />

          <InputText
            NombreLabel='Estado del grano'
            Valor={EstadoGrano}
            onchangetext={setEstadoGrano}
            placeholder='nombre'
          />

          <InputText
            NombreLabel='Clima'
            Valor={Clima}
            onchangetext={setClima}
            placeholder='nombre'
          />

          <InputText
            NombreLabel='Altura'
            Valor={Altura}
            onchangetext={setAltura}
            placeholder='nombre'
          />

          <InputText
            NombreLabel='Proceso de corte'
            Valor={ProcesoCorte}
            onchangetext={setProcesoCorte}
            placeholder='nombre'
          />

          <InputText
            NombreLabel='Fecha de cosecha'
            Valor={FechaCosecha}
            onchangetext={setFechaCosecha}
            placeholder='nombre'
          />

          <InputText
            NombreLabel='Cantidad de produccion'
            Valor={CantidadProduccion}
            onchangetext={setCantidadProduccion}
            placeholder='nombre'
          />

          <InputText
            NombreLabel='Oferta por libra'
            Valor={OfertaLibra}
            onchangetext={setOfertaLibra}
            placeholder='nombre'
          />

          <Boton
            nombreB='Publicar'
            onPress={guardar}
          />
        </View>

      </ScrollView>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white'
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
  }

});
