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

        <View style={styles.containerCuerpo}>
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

            <InputText
              NombreLabel='Horario'
              Valor={horario}
              onchangetext={setHorario}
              placeholder='Establece un horario'
            />


            <View style={{ width: '100%', left: 145 }}>
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
  containerCuerpo: {
    flex: 2.5,
    alignItems: 'center',
    width: '90%',
  },
  containerInput: {
    width: '100%',
    paddingHorizontal: 10,
    gap: 10,
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
  }
});
