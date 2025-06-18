import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Boton from '../../Components/Boton'

export default function PerfilUsuario({ navigation }) {

  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

 

  return (
    <View style={[styles.container, darkMode ? styles.darkContainer : styles.lightContainer]}>

      <Text style={darkMode ? styles.darkText : styles.lightText}>
        este es el perfil de PerfilUsuario
      </Text>
      <Boton
        nombreB='boton'
        onPress={() => navigation.navigate('Editar Informacion')}
        backgroundColor='#fff'
      />

      <Boton
        nombreB='boton'
        onPress={() => navigation.navigate('Mi Perfil')}
        backgroundColor='#fff'
      />
      <Boton
        nombreB={darkMode ? 'Tema Claro' : 'Tema Oscuro'}
        onPress={toggleTheme}
        backgroundColor={darkMode ? '#888' : '#ddd'}
        textColor={darkMode ? '#fff' : '#000'}
      />

      
      

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightContainer: {
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#222',
  },
  lightText: {
    color: '#000',
    marginBottom: 20,
  },
  darkText: {
    color: '#fff',
    marginBottom: 20,
  },

});