import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Platform, StatusBar } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import appFirebase from '../../Services/Firebase';
import { useRoute } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { collection, getFirestore, query, getDocs, where } from 'firebase/firestore';

import { Guardar } from '../../Containers/GuardarOferta';
import { SubirImagenASupabase } from '../../Containers/SubirImagen';
import { SeleccionarFecha, verMode } from '../../Containers/SeleccionarFecha';
import { SeleccionarImagen } from '../../Containers/SeleccionarImagen';

import Boton from '../../Components/Boton';
import InputText from '../../Components/TextInput';
import ComboboxPickerDate from '../../Components/PickerDate';
import ComboBox from '../../Components/Picker';

const auth = getAuth(appFirebase);

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

  const [lugares, setLugares] = useState([]);
  const [lugarSeleccionado, setLugarSeleccionado] = useState('');

  const GuardarOferta = () => {
    Guardar({
      Titulo, TipoCafe, Variedad, EstadoGrano, Clima, Altura,
      ProcesoCorte, FechaCosecha, CantidadProduccion, OfertaLibra,
      imagen, ofertaEditar, auth, db, navigation,
      SubirImagenASupabase, Estado, setEstado, lugarSeleccionado
    });
  };

  const PickImage = async () => {
    const uri = await SeleccionarImagen();
    if (uri) {
      SetImagen(uri);
    }
  };

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

  useEffect(() => {
    const obtenerLugares = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const lugaresRef = collection(db, 'lugares');
        const q = query(lugaresRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);

        const lugaresObtenidos = querySnapshot.docs.map(doc => ({
          label: `${doc.data().nombre} (${doc.data().horario})`,
          value: doc.id
        }));

        setLugares(lugaresObtenidos);
      } catch (error) {
        console.error('Error obteniendo lugares:', error);
      }
    };

    obtenerLugares();
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.containerImagen}>
            <TouchableOpacity onPress={PickImage} style={{ width: '100%', height: '100%' }}>
              {imagen ? (
                <Image source={{ uri: imagen }} style={{ width: '100%', height: '100%', borderRadius: 5 }} />
              ) : (
                <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Text style={{ color: '#fff' }}>Seleccionar imagen</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.encabezado}>
            <InputText
              NombreLabel='Titulo'
              Valor={Titulo}
              onchangetext={setTitulo}
              placeholder='Ingrese el título de la oferta'
              maxCaracteres={50}
            />
            <Text style={styles.Titulo}>Características</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.formContainerInputTipo}>
              <InputText
                ancho='165'

                NombreLabel='Tipo de café'
                Valor={TipoCafe}
                onchangetext={setTipoCafe}
                placeholder='Ingrese el tipo de café'
              />
              <InputText
                ancho='160'
                marginRight='20'
                NombreLabel='Variedad'
                Valor={Variedad}
                onchangetext={setVariedad}
                placeholder='Ingrese la variedad'
              />
            </View>

            <View style={styles.formContainerInputTipo}>
              <InputText
                ancho='165'
                NombreLabel='Estado del grano'
                Valor={EstadoGrano}
                onchangetext={setEstadoGrano}
                placeholder='Ingrese el estado'
              />
              <InputText
                ancho='160'
                NombreLabel='Clima'
                Valor={Clima}
                onchangetext={setClima}
                placeholder='Ingrese el clima'
              />
            </View>

            <View style={styles.formContainerInputTipo}>
              <InputText
                ancho='165'
                NombreLabel='Altura'
                Valor={Altura}
                onchangetext={setAltura}
                placeholder='Ingrese la altura'
              />
              <InputText
                ancho='160'
                NombreLabel='Proceso de corte'
                Valor={ProcesoCorte}
                onchangetext={setProcesoCorte}
                placeholder='Ingrese el proceso'
              />
            </View>


            <View style={styles.formp}>
              <ComboboxPickerDate
                date={date}
                show={show}
                mode={mode}
                text={text}
                verMode={() => verMode('date', setShow, setMode)}
                onChange={SeleccionarFecha(setShow, setDate, setText, setFechaCosecha)}
              />



            </View >

          



            <View style={styles.formOfertalibra}>
              <InputText
                ancho='166'
                NombreLabel='Oferta por libra'
                Valor={OfertaLibra}
                onchangetext={setOfertaLibra}
                placeholder='Ingrese la oferta por libra'
              />
               <InputText
                ancho='165'
                NombreLabel='Cantidad de p'
                Valor={CantidadProduccion}
                onchangetext={setCantidadProduccion}
                placeholder='Ingrese la cantidad'
              />

            </View>

            <View style={styles.panelopciones}>
              <ComboBox
                NombrePicker="Lugar de entrega"
                value={lugarSeleccionado}
                onValuechange={(itemValue) => setLugarSeleccionado(itemValue)}
                items={lugares}
              />
              <Boton nombreB='Publicar' onPress={GuardarOferta} />
            </View>


          </View>
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
    marginLeft: '4.5%',
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#999'
  },
  formContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  formContainerInputTipo: {
    flexDirection: 'row',
  },
  formOfertalibra: {
    alignSelf: 'flex-start',
    top: '1%',
    left: '2%'
  },
  encabezado: {
    top: 8,
    left: '2%',
  },
  Titulo: {
    left: 10,
    fontWeight: 'bold',
    fontSize: 18
  },
  panelopciones: {
    top: '1%'

  },
  formp: {
    position: 'absolute',
    top: '50.5%',
    left: '53%'

  },
});
