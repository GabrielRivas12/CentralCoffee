// /screens/ChatEntrantes.js
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { obtenerChatsDelUsuario } from '../../Containers/ObtenerChat';
import { usarTema } from '../../Containers/TemaApp';
import { auth } from '../../Services/Firebase';

export default function ChatEntrantes({ navigation }) {

    const { modoOscuro } = usarTema();
    const [chatsUsuario, setChatsUsuario] = useState([]);
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    useFocusEffect(
        useCallback(() => {
            const fetchChats = async () => {
                if (!userId) return;

                try {
                    const chats = await obtenerChatsDelUsuario(userId);
                    setChatsUsuario(chats);
                } catch (error) {
                    console.error('Error al obtener chats:', error);
                }
            };

            fetchChats();
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
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return date.toLocaleDateString();
    };

    return (
         <View style={[styles.container, modoOscuro ? styles.containerOscuro : styles.containerClaro]}>
            <SafeAreaView edges={['bottom']} style={{ flex: 1, width: '100%' }}>
                <FlatList
                    data={chatsUsuario}
                    keyExtractor={(item) => item.chatId}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.chatItem}
                            onPress={() => irAlChat(item.otroUsuarioId, item.nombreOtroUsuario, item.fotoPerfil)}
                        >
                            {item.fotoPerfil ? (
                                <Image source={{ uri: item.fotoPerfil }} style={styles.avatar} />
                            ) : (
                                <View style={styles.avatarPlaceholder} />
                            )}

                            <View style={styles.chatContent}>
                                <View style={styles.headerRow}>
                                    <Text style={[styles.chatTitle, modoOscuro ? styles.textoOscuro : styles.textoClaro]}>
                                        {item.nombreOtroUsuario}
                                    </Text>
                                    <Text style={[styles.chatDate, modoOscuro ? styles.textoOscuroSecundario : styles.textoClaroSecundario]}>
                                        {formatDate(item.ultimoTimestamp)}
                                    </Text>
                                </View>
                                <Text
                                    style={[styles.chatMessage, modoOscuro ? styles.textoOscuroSecundario : styles.textoClaroSecundario]}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {item.ultimoMensaje || 'No hay mensajes aún'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <Text style={[{ textAlign: 'center', marginTop: 20 }, modoOscuro ? styles.textoOscuro : styles.textoClaro]}>
                            No tienes chats activos
                        </Text>
                    }
                    contentContainerStyle={{ padding: 10 }}
                />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
     container: {
        flex: 1,
    },
    containerClaro: {
        backgroundColor: '#fff',
    },
    containerOscuro: {
        backgroundColor: '#000',
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12
    },
    avatarPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#bbb',
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
    },
    chatDate: {
        fontSize: 12,
    },
    chatMessage: {
        fontSize: 14,
    },
    textoClaro: {
        color: '#000',
    },
    textoOscuro: {
        color: '#fff',
    },
    textoClaroSecundario: {
        color: '#666',
    },
    textoOscuroSecundario: {
        color: '#ccc',
    },
});
