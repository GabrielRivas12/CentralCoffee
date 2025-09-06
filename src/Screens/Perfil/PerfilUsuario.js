import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import Boton from '../../Components/Boton';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usarTema } from '../../Containers/TemaApp';

import { getAuth } from 'firebase/auth';
import {
  collection,
  getFirestore,
  query, doc,
  setDoc, getDocs, getDoc,
  deleteDoc, updateDoc, where
} from 'firebase/firestore';


import appFirebase from '../../Services/Firebase';

import OfertasCard from '../../Components/OfertasCard';



const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

export default function PerfilUsuario({ navigation, route }) {
  const oferta = route?.params?.oferta;



  const { modoOscuro, alternarTema } = usarTema();
  const [user, setUser] = useState(null);

  const [Ofertass, setOfertass] = useState([]);

  const [usuarioData, setUsuarioData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [usuarioMostrado, setUsuarioMostrado] = useState(null);


  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        LeerDatos();
      } else {
        setOfertass([]);
      }
    }, [user])
  );

  const LeerDatos = async () => {
    const q = query(
      collection(db, "oferta"),
      where("userId", "==", user.uid)
    );
    const querySnapshot = await getDocs(q);
    const d = [];
    querySnapshot.forEach((doc) => {
      d.push({ id: doc.id, ...doc.data() });
    });
    setOfertass(d);
  };

  useEffect(() => {
    async function cargarDatosUsuario() {
      try {
        const usuarioParam = route?.params?.usuario;

        if (usuarioParam) {
          setUsuarioData(usuarioParam);
          setUser({ uid: usuarioParam.uid });
        } else {
          const auth = getAuth(appFirebase);
          const user = auth.currentUser;

          if (user) {
            setUser(user);
            const docRef = doc(db, 'usuarios', user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              setUsuarioData(docSnap.data());
            } else {
              console.log('No se encontró el usuario en Firestore');
            }
          } else {
            console.log('No hay usuario logueado');
          }
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
      } finally {
        setCargando(false);
      }
    }

    cargarDatosUsuario();
  }, [route?.params?.usuario]);



  if (cargando) {
    return (
      <SafeAreaView style={[styles.contenedor, modoOscuro ? styles.contenedorOscuro : styles.contenedorClaro, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={modoOscuro ? '#fff' : '#000'} />
      </SafeAreaView>
    );
  }

  if (!usuarioData) {
    return (
      <SafeAreaView style={[styles.contenedor, modoOscuro ? styles.contenedorOscuro : styles.contenedorClaro, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[styles.textoNombre, modoOscuro && styles.textoOscuro]}>No se encontraron datos del usuario</Text>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
      <ScrollView style={[modoOscuro ? styles.contenedorOscuro : styles.contenedorClaro]}>

        {/* Imagen de portada */}
        <View>
          <Image
            source={{ uri: usuarioData.fotoPortada }}

            style={styles.imagenPortada}
          />
        </View>

        {/* Imagen de perfil */}
        <View style={styles.contenedorImagenPerfil}>
          <Image
            source={{ uri: usuarioData.fotoPerfil }}
            style={styles.imagenPerfil}
          />
        </View>

        <Text style={[styles.textoNombre, modoOscuro && styles.textoOscuro]}>{usuarioData.nombre}</Text>
        <Text style={[styles.textoRol, modoOscuro && styles.textoOscuro]}>{usuarioData.rol}</Text>

        <View style={styles.botonEM}>
          {auth.currentUser?.uid !== usuarioData?.uid && (
            <Boton
              nombreB="Mensaje"
              alto={30}
              ancho={90}
              onPress={() => {
                navigation.navigate('Chat', {
                  otroUsuarioId: usuarioData.uid,
                });
              }}
            />
          )}


          {auth.currentUser?.uid === usuarioData?.uid && (
            <Boton
              nombreB="Editar perfil"
              alto={30}
              ancho={90}
              onPress={() => {
                navigation.navigate('Editar Informacion');
              }}
            />
          )}

        </View>


        <View style={[styles.separador, modoOscuro && { backgroundColor: '#555' }]} />

        {/* Sobre mí */}
        <Text style={[styles.tituloSobreMi, modoOscuro && styles.textoOscuro]}>Sobre mí</Text>
        <View style={[styles.cajaDescripcion, modoOscuro && { backgroundColor: '#333' }]}>
          <Text style={[styles.textoDescripcion, modoOscuro && styles.textoOscuro]}>
            {usuarioData.descripcion || ''}
          </Text>
        </View>


        {/* Ubicación */}
        <View style={styles.cajaUbicacion}>
          <Text style={[styles.textoUbicacion, modoOscuro && styles.textoOscuro]}>
            📍 {usuarioData.ubicacion || 'No especificado'}
          </Text>
        </View>





        <Text style={[styles.textoOferta, modoOscuro && styles.textoOscuro]}> Mis Ofertas</Text>

        {Ofertass.map((item, index) => (
          <OfertasCard
            key={index}
            ImagenOferta={item.imagen}
            oferta={item}
            titulo={item.titulo}
            precio={`Precio: C$${item.ofertaLibra} por libra`}
            navigation={navigation}
            modoOscuro={modoOscuro}
          />
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    paddingHorizontal: 5,
    paddingTop: 20,
    paddingBottom: 20,
  },
  contenedorClaro: {
    backgroundColor: '#fff',
  },
  contenedorOscuro: {
    backgroundColor: '#000',
  },
  textoOscuro: {
    color: '#fff',
  },
  imagenPortada: {
    width: '96%',
    height: 110,
    borderRadius: 10,
    backgroundColor: '#999',
    marginTop: 5,
    marginLeft: 7.5
  },
  contenedorImagenPerfil: {
    marginTop: -35, // superpone un poco sobre la portada
    marginLeft: 15,
  },
  imagenPerfil: {
    width: 80,
    height: 80,
    borderRadius: 100,
    borderColor: '#fff',
    borderWidth: 3,
    backgroundColor: '#999',
  },
  encabezadoPerfil: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textoNombre: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 60,
    marginLeft: 10,
    marginTop: 5
  },
  textoRol: {
    fontSize: 12,
    marginBottom: 50,
    marginVertical: -60,
    marginLeft: 10
  },
  separador: {
    height: 2,
    width: '95%',
    backgroundColor: '#ccc',
    marginLeft: 10,
    marginTop: 35
  },
  tituloSobreMi: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 6,
    marginLeft: 10
  },
  cajaDescripcion: {
    backgroundColor: '#ccc',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    width: '95%',
    marginLeft: 10
  },
  textoDescripcion: {
    fontSize: 14,
    color: '#333',
  },
  cajaUbicacion: {
    marginTop: 6,
    marginBottom: 10,
  },
  textoUbicacion: {
    fontSize: 16,
    color: '#555',
    marginLeft: 5
  },
  seccionBotones: {
    marginTop: 20,
    alignItems: 'center',
  },
  textoOferta: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  botonEM: {
    marginTop: -95,
    marginLeft: 270
  },
});
