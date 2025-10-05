import { useEffect } from 'react';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';
import { usarTema } from './TemaApp';

const NavTema = () => {
  const { modoOscuro } = usarTema();

useEffect(() => {
  const actualizarBarraNavegacion = async () => {
    try {
      await NavigationBar.setButtonStyleAsync(modoOscuro ? 'light' : 'dark');
    } catch (e) {
      console.log('Error actualizando barra de navegación:', e);
    }
  };

  actualizarBarraNavegacion();
}, [modoOscuro]);


  return (
    <StatusBar
      style={modoOscuro ? 'light' : 'dark'}
      translucent
    />
  );
};

export default NavTema;
