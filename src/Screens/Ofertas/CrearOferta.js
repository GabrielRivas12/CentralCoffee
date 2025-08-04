import { View, Text, StyleSheet, ScrollView, Alert, Platform, StatusBar } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import appFirebase from '../../Services/Firebase';
import { useRoute } from '@react-navigation/native';
import { useEffect } from 'react';
import { getAuth } from 'firebase/auth';

import OfertaFormulario from '../../Components/OfertaFormulario';

import { Guardar } from '../../Containers/GuardarOferta';
import { SubirImagenASupabase } from '../../Containers/SubirImagen';
import { SeleccionarFecha, verMode } from '../../Containers/SeleccionarFecha';
import { SeleccionarImagen } from '../../Containers/SeleccionarImagen';


const auth = getAuth(appFirebase);
import {
  collection,
  getFirestore,
  query, doc,
  setDoc, getDocs, getDoc,
  deleteDoc, addDoc
} from 'firebase/firestore';

export default function CrearOferta({ navigation }) {

  const route = useRoute();
  const ofertaEditar = route.params?.oferta || null;

  const db = getFirestore(appFirebase);

  const [imagen, SetImagen] = useState('');
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
  const [Estado, setEstado] = useState('Activo');

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('date');
  const [text, setText] = useState('Ingrese la fecha');

    const GuardarOferta = () => {
    Guardar({
      Titulo, TipoCafe, Variedad, EstadoGrano, Clima, Altura,
      ProcesoCorte, FechaCosecha, CantidadProduccion, OfertaLibra,
      imagen, ofertaEditar, auth, db, navigation,
      SubirImagenASupabase, Estado, setEstado
    });
  };


  const PickImage = async () => {
  const uri = await SeleccionarImagen();
  if (uri) {
    SetImagen(uri);
  }
}

 useEffect(() => {
  if (ofertaEditar) {
    setTitulo(ofertaEditar.Titulo || '');
    setTipoCafe(ofertaEditar.TipoCafe || '');
    setVariedad(ofertaEditar.Variedad || '');
    setEstadoGrano(ofertaEditar.EstadoGrano || '');
    setClima(ofertaEditar.Clima || '');
    setAltura(ofertaEditar.Altura || '');
    setProcesoCorte(ofertaEditar.ProcesoCorte || '');
    setFechaCosecha(ofertaEditar.FechaCosecha || '');
    setText(ofertaEditar.FechaCosecha || 'Ingrese la fecha');
    setCantidadProduccion(ofertaEditar.CantidadProduccion || '');
    setOfertaLibra(ofertaEditar.OfertaLibra || '');
    SetImagen(ofertaEditar.Imagen || '');
  }
}, [ofertaEditar]);


  return (
    <View style={styles.container}>
      <StatusBar backgroundColor='#ED6D4A' barStyle='light-content' />
      <SafeAreaView edges={['bottom, top']} style={{ flex: 1 }}>
        <OfertaFormulario
          imagen={imagen}
          onPickImage={PickImage}
          Titulo={Titulo} setTitulo={setTitulo}
          TipoCafe={TipoCafe} setTipoCafe={setTipoCafe}
          Variedad={Variedad} setVariedad={setVariedad}
          EstadoGrano={EstadoGrano} setEstadoGrano={setEstadoGrano}
          Clima={Clima} setClima={setClima}
          Altura={Altura} setAltura={setAltura}
          ProcesoCorte={ProcesoCorte} setProcesoCorte={setProcesoCorte}
          FechaCosecha={FechaCosecha} setFechaCosecha={setFechaCosecha}
          CantidadProduccion={CantidadProduccion} setCantidadProduccion={setCantidadProduccion}
          OfertaLibra={OfertaLibra} setOfertaLibra={setOfertaLibra}
          onSubmit={GuardarOferta}
          date={date}
          show={show}
          mode={mode}
          text={text}
          verMode={() => verMode('date', setShow, setMode)}
          onChange={SeleccionarFecha(setShow, setDate, setText, setFechaCosecha)}

        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});