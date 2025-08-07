import React, { useState, createContext } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Boton from '../../Components/Boton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';
import { auth } from '../../Services/Firebase';

import Logout from '../../Containers/CerrarSesión';

export const themeContext = createContext();

export default function PerfilUsuario({ navigation }) {
  const [darkMode, setDarkMode] = useState(false);
  const toggleTheme = () => setDarkMode(prev => !prev);

  return (
    <themeContext.Provider value={{ darkMode, toggleTheme }}>
      <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
        <View style={[styles.container, darkMode ? styles.darkContainer : styles.lightContainer]}>

          {/* Imagen de portada */}
          <View>
            <Image
              source={{ uri: 'https://via.placeholder.com/100' }}
              style={styles.portadaImage}
            />
          </View>

          {/* Imagen de perfil superpuesta */}
          <View style={styles.profileImageWrapper}>
            <Image
              source={{ uri: 'https://via.placeholder.com/100' }}
              style={styles.profileImage}
            />
          </View>

          {/* Header con botón de mensaje */}
          <View style={styles.profileHeader}>
            <Text style={[styles.nameText, darkMode && styles.darkText]}>Juan Pérez</Text>

            <Boton
              nombreB="Mensaje"
              onPress={() => navigation.navigate('ChatPrivado')}
              backgroundColor="#007AFF"
              textColor="#fff"
              alto={30}
              ancho={90}
            />
          </View>

          <View style={[styles.separator, darkMode && { backgroundColor: '#555' }]} />

          {/* Sección "Sobre mí" */}
          <Text style={[styles.TextoSobremi, darkMode && styles.darkText]}>Sobre mí</Text>
          <View style={[styles.descriptionBox, darkMode && { backgroundColor: '#333' }]}>
            <Text style={[styles.descriptionText, darkMode && styles.darkText]}>
              ¡Hola! Soy Juan Pérez. Me encanta la tecnología, el desarrollo móvil y tomar café mientras programo ☕. ¡Conectemos!
            </Text>
          </View>

          {/* Ubicación */}
          <View style={styles.locationBox}>
            <Text style={[styles.locationText, darkMode && styles.darkText]}>
              📍 Managua, Nicaragua
            </Text>
          </View>

          {/* Espacio inferior */}
          <View style={styles.followSection}></View>
        </View>

        {/* Botones de edición y tema */}
        <View style={styles.buttonSection}>
          <Text style={[styles.locationText, darkMode && styles.darkText]}>
            Mostrar las ofertas de x usuario
            </Text>
          <Boton
            nombreB={darkMode ? 'Tema Claro' : 'Tema Oscuro'}
            onPress={toggleTheme}
            backgroundColor={darkMode ? '#888' : '#ddd'}
            textColor={darkMode ? '#fff' : '#000'}
          />
        </View>
        
      </SafeAreaView>
    </themeContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20, // más arriba
  },
  lightContainer: {
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#111',
  },
  portadaImage: {
    width: '100%',
    height: 110,
    borderRadius: 10,
    backgroundColor: '#999',
  },
  profileImageWrapper: {
    position: 'absolute',
    top: 90, // Ajusta esto para mover la imagen hacia arriba o abajo
    left: 30,
    zIndex: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 100,
    borderColor: '#fff',
    borderWidth: 3,
    backgroundColor: '#999',
  },
  profileHeader: {
    marginTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  separator: {
    height: 2,
    width: '100%',
    backgroundColor: '#ccc',
    marginVertical: 12,
  },
  TextoSobremi: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 6,
  },
  descriptionBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: '#333',
  },
  locationBox: {
    marginTop: 6,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 16,
    color: '#555',
  },
  buttonSection: {
    marginTop: 'auto',
    paddingBottom: 40,
    gap: 12,
    paddingHorizontal: 20,
  },
  followSection: {
    marginTop: 10,
  },
  darkText: {
    color: '#fff',
  },
});
