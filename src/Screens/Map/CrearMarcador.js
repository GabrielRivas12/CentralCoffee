import { StyleSheet, Text, View, Alert, ScrollView } from 'react-native';
import InputText from '../../Components/TextInput';
import Boton from '../../Components/Boton';
import { useState } from 'react';
import appFirebase from '../../Services/Firebase';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GuardarMarcador } from '../../Containers/GuardarMarcador';
import { usarTema } from '../../Containers/TemaApp';
import ComboboxPickerDate from '../../Components/PickerDate';

import {
  collection,
  getFirestore,
  query, doc,
  setDoc, getDocs, getDoc, addDoc,
  deleteDoc
} from 'firebase/firestore';

const db = getFirestore(appFirebase);

export default function CrearMarcador({ navigation, route }) {
  const coord = route.params?.coordinate;
  const { modoOscuro } = usarTema();

  const [nombrelugar, setNombrelugar] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [horario, setHorario] = useState('');
  const [horaInicio, setHoraInicio] = useState(new Date());
  const [horaFin, setHoraFin] = useState(new Date());
  const [mostrarHoraInicio, setMostrarHoraInicio] = useState(false);
  const [mostrarHoraFin, setMostrarHoraFin] = useState(false);
  const [textoHoraInicio, setTextoHoraInicio] = useState('');
  const [textoHoraFin, setTextoHoraFin] = useState('');



  return (
   <View style={[styles.container, modoOscuro ? styles.containerOscuro : styles.containerClaro]}>
      <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>

        <View style={styles.mapacontainer}>
          {coord && (

            <MapView
              style={styles.previewMap}
              initialRegion={{
                latitude: coord.latitude,
                longitude: coord.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
              rotateEnabled={false}
              pitchEnabled={false}
            >
              <Marker coordinate={coord} />
            </MapView>
          )}
        </View>

        <View contentContainerStyle={styles.containerInput}>

          <View style={styles.containerInput}>
            <InputText
              NombreLabel='Nombre del lugar'
              Valor={nombrelugar}
              onchangetext={setNombrelugar}
              placeholder='Nombre de la ubicación'
            />
            <InputText
              NombreLabel='Descripcion'
              Valor={descripcion}
              onchangetext={setDescripcion}
              placeholder='Añade una descripcion del lugar'
            />



            <View style={styles.pickerhora}>
              <ComboboxPickerDate
                label="Hora de inicio"
                date={horaInicio}
                mode="time"
                show={mostrarHoraInicio}
                verMode={() => setMostrarHoraInicio(true)}
                text={textoHoraInicio || 'Hora de inicio'}
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || horaInicio;
                  setMostrarHoraInicio(false);
                  setHoraInicio(currentDate);

                  const formatted = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  setTextoHoraInicio(formatted);

                  // Usar el valor actual de formatted y textoHoraFin
                  if (textoHoraFin) {
                    setHorario(`${formatted} - ${textoHoraFin}`);
                  } else {
                    setHorario(formatted);
                  }
                }}
              />

              <ComboboxPickerDate
                label="Hora de fin"
                date={horaFin}
                mode="time"
                show={mostrarHoraFin}
                verMode={() => setMostrarHoraFin(true)}
                text={textoHoraFin || 'Hora de fin'}
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || horaFin;
                  setMostrarHoraFin(false);
                  setHoraFin(currentDate);

                  const formatted = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  setTextoHoraFin(formatted);

                  // Usar el valor actual de formatted y textoHoraInicio
                  if (textoHoraInicio) {
                    setHorario(`${textoHoraInicio} - ${formatted}`);
                  } else {
                    setHorario(formatted);
                  }
                }}
              />
            </View>

            <View style={styles.botoncrear}>
              <Boton
                nombreB="Crear"
                ancho="100"
                onPress={() => GuardarMarcador(coord, nombrelugar, descripcion, horario, navigation)}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
    containerClaro: {
    backgroundColor: '#fff',
  },
  containerOscuro: {
    backgroundColor: '#000',
  },
  containerCuerpo: {
    alignItems: 'center',
    width: '90%',
  },
  containerInput: {
    width: '100%',
    paddingHorizontal: 10,
  },
  previewMap: {
    flex: 1,
  },
  Titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  mapacontainer: {
    width: 355,
    height: 200,
    marginBottom: 30,
    top: 10,
    left: 20,
    borderRadius: 10,
    borderColor: '#000',
    overflow: 'hidden',
    backgroundColor: 'black'
  },
  pickerhora: {
    flexDirection: 'row',
    marginLeft: 5,
    justifyContent: 'space-around',
  },
  botoncrear: {
    marginLeft: 250,
    marginTop: 10
  }
});
