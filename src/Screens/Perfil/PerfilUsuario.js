import React, { useState, createContext } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, Alert } from 'react-native';
import Boton from '../../Components/Boton'
import { SafeAreaView } from 'react-native-safe-area-context';

import { signOut } from 'firebase/auth';
import { auth } from '../../Services/Firebase';
import appFirebase from '../../Services/Firebase';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const db = getFirestore(appFirebase);

export const themeContext = createContext();

export default function PerfilUsuario({ navigation }) {

  const [darkMode, setDarkMode] = useState(false);
  const toggleTheme = () => setDarkMode(prev => !prev);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <themeContext.Provider value={{ darkMode, toggleTheme }}>
      <SafeAreaView edges={['bottom']} style={{ backgroundColor: '#fff', flex: 1, width: 390 }}>
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
          <Boton
            nombreB="Cerrar sesión"
            onPress={handleLogout}
            backgroundColor="#f55"
            textColor="#fff"
          />


        </View>
      </SafeAreaView>
    </themeContext.Provider>

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