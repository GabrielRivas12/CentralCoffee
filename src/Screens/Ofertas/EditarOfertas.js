import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import appFirebase from '../../Services/BasedeDatos/Firebase';
import { useFocusEffect } from '@react-navigation/native';
import OfertasCard from '../../Containers/OfertasCard';
import Feather from '@expo/vector-icons/Feather';
import Octicons from '@expo/vector-icons/Octicons';

import {
    collection,
    getFirestore,
    query, doc,
    setDoc, getDocs, getDoc,
    deleteDoc
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
        const q = query(collection(db, "oferta"));
        const querySnapshot = await getDocs(q);
        const d = [];
        querySnapshot.forEach((doc) => {
            const datosBD = doc.data();
            d.push({ id: doc.id, ...datosBD });
        });
        setOfertass(d);
    }

    const eliminarOferta = (id) => {
        Alert.alert(
            'Confirmar eliminacion',
            '¿Estas seguro de que deseas eliminar el registro?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteDoc(doc(db, "oferta", id));
                        await LeerDatos();
                    }
                },
            ],
            { cancelable: true }
        );
    }
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
                                onPress={() => navigation.navigate('Crear', { oferta: item })}
                                style={styles.botonverificar}      >
                                <Octicons name="check-circle-fill" size={24} color="green" />
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