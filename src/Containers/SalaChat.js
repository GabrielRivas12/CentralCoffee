// Containers/SalaChat.js
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import appFirebase from '../Services/Firebase';
import { encryptText, decryptText, isEncrypted } from '../Containers/Encrintar';

const db = getFirestore(appFirebase);

/** ✅ Genera un ID de chat consistente entre dos usuarios */
export const generarChatId = (id1, id2) => {
    if (!id1 || !id2) return null;
    return id1 < id2 ? `${id1}_${id2}` : `${id2}_${id1}`;
};

/** ✅ Crea el chat si no existe */
export const crearChatSiNoExiste = async (chatId, userId, otroUsuarioId) => {
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

/** ✅ Escucha los mensajes de un chat en tiempo real */
export const LeerMensajes = (chatId, setMensajes) => {
    if (!chatId) return;

    const q = query(collection(db, 'chats', chatId, 'mensajes'), orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const mensajesFirestore = [];
        querySnapshot.forEach((doc) => {
            const mensajeData = doc.data();
            
            // Desencriptar el texto si está encriptado
            let texto = mensajeData.texto;
            if (isEncrypted(texto)) {
                texto = decryptText(texto);
            }
            
            mensajesFirestore.push({ 
                id: doc.id, 
                ...mensajeData,
                texto // Texto desencriptado
            });
        });
        setMensajes(mensajesFirestore);
    });

    return unsubscribe;
};

/** ✅ Envía un mensaje de texto (encriptado) */
export const enviarMensaje = async (chatId, userId, otroUsuarioId, texto) => {
    if (texto.trim() === '' || !chatId || !userId) return;

    try {
        const chatDocRef = doc(db, 'chats', chatId);
        const chatExists = await getDoc(chatDocRef);

        if (!chatExists.exists()) {
            await setDoc(chatDocRef, {
                participantes: [userId, otroUsuarioId],
                creadoEn: new Date()
            });
        }

        // Encriptar el mensaje antes de enviarlo
        const textoEncriptado = encryptText(texto.trim());

        await addDoc(collection(db, 'chats', chatId, 'mensajes'), {
            texto: textoEncriptado,
            timestamp: new Date(),
            de: userId,
            encriptado: true, // Bandera para identificar mensajes encriptados
        });
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
    }
};

/** ✅ Envía una referencia de oferta (resumen encriptado) */
export const enviarReferencia = async (chatId, userId, otroUsuarioId, referenciaPendiente) => {
    if (!chatId || !userId || !referenciaPendiente) return;

    const chatDocRef = doc(db, 'chats', chatId);
    const chatSnapshot = await getDoc(chatDocRef);

    if (!chatSnapshot.exists()) {
        await setDoc(chatDocRef, {
            participantes: [userId, otroUsuarioId],
            creadoEn: new Date(),
        });
    }

    const resumen = `📌 Oferta: ${referenciaPendiente.titulo}\n🫘 Tipo: ${referenciaPendiente.tipoCafe}\n📦 Cantidad: ${referenciaPendiente.cantidadProduccion}\n💲 Precio/libra: ${referenciaPendiente.ofertaLibra}`;

    // Encriptar el resumen
    const resumenEncriptado = encryptText(resumen);

    await addDoc(collection(db, 'chats', chatId, 'mensajes'), {
        texto: resumenEncriptado,
        timestamp: new Date(),
        de: userId,
        tipo: 'referencia',
        encriptado: true,
    });
};

