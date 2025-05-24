import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import Ofertas from './src/Screens/Ofertas/Ofertas';
import IA from './src/Screens/IA/Asistente'
import Mapa from './src/Screens/Map/Mapa';
import QR from './src/Screens/QR/QRLista';
import Perfil from './src/Screens/Perfil/PerfilUsuario'
import Asistente from './src/Screens/IA/Asistente';
import QRLista from './src/Screens/QR/QRLista';
import PerfilUsuario from './src/Screens/Perfil/PerfilUsuario';


function Navegacion(){
    return (
        <NavigationContainer>
            <StackNavegacion />
                
          
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

export default Navegacion;
