import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


import { getFirestore, doc, getDoc, setDoc, collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import appFirebase from '../../Services/Firebase';
import { getAuth } from 'firebase/auth';
import { usarTema } from '../../Containers/TemaApp';

import Ionicons from '@expo/vector-icons/Ionicons';

const db = getFirestore(appFirebase);
const auth = getAuth(appFirebase);

// Combina las ID para generar un ID de chat
const generarChatId = (id1, id2) => {
    if (!id1 || !id2) return null;
    return id1 < id2 ? `${id1}_${id2}` : `${id2}_${id1}`;
};

export default function Chat({ navigation, route }) {

    const { modoOscuro } = usarTema();
    const { ofertaReferencia } = route.params || {};
    const [referenciaPendiente, setReferenciaPendiente] = useState(ofertaReferencia || null);

    const flatListRef = React.useRef(null);

    const [mensaje, setMensaje] = useState('');
    const [mensajes, setMensajes] = useState([]);
    const [chatId, setChatId] = useState(null);

    const { otroUsuarioId } = route.params;
    const currentUser = auth.currentUser;
    const userId = currentUser ? currentUser.uid : null;

    // ✅ Genera el chat ID si son validos
    useEffect(() => {
        if (userId && otroUsuarioId) {
            const id = generarChatId(userId, otroUsuarioId);
            setChatId(id);
        }
    }, [userId, otroUsuarioId]);

    // ✅ Leer mensajes del chat
    useEffect(() => {
        const crearChatSiNoExiste = async () => {
            if (!chatId || !userId || !otroUsuarioId) return;

            const chatDocRef = doc(db, 'chats', chatId);
            const chatSnapshot = await getDoc(chatDocRef);

            if (!chatSnapshot.exists()) {
                await setDoc(chatDocRef, {
                    participantes: [userId, otroUsuarioId],
                    creadoEn: new Date(),
                });
            }
        };

        crearChatSiNoExiste();
    }, [chatId]);

    useEffect(() => {
        if (!chatId) return;

        const q = query(
            collection(db, 'chats', chatId, 'mensajes'),
            orderBy('timestamp', 'asc')
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const mensajesFirestore = [];
            querySnapshot.forEach((doc) => {
                mensajesFirestore.push({ id: doc.id, ...doc.data() });
            });
            setMensajes(mensajesFirestore);
        });

        return () => unsubscribe();
    }, [chatId]);



    const enviarMensaje = async () => {
        if (mensaje.trim() === '' || !chatId || !userId) return;

        try {
            const chatDocRef = doc(db, 'chats', chatId);

            const chatExists = await getDoc(chatDocRef);

            if (!chatExists.exists()) {
                await setDoc(chatDocRef, {
                    participantes: [userId, otroUsuarioId],
                    creadoEn: new Date()
                });
            }

            await addDoc(collection(db, 'chats', chatId, 'mensajes'), {
                texto: mensaje,
                timestamp: new Date(),
                de: userId,
            });

            setMensaje('');
        } catch (error) {
        }
    };
    useEffect(() => {
        if (mensajes.length > 0) {
            flatListRef.current?.scrollToEnd({ animated: false }); // animated: false para que no se vea el scroll
        }
    }, [mensajes]);

const [isAtBottom, setIsAtBottom] = useState(true);

const onScroll = (event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;

    // Si el scroll está a menos de 20 px del final, consideramos que está "pegado"
    const distanceFromBottom = contentSize.height - (contentOffset.y + layoutMeasurement.height);

    setIsAtBottom(distanceFromBottom < 20);
};

useEffect(() => {
    if (isAtBottom && mensajes.length > 0) {
        flatListRef.current?.scrollToEnd({ animated: true });
    }
}, [mensajes, isAtBottom]);


    return (
        <View style={[styles.container, { backgroundColor: modoOscuro ? '#000' : '#fff' }]}>
            <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={95}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={{ flex: 1 }}>
                            <FlatList
                                data={mensajes}
                                renderItem={({ item }) => (
                                    <View
                                        style={[
                                            styles.mensajeContainer,
                                            item.de === userId
                                                ? styles.mensajePropio
                                                : modoOscuro
                                                    ? styles.mensajeOtroOscuro
                                                    : styles.mensajeOtroClaro
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.textoMensaje,
                                                item.de === userId
                                                    ? { color: '#000' } // mensaje propio: negro siempre
                                                    : modoOscuro
                                                        ? { color: '#fff' } // mensaje ajeno modo oscuro: blanco
                                                        : { color: '#000' } // mensaje ajeno modo claro: negro
                                            ]}
                                        >
                                            {item.texto}
                                        </Text>

                                    </View>
                                )}
                                keyExtractor={(item) => item.id}
                                contentContainerStyle={{ padding: 10, flexGrow: 1 }}
                                style={{ flex: 1 }}
                                ref={flatListRef}
                                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                                onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
                                keyboardShouldPersistTaps="handled"
                            />

                            {referenciaPendiente && (
                                <View style={[
                                    styles.referenciaPreview,
                                    modoOscuro && {
                                        backgroundColor: '#2a2a2a',
                                        borderLeftColor: '#ED6D4A'
                                    }
                                ]}>
                                    <Text style={[styles.referenciaTitulo, modoOscuro && { color: '#fff' }]}>{referenciaPendiente.titulo}</Text>
                                    <Text style={{ color: modoOscuro ? '#ccc' : '#000' }}>🫘 Tipo: {referenciaPendiente.tipoCafe}</Text>
                                    <Text style={{ color: modoOscuro ? '#ccc' : '#000' }}>📦 Cantidad: {referenciaPendiente.cantidadProduccion}</Text>
                                    <Text style={{ color: modoOscuro ? '#ccc' : '#000' }}>💲 Precio/libra: {referenciaPendiente.ofertaLibra}</Text>

                                    <View style={styles.botonesReferencia}>
                                        <TouchableOpacity
                                            style={[styles.botonEnviar, { backgroundColor: '#f16a34ff' }]}
                                            onPress={async () => {
                                                if (!chatId || !userId) return;

                                                const chatDocRef = doc(db, 'chats', chatId);
                                                const chatSnapshot = await getDoc(chatDocRef);

                                                if (!chatSnapshot.exists()) {
                                                    await setDoc(chatDocRef, {
                                                        participantes: [userId, otroUsuarioId],
                                                        creadoEn: new Date(),
                                                    });
                                                }

                                                const resumen = `📌 Oferta: ${referenciaPendiente.titulo}\n🫘 Tipo: ${referenciaPendiente.tipoCafe}\n📦 Cantidad: ${referenciaPendiente.cantidadProduccion}\n💲 Precio/libra: ${referenciaPendiente.ofertaLibra}`;

                                                await addDoc(collection(db, 'chats', chatId, 'mensajes'), {
                                                    texto: resumen,
                                                    timestamp: new Date(),
                                                    de: userId,
                                                    tipo: 'referencia',
                                                });

                                                setReferenciaPendiente(null);
                                            }}
                                        >
                                            <Text style={styles.botonTexto}>Enviar</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[styles.botonEnviar, { backgroundColor: '#545454' }]}
                                            onPress={() => setReferenciaPendiente(null)}
                                        >
                                            <Text style={styles.botonTexto}>Cancelar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}

                            <View style={[styles.inputContainer, modoOscuro && { backgroundColor: '#1a1a1a', borderTopColor: '#333' }]}>
                                <TextInput
                                    style={[
                                        styles.input,
                                        modoOscuro && {
                                            backgroundColor: '#333',
                                            color: '#fff',
                                            borderColor: '#555'
                                        }
                                    ]}
                                    value={mensaje}
                                    onChangeText={setMensaje}
                                    placeholder="Escribe un mensaje..."
                                    placeholderTextColor={modoOscuro ? '#aaa' : '#999'}
                                    multiline
                                />
                                <TouchableOpacity style={styles.botonEnviar} onPress={enviarMensaje}>
                                    <Ionicons name="send-outline" size={24} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mensajeContainer: {
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        maxWidth: '80%',
    },
    mensajePropio: {
        backgroundColor: '#f8dbd7', // claro para mensajes propios
        alignSelf: 'flex-end',
    },
    mensajeOtroClaro: {
        backgroundColor: '#E5E5E5', // claro para mensajes ajenos
        alignSelf: 'flex-start',
    },
    mensajeOtroOscuro: {
        backgroundColor: '#333', // oscuro para mensajes ajenos
        alignSelf: 'flex-start',
    },
    textoMensaje: {
        fontSize: 16,
        color: '#000',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        maxHeight: 100,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 16,
        backgroundColor: '#f2f2f2',
        marginRight: 10,
        color: '#000',
    },
    botonEnviar: {
        backgroundColor: '#ED6D4A',
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    botonTexto: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    referenciaPreview: {
        backgroundColor: '#f8dbd7',
        borderLeftWidth: 4,
        borderLeftColor: '#b55034',
        padding: 10,
        margin: 10,
        borderRadius: 8,
    },
    referenciaTitulo: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
        color: '#000',
    },
    botonesReferencia: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
        gap: 10,
    },
});
