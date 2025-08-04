import { StyleSheet, Text, View, StatusBar, Alert } from 'react-native';
import InputText from '../../Components/TextInput';
import Boton from '../../Components/Boton';
import { useState } from 'react';
import ComboBox from '../../Components/Picker';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RegistroUsuario} from '../../Containers/RegistroUsuarios';
export default function Registro({ navigation }) {

    const opciones = [

        { label: 'Comerciante', value: '1' },
        { label: 'Comprador', value: '2' },
    ];

    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [valorSeleccionado, setValorSeleccionado] = useState('');

    const limpiarFormulario = () => {
        setNombre('');
        setCorreo('');
        setContrasena('');
        setConfirmarContrasena('');
        setValorSeleccionado('');
    };


    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#ED6D4A' barStyle='light-content' />
            <SafeAreaView style={{ backgroundColor: '#ED6D4A', flex: 1, alignItems: 'center' }}>
                <View style={styles.containerBanner}>

                </View>
            </SafeAreaView>

            <View style={styles.containerCuerpo}>
                <Text style={styles.Titulo}>Crea tu cuenta</Text>

                <View style={styles.containerInput}>
                    <InputText
                        NombreLabel='Nombre de usuario'
                        Valor={nombre}
                        onchangetext={setNombre}
                        placeholder='nombre'
                    />
                    <InputText
                        NombreLabel='Correo'
                        Valor={correo}
                        onchangetext={setCorreo}
                        placeholder='Correo'
                    />
                    <InputText
                        NombreLabel='Contraseña'
                        Valor={contrasena}
                        onchangetext={setContrasena}
                        placeholder='Contraseña'
                        secureTextEntry
                    />
                    <InputText
                        NombreLabel='Confirme la contraseña'
                        Valor={confirmarContrasena}
                        onchangetext={setConfirmarContrasena}
                        placeholder='Confirme contraseña'
                        secureTextEntry
                    />
                    <ComboBox
                        NombrePicker="Seleccione su rol"
                        value={valorSeleccionado}
                        onValuechange={(itemValue) => setValorSeleccionado(itemValue)}
                        items={opciones}
                    />
                    <View style={{ width: '100%', paddingLeft: 250 }}>
                        <Boton
                            nombreB="Crear"
                            ancho="100"
                            onPress={() => RegistroUsuario({
                                correo,
                                contrasena,
                                confirmarContrasena,
                                nombre,
                                valorSeleccionado,
                                  limpiarFormulario 
                            })}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    containerBanner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerCuerpo: {
        flex: 2.5,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    containerInput: {
    },
    Titulo: {
        fontSize: 30,
        fontWeight: 'bold',
        paddingLeft: 150,
        paddingTop: 10,
        paddingBottom: 10
    },
    label: {

    }

});