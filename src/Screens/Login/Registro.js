import { StyleSheet, Text, View } from 'react-native';
import InputText from '../../Components/TextInput';
import Boton from '../../Components/Boton';
import { useState } from 'react';
import ComboBox from '../../Components/Picker';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Registro() {

    const opciones = [
        { label: 'Comerciante', value: '1' },
        { label: 'Comprador', value: '2' },
    ];

    const [nombre, setNombre] = useState('');
    const [valorSeleccionado, setValorSeleccionado] = useState('');


    return (
        <View style={styles.container}>
            <SafeAreaView style={{ backgroundColor: '#fff', flex: 1, width: 390, alignItems: 'center' }}>
                <View style={styles.containerBanner}>

                </View>

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
                            Valor=''
                            onchangetext=''
                            placeholder='Correo'
                        />

                        <InputText
                            NombreLabel='Contraseña'
                            Valor=''
                            onchangetext=''
                            placeholder='consr'
                        />

                        <InputText
                            NombreLabel='Confirme la contraseña'
                            Valor=''
                            onchangetext=''
                            placeholder='Confirme'
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
                            />
                        </View>
                    </View>
                </View>
            </SafeAreaView>
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
        backgroundColor: '#ED6D4A',
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