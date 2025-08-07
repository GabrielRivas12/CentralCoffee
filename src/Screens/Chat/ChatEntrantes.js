import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFirestore, collection, getDocs, query, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import appFirebase from '../../Services/Firebase';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const db = getFirestore(appFirebase);
const auth = getAuth(appFirebase);

export default function ChatEntrantes({ navigation }) {
    const [chatsUsuario, setChatsUsuario] = useState([]);
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    useFocusEffect(
        useCallback(() => {
            const obtenerChatsDelUsuario = async () => {
                if (!userId) return;

                try {
                    const snapshot = await getDocs(collection(db, 'chats'));
                    const chats = [];

                    for (const doc of snapshot.docs) {
                        const chatId = doc.id;
                        const ids = chatId.split('_');

                        if (ids.includes(userId)) {
                            const otroUsuarioId = ids.find(id => id !== userId);
                            if (!otroUsuarioId) continue;



                            // Obtener el último mensaje
                            const mensajesRef = collection(db, 'chats', chatId, 'mensajes');
                            const mensajesQuery = query(mensajesRef, orderBy('timestamp', 'desc'), limit(1));
                            const mensajesSnapshot = await getDocs(mensajesQuery);

                            let ultimoMensaje = '';
                            let ultimoTimestamp = null;
                            mensajesSnapshot.forEach(msgDoc => {
                                const data = msgDoc.data();
                                ultimoMensaje = data.texto || '';
                                ultimoTimestamp = data.timestamp ? data.timestamp.toDate() : null;
                            });
                            const { nombre: nombreOtroUsuario, fotoPerfil } = await obtenerDatosUsuario(otroUsuarioId);

                            chats.push({
                                chatId,
                                otroUsuarioId,
                                nombreOtroUsuario,
                                fotoPerfil,
                                ultimoMensaje,
                                ultimoTimestamp
                            });

                        }
                    }

                    // Ordenar chats por último mensaje más reciente
                    chats.sort((a, b) => {
                        if (!a.ultimoTimestamp) return 1;
                        if (!b.ultimoTimestamp) return -1;
                        return b.ultimoTimestamp - a.ultimoTimestamp;
                    });

                    setChatsUsuario(chats);
                } catch (error) {
                    console.error('Error al obtener chats:', error);
                }
            };

            obtenerChatsDelUsuario();
        }, [userId])
    );


    const irAlChat = (otroUsuarioId, nombre, fotoPerfil) => {
        navigation.navigate('Chat', {
            otroUsuarioId,
            nombre,
            fotoPerfil
        });
    };

    const formatDate = (date) => {
        if (!date) return '';
        const now = new Date();
        if (date.toDateString() === now.toDateString()) {
            // Mostrar solo hora si es hoy
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        // Mostrar fecha corta si no es hoy
        return date.toLocaleDateString();
    };

    const crearChatSiNoExiste = async (chatId, userId, otroUsuarioId) => {
        const chatRef = doc(db, 'chats', chatId);
        await setDoc(chatRef, {
            participantes: [userId, otroUsuarioId],
            creadoEn: serverTimestamp()
        }, { merge: true }); // merge evita sobreescribir si ya existe
    };

    const obtenerDatosUsuario = async (uid) => {
        try {
            const docRef = doc(db, 'usuarios', uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                return {
                    nombre: data.nombre || uid,
                    fotoPerfil: data.fotoPerfil || null
                };
            }
        } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
        }
        return { nombre: uid, fotoPerfil: null };
    };



    return (
        <View style={styles.container}>
            <SafeAreaView edges={['bottom']} style={{ backgroundColor: '#fff', flex: 1, width: '100%' }}>
                <FlatList
                    data={chatsUsuario}
                    keyExtractor={(item) => item.chatId}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.chatItem} onPress={() => irAlChat(item.otroUsuarioId, item.nombreOtroUsuario, item.fotoPerfil)}
>
                            {item.fotoPerfil ? (
                                <Image source={{ uri: item.fotoPerfil }} style={styles.avatar} />
                            ) : (
                                <View style={styles.avatarPlaceholder} />
                            )}

                            <View style={styles.chatContent}>
                                <View style={styles.headerRow}>
                                    <Text style={styles.chatTitle}>{item.nombreOtroUsuario}</Text>
                                    <Text style={styles.chatDate}>{formatDate(item.ultimoTimestamp)}</Text>
                                </View>
                                <Text style={styles.chatMessage} numberOfLines={1} ellipsizeMode="tail">
                                    {item.ultimoMensaje || 'No hay mensajes aún'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No tienes chats activos</Text>}
                    contentContainerStyle={{ padding: 10 }}
                />

            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12
    },
    chatContent: {
        flex: 1,
        justifyContent: 'center'
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2
    },
    chatTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#000'
    },
    chatDate: {
        fontSize: 12,
        color: '#999'
    },
    chatMessage: {
        color: '#666',
        fontSize: 14
    },

    avatarPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#bbb', // gris claro
        marginRight: 12
    },

});
