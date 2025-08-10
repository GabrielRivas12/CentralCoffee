import { StyleSheet, Text, View, StatusBar, Alert } from 'react-native';
import InputText from '../../Components/TextInput';
import Boton from '../../Components/Boton';
import { useState } from 'react';
import ComboBox from '../../Components/Picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usarTema } from '../../Containers/TemaApp';

import { RegistroUsuario } from '../../Containers/RegistroUsuarios';
export default function Registro({ navigation }) {

  const { modoOscuro } = usarTema();

    const opciones = [

        { label: 'Seleccionar opcion', value: '' },
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
       <View style={[styles.container, modoOscuro ? styles.containerOscuro : styles.containerClaro]}>
            <StatusBar backgroundColor='#ED6D4A' barStyle='light-content' />
            <SafeAreaView style={{ backgroundColor: '#ED6D4A', flex: 1, alignItems: 'center' }}>
                <View style={styles.containerBanner}>

                </View>
            </SafeAreaView>

            <View style={styles.containerCuerpo}>
               <Text style={[styles.Titulo, modoOscuro ? styles.labelOscuro : styles.labelClaro]}>Crea tu cuenta</Text>

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
                        placeholder='Ingrese un correo valido'
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
                    <View style={styles.botonCrear}>
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
      containerClaro: {
    backgroundColor: '#fff',
  },
  containerOscuro: {
    backgroundColor: '#000',
  },

    containerCuerpo: {
        flex: 2.5,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    Titulo: {
        fontSize: 30,
        fontWeight: 'bold',
        paddingLeft: 150,
        paddingTop: 10,
        paddingBottom: 10
    },
      labelClaro: {
    color: '#000',
  },
  labelOscuro: {
    color: '#eee',
  },
    opciones: {
        left:'2.5%'
    },
    botonCrear: {
        left: '32.5%',
        top:'1%'
    }

});