import { StyleSheet, Text, View, Alert } from 'react-native';
import InputText from '../../Components/TextInput';
import Boton from '../../Components/Boton';
import { useState } from 'react';
import ComboBox from '../../Components/Picker';
import appFirebase from '../../Services/Firebase';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GuardarMarcador } from '../../Containers/GuardarMarcador';

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

  const [nombrelugar, setNombrelugar] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [horario, setHorario] = useState('');

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['bottom']} style={{ backgroundColor: '#fff', flex: 1, width: 390 }}>
        <Text style={styles.previewTitle}>Vista previa de la ubicación</Text>

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

        <View style={styles.containerCuerpo}>
          <View style={styles.containerInput}>
            <InputText
              NombreLabel='Nombre del lugar'
              Valor={nombrelugar}
              onchangetext={setNombrelugar}
              placeholder='nombre'
            />
            <InputText
              NombreLabel='descripcion'
              Valor={descripcion}
              onchangetext={setDescripcion}
              placeholder='descripcion'
            />

            <InputText
              NombreLabel='Horario'
              Valor={horario}
              onchangetext={setHorario}
              placeholder='Horario'
            />


            <View style={{ width: '100%', paddingLeft: 250 }}>
              <Boton
                nombreB="Crear"
                ancho="100"
                onPress={() => GuardarMarcador (coord, nombrelugar, descripcion, horario, navigation)}
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
  },
  containerBanner: {
    flex: 1,
    backgroundColor: '#ED6D4A',
    justifyContent: 'center',
    alignItems: 'center',


  },
  containerCuerpo: {
    flex: 2.5,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  containerInput: {
  },
  Titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingLeft: 150,
    paddingTop: 10,
    paddingBottom: 10
  },
  label: {

  },
  previewMap: {
    width: 355,
    height: 200,
    marginBottom: 15,
    marginLeft: 20

  },
});