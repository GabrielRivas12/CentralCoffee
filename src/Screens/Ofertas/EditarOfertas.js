import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import appFirebase from '../../Services/BasedeDatos/Firebase';
import { useFocusEffect } from '@react-navigation/native';
import OfertasCard from '../../Containers/OfertasCard';
import Feather from '@expo/vector-icons/Feather';
import { supabase } from '../../Services/BasedeDatos/SupaBase';

import { getAuth } from 'firebase/auth';

const auth = getAuth(appFirebase);
const user = auth.currentUser;
import {
    collection,
    getFirestore,
    query, doc,
    setDoc, getDocs, getDoc,
    deleteDoc, updateDoc, where
} from 'firebase/firestore';

const db = getFirestore(appFirebase);

export default function EditarOfertas({ navigation }) {

    useFocusEffect(
        React.useCallback(() => {
            LeerDatos();
        }, [])
    );

    const [Ofertass, setOfertass] = useState([]);

    const LeerDatos = async () => {
  if (!user) {
    // No hay usuario logueado, puedes manejarlo como quieras
    setOfertass([]);
    return;
  }

  const q = query(
    collection(db, "oferta"),
    where("userId", "==", user.uid)  // Solo las ofertas del usuario actual
  );

  const querySnapshot = await getDocs(q);
  const d = [];
  querySnapshot.forEach((doc) => {
    const datosBD = doc.data();
    d.push({ id: doc.id, ...datosBD });
  });
  setOfertass(d);
};

    const eliminarOferta = async (id) => {
    Alert.alert(
        'Confirmar eliminación',
        '¿Estás seguro de que deseas eliminar el registro?',
        [
            {
                text: 'Cancelar',
                style: 'cancel',
            },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: async () => {
                    try {
                        // 1. Obtener datos del documento para acceder a la URL de la imagen
                        const docRef = doc(db, "oferta", id);
                        const ofertaSnap = await getDoc(docRef);
                        const ofertaData = ofertaSnap.data();

                        if (ofertaData?.Nimagen) {
                            const imageUrl = ofertaData.Nimagen;

                            // Suponiendo que es una URL pública tipo:
                            // https://<tu-proyecto>.supabase.co/storage/v1/object/public/file/nombre.jpg

                            // 2. Extraer ruta relativa al bucket
                            const pathStart = imageUrl.indexOf('/file/') + 6; // 6 para saltar "/file/"
                            const filePath = imageUrl.substring(pathStart).split('?')[0]; // Elimina query params

                            // 3. Eliminar del bucket "file"
                            const { error } = await supabase
                                .storage
                                .from('file')
                                .remove([filePath]);

                            if (error) {
                                console.error('Error al eliminar imagen de Supabase:', error.message);
                            }
                        }

                        // 4. Eliminar el documento en Firestore
                        await deleteDoc(docRef);
                        await LeerDatos();
                    } catch (error) {
                        console.error('Error al eliminar la oferta:', error.message);
                        Alert.alert('Error', 'No se pudo eliminar la oferta correctamente.');
                    }
                }
            },
        ],
        { cancelable: true }
    );
};

    const verificarOferta = (oferta) => {
        if (!oferta?.id) {
            Alert.alert('Error', 'No se encontró la oferta para verificar.');
            return;
        }

        Alert.alert(
            'Cambiar estado',
            `El estado actual es "${oferta.estado}". ¿Qué quieres hacer?`,
            [
                {
                    text: 'Marcar como activo',
                    onPress: async () => {
                        try {
                            await updateDoc(doc(db, 'oferta', oferta.id), {
                                estado: 'Activo',
                            });
                            Alert.alert('Estado actualizado', 'La oferta ahora está "activo".');
                            await LeerDatos();
                        } catch (error) {
                            console.error('Error actualizando estado a activo:', error);
                            Alert.alert('Error', 'No se pudo actualizar el estado.');
                        }
                    },
                },
                {
                    text: 'Marcar como desactivado',
                    onPress: async () => {
                        try {
                            await updateDoc(doc(db, 'oferta', oferta.id), {
                                estado: 'Desactivado',
                            });
                            Alert.alert('Estado actualizado', 'La oferta ahora está "desactivado".');
                            await LeerDatos();
                        } catch (error) {
                            console.error('Error actualizando estado a desactivado:', error);
                            Alert.alert('Error', 'No se pudo actualizar el estado.');
                        }
                    },
                },
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
            ],
            { cancelable: true }
        );
    };



    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#ED6D4A' barStyle='light-content' />
            <SafeAreaView edges={['bottom']} style={{ flex: 1, alignItems: 'center' }}>

                <Text style={styles.Titulo}> Mis ofertas </Text>

                <ScrollView style={styles.containerCard} showsVerticalScrollIndicator={false} >
                    {Ofertass.map((item, index) => (
                        <View key={index} >
                            <OfertasCard
                                ImagenOferta={item.Nimagen}
                                oferta={item}
                                titulo={item.Ntitulo}
                                precio={`Precio: C$${item.NofertaLibra} por libra`}
                                navigation={navigation}
                            />
                            <TouchableOpacity
                                onPress={() => verificarOferta(item)}
                                style={styles.botonverificar}      >
                                {item.estado === 'Activo' ? (
                                    <Feather name="check-circle" size={24} color="green" />
                                ) : (
                                    <Feather name="x-circle" size={24} color="gray" />
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Crear', { oferta: item })}
                                style={styles.botoneditar}      >
                                <Feather name="edit" size={24} color="blue" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => eliminarOferta(item.id)}
                                style={styles.botonborrar}      >
                                <Feather name="trash-2" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            </SafeAreaView>
        </View>



    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    botoneditar: {
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: 35,
        height: 31,
        position: 'absolute',
        marginTop: 201,
        marginLeft: 203,
    },
    botonborrar: {
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: 35,
        height: 31,
        position: 'absolute',
        marginTop: 201,
        marginLeft: 240,

    },
    botonverificar: {
        width: 32,
        height: 31,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 201,
        left: 168,
        borderRadius: 5,
    },
    Titulo: {
        fontWeight: 'bold',
        fontSize: 18,
        right: 130,
        top: 10
    },
    containerCard: {
        top: 10
    }
});