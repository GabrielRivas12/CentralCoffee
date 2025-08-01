import { View, Text, StyleSheet, TouchableOpacity, route } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import 'react-native-gesture-handler';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


import Ofertas from './src/Screens/Ofertas/Ofertas';
import Mapa from './src/Screens/Map/Mapa';
import Asistente from './src/Screens/IA/Asistente';
import QRLista from './src/Screens/QR/QRLista';
import PerfilUsuario from './src/Screens/Perfil/PerfilUsuario';
import DetallesOferta from './src/Screens/Ofertas/DetallesOfertas';
import CrearOferta from './src/Screens/Ofertas/CrearOferta';
import DetallesMapa from './src/Screens/Map/DetallesMapa';
import Perfil from './src/Screens/Perfil/Perfil';
import EditarPerfil from './src/Screens/Perfil/EditarPerfil';
import Login from './src/Screens/Login/InicioSesion';
import Registro from './src/Screens/Login/Registro';
import CrearMarcador from './src/Screens/Map/CrearMarcador';
import EditarOfertas from './src/Screens/Ofertas/EditarOfertas';

function Navegacion() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Registro" component={Registro} />
                <Stack.Screen name="DrawerNavigate" component={DrawerNavigate} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}


const Stack = createStackNavigator();





const Drawer = createDrawerNavigator();

function DrawerNavigate() {
    return (
        <Drawer.Navigator
            initialRouteName='Ofertas'
            drawerContent={props => <CustomDrawerContent {...props} />}
            screenOptions={({ route }) => {
                const routeName = getFocusedRouteNameFromRoute(route) ?? '';

                const showHeader =
                    (route.name === 'Ofertas' && (routeName === 'ScreenOfertas' || routeName === '')) ||
                    (route.name === 'Gestionar Ofertas' && (routeName === 'ScreenEditar' || routeName === '')) ||
                    (route.name === 'IA' && (routeName === 'Asistente' || routeName === '')) ||
                    (route.name === 'Mapa' && (routeName === 'ScreenMapa' || routeName === '')) ||
                    (route.name === 'Perfil' && (routeName === 'ScreenUsuario' || routeName === '')) ||
                    (route.name === 'QR' && (routeName === 'ScreenQR' || routeName === ''));
                return {
                    headerShown: showHeader,
                    headerStyle: {
                        backgroundColor: '#ED6D4A',
                    },
                    drawerActiveTintColor: '#666',
                    drawerInactiveTintColor: '#666',
                    drawerActiveBackgroundColor: '#ffdfd7ff',
                    drawerLabelStyle: {
                        fontSize: 16,
                    },
                };
            }}
        >

            <Drawer.Screen name="Ofertas" component={StackOfertas}
                options={{
                    drawerIcon: ({ color, size }) =>
                        <Feather name="tag" size={15} color={color} />,
                }}
            />
            <Drawer.Screen name="Gestionar Ofertas" component={StackEditar}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Feather name="edit" size={15} color={color} />
                    )
                }} />
            <Drawer.Screen name="IA" component={Asistente}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Feather name="cpu" size={15} color={color} />
                    )
                }} />
            <Drawer.Screen name="Mapa" component={StackMapa}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Feather name="map" size={15} color={color} />
                    )
                }} />

            <Drawer.Screen name="QR" component={StackQR}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Feather name="layers" size={15} color={color} />
                    ),

                        headerRight: () => (
                        <TouchableOpacity
                            onPress={() => {
                                console.log('Botón del header derecho');
                            }}
                            style={{ marginRight: 15 }}
                        >
                           <MaterialCommunityIcons name="qrcode-scan" size={24} color="black" />
                        </TouchableOpacity>
                    ),
                }} />
            <Drawer.Screen name="Perfil" component={StackUsuario}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Feather name="user" size={15} color={color} />
                    )
                }} />
        </Drawer.Navigator>
    )
}

function CustomDrawerContent(props) {
    return (
        <DrawerContentScrollView {...props}>
            <View style={{ padding: 20 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
                    Central Coffee
                </Text>
            </View>
            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    );
}

function StackOfertas() {
    return (
        <Stack.Navigator initialRouteName='ScreenOfertas'

            screenOptions={({ route }) => ({
                headerShown: route.name !== 'ScreenOfertas',
                headerStyle: {
                    backgroundColor: '#ED6D4A', // color header
                },
            })}

        >
            <Stack.Screen name='ScreenOfertas' component={Ofertas} />
            <Stack.Screen name='Crear' component={CrearOferta} />
            <Stack.Screen name='Informacion' component={DetallesOferta} />


        </Stack.Navigator>
    )
}

function StackEditar() {
    return (
        <Stack.Navigator initialRouteName='ScreenEditar'

            screenOptions={({ route }) => ({
                headerShown: route.name !== 'ScreenEditar',
                headerStyle: {
                    backgroundColor: '#ED6D4A', // color header
                },
            })}

        >
            <Stack.Screen name='ScreenEditar' component={EditarOfertas} />
            <Stack.Screen name='Crear' component={CrearOferta} />
            <Stack.Screen name='Informacion' component={DetallesOferta} />


        </Stack.Navigator>
    )
}

function StackMapa() {
    return (
        <Stack.Navigator initialRouteName='ScreenMapa'

            screenOptions={({ route }) => ({
                headerShown: route.name !== 'ScreenMapa',
                headerStyle: {
                    backgroundColor: '#ED6D4A', // color header
                },
            })}

        >
            <Stack.Screen name='ScreenMapa' component={Mapa} />
            <Stack.Screen name='Más Información' component={DetallesMapa} />
            <Stack.Screen name='Crear Marcador' component={CrearMarcador} />

        </Stack.Navigator>
    )
}

function StackQR() {
    return (
        <Stack.Navigator initialRouteName='ScreenQR'

            screenOptions={({ route }) => ({
                headerShown: route.name !== 'ScreenQR',
                headerStyle: {
                    backgroundColor: '#ED6D4A', // color header
                },
            })}

        >
            <Stack.Screen name='ScreenQR' component={QRLista} />
             <Stack.Screen name='Informacion' component={DetallesOferta} />

        </Stack.Navigator>
    )
}

function StackUsuario() {
    return (
        <Stack.Navigator initialRouteName='ScreenUsuario'

            screenOptions={({ route }) => ({
                headerShown: route.name !== 'ScreenUsuario',
                headerStyle: {
                    backgroundColor: '#ED6D4A', // color header
                },
            })}

        >
            <Stack.Screen name='ScreenUsuario' component={PerfilUsuario} />
            <Stack.Screen name='Editar Informacion' component={EditarPerfil} />
            <Stack.Screen name='Mi Perfil' component={Perfil} />

        </Stack.Navigator>
    )
}


function Stacklogin() {
    return (
        <Stack.Navigator initialRouteName='ScreenLogin'

            screenOptions={({ route }) => ({
                headerShown: route.name !== 'ScreenLogin',
                headerStyle: {
                    backgroundColor: '#ED6D4A', // color header
                },
            })}

        >
            <Stack.Screen name='ScreenLogin' component={Login} />

        </Stack.Navigator>
    )
}

export default Navegacion;
