import React, { useState } from 'react';
import { StyleSheet, Text, View, StatusBar, Image, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import InputText from '../../Components/TextInput';
import Boton from '../../Components/Boton';
import ComboBox from '../../Components/Picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usarTema } from '../../Containers/TemaApp';
import { RegistroUsuario } from '../../Containers/RegistroUsuarios';

export default function Registro({ navigation, setUser }) {
    const { modoOscuro } = usarTema();

    const opciones = [
        { label: 'Comerciante', value: '1' },
        { label: 'Comprador', value: '2' },
    ];

    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [valorSeleccionado, setValorSeleccionado] = useState('');
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    React.useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => setKeyboardVisible(true)
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => setKeyboardVisible(false)
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const limpiarFormulario = () => {
        setNombre('');
        setCorreo('');
        setContrasena('');
        setConfirmarContrasena('');
        setValorSeleccionado('');
    };

    return (
        <View style={[styles.container, modoOscuro ? styles.containerOscuro : styles.containerClaro]}>
            <StatusBar backgroundColor='#F1A89B' barStyle='light-content' />

            {/* Banner */}
            <SafeAreaView style={{ backgroundColor: '#F1A89B' }}>
                <View style={styles.containerBanner}>
                    <View style={styles.bannerContent}>
                        <View style={styles.logoContainer}>
                            <Image
                                source={require('../../../assets/logo.png')}
                                style={styles.bannerLogo}
                            />
                        </View>
                        <Text style={styles.bannerTexto}>Donde el café une historias</Text>
                    </View>
                </View>
            </SafeAreaView>

            <SafeAreaView style={ { flex: 1 } } edges={['bottom', 'left', 'right']}> 
            {/* Contenido del formulario */}
             <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':'height'}>
                <ScrollView
                    contentContainerStyle={[
                        styles.scrollContainer,
                        !keyboardVisible && styles.scrollContainerNoKeyboard
                    ]}
                    keyboardShouldPersistTaps='handled'
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={[styles.Titulo, modoOscuro ? styles.labelOscuro : styles.labelClaro]}>
                        Crea tu cuenta
                    </Text>

                    <View style={styles.containerInput}>
                        <InputText
                            NombreLabel='Nombre de usuario'
                            Valor={nombre}
                            onchangetext={setNombre}
                            placeholder='Ingrese un nombre de usuario'
                        />
                        <InputText
                            NombreLabel='Correo'
                            Valor={correo}
                            onchangetext={setCorreo}
                            placeholder='Ingrese un correo válido'
                        />
                        <InputText
                            NombreLabel='Contraseña'
                            Valor={contrasena}
                            onchangetext={setContrasena}
                            placeholder='Ingrese una contraseña'
                            secureTextEntry
                        />
                        <InputText
                            NombreLabel='Confirme la contraseña'
                            Valor={confirmarContrasena}
                            onchangetext={setConfirmarContrasena}
                            placeholder='Confirme la contraseña'
                            secureTextEntry
                        />

                        <View style={styles.opciones}>
                            <ComboBox
                                NombrePicker="Seleccione su rol"
                                value={valorSeleccionado}
                                onValuechange={(itemValue) => setValorSeleccionado(itemValue)}
                                items={opciones}
                            />
                        </View>

                        <View style={styles.vboton}>
                            <Boton
                                nombreB="Crear"
                                ancho='100'
                                onPress={() => RegistroUsuario({
                                    correo,
                                    contrasena,
                                    confirmarContrasena,
                                    nombre,
                                    valorSeleccionado,
                                    limpiarFormulario,
                                    setUser,
                                    navigation
                                })}
                            />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
    containerBanner: {
        height: 160,
        backgroundColor: '#F1A89B',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    bannerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    bannerTexto: {
        color: 'white',
        fontSize: 23,
        fontWeight: '700',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
        letterSpacing: 0.5,
        flex: 1,
        flexWrap: 'wrap',
        marginTop: 30
    },
    logoContainer: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    bannerLogo: {
        width: '230',
        height: '230',

    },
    containerInput: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    Titulo: {
        fontSize: 30,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginLeft: 25,
        marginTop: 20,
        marginBottom: 20,
    },
    labelClaro: {
        color: '#000',
    },
    labelOscuro: {
        color: '#eee',
    },
    opciones: {
        width: '101.5%',
        marginBottom: 10,
    },
    vboton: {
        marginBottom: 20,
        width: '100%',
        alignItems: 'flex-end',
    },
});