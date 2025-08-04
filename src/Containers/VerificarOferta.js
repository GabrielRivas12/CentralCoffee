import { Alert } from 'react-native';
import appFirebase from '../Services/Firebase';


import {
    collection,
    getFirestore,
    query, doc,
    setDoc, getDocs, getDoc,
    deleteDoc, updateDoc, where
} from 'firebase/firestore';

const db = getFirestore(appFirebase);

export const VerificarOferta = (oferta, LeerDatos) => {
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
