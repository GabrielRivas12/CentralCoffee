import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import { createDrawerNavigator } from '@react-navigation/drawer';
import 'react-native-gesture-handler';
import Feather from '@expo/vector-icons/Feather';


import Ofertas from './src/Screens/Ofertas/Ofertas';
import Mapa from './src/Screens/Map/Mapa';
import Asistente from './src/Screens/IA/Asistente';
import QRLista from './src/Screens/QR/QRLista';
import PerfilUsuario from './src/Screens/Perfil/PerfilUsuario';


function Navegacion(){
    return (
        <NavigationContainer>
            <DrawerNavigate />                
          
        </NavigationContainer>
    );
  }

  const Stack = createStackNavigator();

  function StackNavegacion(){
    return(
        <Stack.Navigator initialRouteName='Ofertas'>
            <Stack.Screen name='Ofertas' component={Ofertas} />
            <Stack.Screen name='IA' component={Asistente} />
             <Stack.Screen name='Mapa' component={Mapa} />
            <Stack.Screen name='QR' component={QRLista} />
            <Stack.Screen name='PerfilUsuario' component={PerfilUsuario} />

        </Stack.Navigator>
    )
  }

  const Drawer = createDrawerNavigator();

function DrawerNavigate(){
    return(
        <Drawer.Navigator initialRouteName='Ofertas'>
            <Drawer.Screen name="Ofertas" component={Ofertas} 
            options={{
                drawerIcon: ({ color, size }) => (
                  <Feather name="user" size={15} color={color} />
                )
              }}
            />
            <Drawer.Screen name="IA" component={Asistente} 
            options={{
                drawerIcon: ({ color, size }) => (
                  <Feather name="file-text" size={15} color={color} />
                )
              }}/>
            <Drawer.Screen name="Mapa" component={Mapa} 
             options={{
                drawerIcon: ({ color, size }) => (
                  <Feather name="layers" size={15} color={color} />
                )
              }}/>

             <Drawer.Screen name="QR" component={QRLista} 
             options={{
                drawerIcon: ({ color, size }) => (
                  <Feather name="layers" size={15} color={color} />
                )
              }}/>
               <Drawer.Screen name="PerfilUsuario" component={PerfilUsuario} 
             options={{
                drawerIcon: ({ color, size }) => (
                  <Feather name="layers" size={15} color={color} />
                )
              }}/>
            
        </Drawer.Navigator>
    )

}


export default Navegacion;
