import React, { useState } from 'react';
import { View, StyleSheet, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Octicons from '@expo/vector-icons/Octicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons'; // Importa el ícono para el scanner

import OfertasCard from '../../Components/OfertasCard';
import Boton from '../../Components/Boton'
import InputText from '../../Components/TextInput';
import { LeerDatos } from '../../Containers/ObtenerOfertas';
import { BuscarOferta } from '../../Containers/BuscadorOferta';

import { usarTema } from '../../Containers/TemaApp';

export default function Ofertas({ navigation, user }) {

  const [Ofertass, setOfertass] = useState([]);
  const [valorBusqueda, setValorBusqueda] = useState('');
  const { modoOscuro, alternarTema } = usarTema();

  useFocusEffect(
    React.useCallback(() => {
      const CargarOfertas = async () => {
        const datos = await LeerDatos();
        setOfertass(datos);
      };
      CargarOfertas();
    }, [])
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor='#ED6D4A' barStyle='light-content' />
      <SafeAreaView
        edges={['bottom']}
        style={[
          { flex: 1, alignItems: 'center' },
          modoOscuro ? styles.contenedorOscuro : styles.contenedorClaro
        ]}
      >

        <View style={styles.containerBusqueda}>
          <InputText
            modoOscuro={modoOscuro}
            Valor={valorBusqueda}
            onchangetext={async (texto) => {
              setValorBusqueda(texto);
              if (texto.trim() !== '') {
                const resultados = await BuscarOferta(texto);
                setOfertass(resultados);
              } else {
                const datos = await LeerDatos();
                setOfertass(datos);
              }
            }}
            placeholder='Buscar'
            ancho='370'
          />
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {Ofertass.map((item, index) => (
            <OfertasCard
              key={index}
              ImagenOferta={item.imagen}
              oferta={item}
              titulo={item.titulo}
              precio={`Precio: C$${item.ofertaLibra} por libra`}
              navigation={navigation}
              modoOscuro={modoOscuro}
            />
          ))}
        </ScrollView>

        {/* Botón para escanear oferta (lado izquierdo) */}
        <View style={styles.botonEscanear}>
          <TouchableOpacity
            style={[
              styles.botonEscanearTouchable,
              { backgroundColor: '#ED6D4A' }
            ]}
            onPress={() => navigation.navigate('EscanearQR')}
          >
            <MaterialIcons name="qr-code-scanner" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Botón para crear oferta (Comerciante) - lado derecho */}
        {user?.rol === 'Comerciante' && (
          <View style={styles.botonCrear}>
            <Boton
              onPress={() => navigation.navigate('Crear')}
              alto={60}
              ancho={60}
              borderRadius={10}
            />
            <View pointerEvents="none" style={{ position: 'absolute', top: 20, left: 20 }}>
              <Octicons name="pencil" size={24} color="white" />
            </View>
          </View>
        )}

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contenedorClaro: {
    backgroundColor: '#fff',
  },
  contenedorOscuro: {
    backgroundColor: '#000',
  },
  scrollView: {
    width: '100%',
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, 
  },
  botonCrear: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    zIndex: 10,
  },
  botonEscanear: {
    position: 'absolute',
    left: 20, 
    bottom: 20,
    zIndex: 10,
    
  },
  botonEscanearTouchable: {
    width: 60,
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  containerBusqueda: {
    alignItems: 'center',
    top: 10,
    height: 70
  },
});