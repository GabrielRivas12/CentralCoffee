import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


import { getFirestore, doc, getDoc, setDoc, collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import appFirebase from '../../Services/Firebase';
import { getAuth } from 'firebase/auth';
import { ScrollView } from 'react-native-gesture-handler';


const db = getFirestore(appFirebase);
const auth = getAuth(appFirebase);

// 🔧 Esta función la defines al principio
const generarChatId = (id1, id2) => {
    if (!id1 || !id2) return null;
    return id1 < id2 ? `${id1}_${id2}` : `${id2}_${id1}`;
};

export default function Chat({ navigation, route }) {

    const { ofertaReferencia } = route.params || {};
    const [referenciaPendiente, setReferenciaPendiente] = useState(ofertaReferencia || null);

    const flatListRef = React.useRef(null);

    const [mensaje, setMensaje] = useState('');
    const [mensajes, setMensajes] = useState([]);
    const [chatId, setChatId] = useState(null);

    const { otroUsuarioId } = route.params;
    const currentUser = auth.currentUser;
    const userId = currentUser ? currentUser.uid : null;

    // ✅ Generar chatId solo cuando ambos IDs están listos
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


    return (
        <SafeAreaView edges={['bottom']} style={styles.container}>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={95} // ajusta si tienes header/tab bar
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={{ flex: 1 }}>
                        <FlatList
                            data={mensajes}

                            renderItem={({ item }) => (
                                <View
                                    style={[
                                        styles.mensajeContainer,
                                        item.de === userId ? styles.mensajePropio : styles.mensajeOtro,
                                    ]}
                                >
                                    <Text style={styles.textoMensaje}>{item.texto}</Text>
                                </View>
                            )}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{ padding: 10, flexGrow: 1 }}
                            style={{ flex: 1 }}
                            ref={flatListRef}
                            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                            onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
                            keyboardShouldPersistTaps="handled"
                        />

                        {referenciaPendiente && (
                            <View style={styles.referenciaPreview}>
                                <Text style={styles.referenciaTitulo}>{referenciaPendiente.Ntitulo}</Text>
                                <Text>🫘 Tipo: {referenciaPendiente.NtipoCafe}</Text>
                                <Text>📦 Cantidad: {referenciaPendiente.NcantidadProduccion}</Text>
                                <Text>💲 Precio/libra: {referenciaPendiente.NofertaLibra}</Text>

                                <View style={styles.botonesReferencia}>
                                    <TouchableOpacity
                                        style={[styles.botonEnviar, { backgroundColor: '#34B7F1' }]}
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

                                            const resumen = `📌 Oferta: ${referenciaPendiente.Ntitulo}\n🫘 Tipo: ${referenciaPendiente.NtipoCafe}\n📦 Cantidad: ${referenciaPendiente.NcantidadProduccion}\n💲 Precio/libra: ${referenciaPendiente.NofertaLibra}`;

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
                                        style={[styles.botonEnviar, { backgroundColor: '#999' }]}
                                        onPress={() => setReferenciaPendiente(null)}
                                    >
                                        <Text style={styles.botonTexto}>Cancelar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                        <View style={styles.inputContainer}>

                            <TextInput
                                style={styles.input}
                                value={mensaje}
                                onChangeText={setMensaje}
                                placeholder="Escribe un mensaje..."
                                multiline
                            />
                            <TouchableOpacity style={styles.botonEnviar} onPress={enviarMensaje}>
                                <Text style={styles.botonTexto}>Enviar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    mensajeContainer: {
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        maxWidth: '80%',
    },
    mensajePropio: {
        backgroundColor: '#DCF8C6',
        alignSelf: 'flex-end',
    },
    mensajeOtro: {
        backgroundColor: '#E5E5E5',
        alignSelf: 'flex-start',
    },
    textoMensaje: {
        fontSize: 16,
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
        marginRight: 10
    },
    botonEnviar: {
        backgroundColor: '#25D366', // color WhatsApp
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
        backgroundColor: '#FFF3E0',
        borderLeftWidth: 4,
        borderLeftColor: '#FFA726',
        padding: 10,
        margin: 10,
        borderRadius: 8,
    },

    referenciaTitulo: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
    },

    botonesReferencia: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
        gap: 10,
    },

});
