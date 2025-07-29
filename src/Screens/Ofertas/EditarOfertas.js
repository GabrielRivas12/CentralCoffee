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
            <SafeAreaView edges={['bottom']} style={{  flex: 1, alignItems: 'center' }}>



                <ScrollView   showsVerticalScrollIndicator={false} >
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
        backgroundColor: 'green',
        borderRadius: 8,
        alignItems: 'center',
        width: 60,
        height: 40,
        position: 'absolute',
        marginTop: 202,
        marginLeft: 170,
        backgroundColor: 'transparent'
    },
    botonborrar: {
        backgroundColor: 'green',
        borderRadius: 8,
        alignItems: 'center',
        width: 60,
        height: 40,
        position: 'absolute',
        marginTop: 202,
        marginLeft: 210,
        backgroundColor: 'transparent'
    },
});