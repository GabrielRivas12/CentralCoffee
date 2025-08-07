import { Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Services/Firebase';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import appFirebase from '../Services/Firebase';

const db = getFirestore(appFirebase);

export const RegistroUsuario = async ({ correo, contrasena, confirmarContrasena, nombre, valorSeleccionado, limpiarFormulario }) => {
    if (!correo || !contrasena || !confirmarContrasena || !nombre || !valorSeleccionado) {
        Alert.alert('Campos incompletos', 'Por favor llena todos los campos y selecciona tu rol');
        return;
    }

    if (contrasena !== confirmarContrasena) {
        Alert.alert('Error', 'Las contraseñas no coinciden');
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, correo, contrasena);
        const user = userCredential.user;

        await setDoc(doc(db, "usuarios", user.uid), {
            nombre: nombre,
            correo: correo,
            rol: valorSeleccionado === '1' ? 'Comerciante' : 'Comprador',
            uid: user.uid,
            descripcion: 'Este usuario no tiene una descripcion'
        });

        Alert.alert('Registro exitoso', 'Usuario creado correctamente');
        limpiarFormulario();


    } catch (error) {
        Alert.alert('Error al registrar', error.message);
    }
};

