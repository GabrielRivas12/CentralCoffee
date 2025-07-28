import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import appFirebase from '../../Services/BasedeDatos/Firebase';
import { useFocusEffect } from '@react-navigation/native';
import OfertasCard from '../../Containers/OfertasCard';
import Feather from '@expo/vector-icons/Feather';

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
            'Confirmar aliminacion',
            'Estas seguro de que deseas elimanar el registro?',
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
            <SafeAreaView edges={['bottom']} style={{ backgroundColor: '#fff', flex: 1, width: 390, alignItems: 'center' }}>



                <ScrollView>
                    {Ofertass.map((item, index) => (
                        <View key={index}>
                            <OfertasCard
                                ImagenOferta={item.Nimagen}
                                oferta={item}
                                titulo={item.Ntitulo}
                                precio={`Precio: C$${item.NofertaLibra} por libra`}
                                navigation={navigation}
                            />

                            <TouchableOpacity
                                onPress={() => navigation.navigate('Crear',  { oferta: item })} 
                                style={styles.botoneditar}      >
                                <Feather name="edit" size={24} color="black" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => eliminarOferta(item.id)}
                                style={styles.botonborrar}      >
                                <Feather name="trash-2" size={24} color="black" />
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
        backgroundColor: 'green',
        borderRadius: 8,
        alignItems: 'center',
        width: 60,
        height: 40,
        position: 'absolute',
        marginTop: 190,
        marginLeft: 30
    },
    botonborrar: {
        backgroundColor: 'green',
        borderRadius: 8,
        alignItems: 'center',
        width: 60,
        height: 40,
        position: 'absolute',
        marginTop: 190,
        marginLeft: 100
    },
    containerLista: {
        width: 350,
        height: 230,
        backgroundColor: '#EBEBEB',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#EBEBEB'

    },
    containerListaB: {
        marginLeft: 250,
        marginTop: 180,
        position: 'absolute'
    },
    containerListaImagen: {
        width: 330,
        height: 140,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#999',
        marginBottom: 1
    },
    Titulo: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    tituloContainer: {
        width: '90%',
        alignItems: 'flex-start',
        marginTop: 5
    },
    precio: {
        fontSize: 12
    },

    botoncrear: {
        marginBottom: 50,
        position: 'absolute',
        bottom: 20,
        right: 10,
        borderRadius: 50,
        backgroundColor: 'transparent',
    },

    containerBusqueda: {
        alignItems: 'center',
        bottom: 10,
        height: 70
    }

});