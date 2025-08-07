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
        const auth = getAuth(appFirebase);
        const user = auth.currentUser;

        if (user) {
          setUser(user);  // <- aquí actualizas el estado user
          const db = getFirestore(appFirebase);
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
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
      } finally {
        setCargando(false);
      }
    }

    cargarDatosUsuario();
  }, []);


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
      <ScrollView contentContainerStyle={[styles.contenedor, modoOscuro ? styles.contenedorOscuro : styles.contenedorClaro]}>

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

        <View style={styles.encabezadoPerfil}>
          <Text style={[styles.textoNombre, modoOscuro && styles.textoOscuro]}>
            {usuarioData.nombre}
          </Text>

          <View style={styles.botonesAccion}>
            {user?.uid !== usuarioData.uid && (
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

            {user?.uid === usuarioData.uid && (
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

        </View>


        <Text style={[styles.textoRol, modoOscuro && styles.textoOscuro]}>{usuarioData.rol} </Text>

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





        <Text style={[styles.textoNombre, modoOscuro && styles.textoOscuro]}> Mis Ofertas</Text>

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

        {/* Botones inferiores */}
        <View style={styles.seccionBotones}>
          <Boton
            nombreB={modoOscuro ? 'Tema Claro' : 'Tema Oscuro'}
            onPress={alternarTema}
            backgroundColor={modoOscuro ? '#888' : '#ddd'}
            textColor={modoOscuro ? '#fff' : '#000'}
          />
        </View>


      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    paddingHorizontal: 5,
    paddingTop: 5,
    paddingBottom: 20, // para dejar espacio al final
  },
  contenedorClaro: {
    backgroundColor: '#fff',
  },
  contenedorOscuro: {
    backgroundColor: '#111',
  },
  imagenPortada: {
    width: '100%',
    height: 110,
    borderRadius: 10,
    backgroundColor: '#999',
  },
  contenedorImagenPerfil: {
    position: 'absolute',
    top: 90,
    left: 10,
    zIndex: 10,
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
    marginTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  textoNombre: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 10
  },
  textoRol: {
    fontSize: 12,
    marginLeft: 16,
    position: 'absolute',
    top: 205
  },
  separador: {
    height: 2,
    width: '100%',
    backgroundColor: '#ccc',
    marginVertical: 12,
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
    marginTop: 'auto',
    paddingBottom: 40,
    gap: 12,
    paddingHorizontal: 20,
  },
  seccionInferior: {
    marginTop: 10,
  },
  textoOscuro: {
    color: '#fff',
  },
  botonesAccion: {
    flexDirection: 'row',
    alignItems: 'center',
    bottom: '50',
    right: 2
  }

});
