import { collection, getDocs, query, orderBy, limit, doc, setDoc, serverTimestamp, getFirestore } from 'firebase/firestore';
import appFirebase from '../Services/Firebase';

const db = getFirestore(appFirebase);
import { obtenerDatosUsuario } from './ObtenerUsuario';

export const obtenerChatsDelUsuario = async (userId) => {
    const snapshot = await getDocs(collection(db, 'chats'));
    const chats = [];

    for (const docSnap of snapshot.docs) {
        const chatId = docSnap.id;
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

    // Ordenar por mensaje más reciente
    chats.sort((a, b) => {
        if (!a.ultimoTimestamp) return 1;
        if (!b.ultimoTimestamp) return -1;
        return b.ultimoTimestamp - a.ultimoTimestamp;
    });

    return chats;
};

export const crearChatSiNoExiste = async (chatId, userId, otroUsuarioId) => {
    const chatRef = doc(db, 'chats', chatId);
    await setDoc(chatRef, {
        participantes: [userId, otroUsuarioId],
        creadoEn: serverTimestamp()
    }, { merge: true });
};
