#  CentralCoffee

CentralCoffee es una aplicación móvil desarrollada para conectar **productores y compradores de café**. Los usuarios pueden explorar ofertas, visualizar perfiles, chatear, ubicar centros de acopio en el mapa y registrar la trazabilidad de su producción.

---

## 📱 Características principales

- 📦 Ver y publicar ofertas de café  
- 👤 Visualización de perfil (propio y de otros usuarios)  
- 💬 Sistema de chat integrado  
- 📍 Geolocalización de puntos de producción o centros de acopio  
- 🔐 Generación de códigos QR para registrar la trazabilidad de los lotes de café  
- 🧠 Asistente inteligente (IA) integrado para acompañar al usuario en sus procesos  
- 🌱 Escaneo de cultivo con IA para detectar deficiencias en las plantas de café mediante imágenes  

## 🛠️ Requerimientos técnicos

- **Node.js** >= 20.20.0 LTS
- **Expo-cli**: SDK 53
```bash
npm install -g expo-cli
```
- **Android Studio**: 2025.1.2
- **Android SDK**: 35
- **NDK**: 26.1.10909125
- **Cmake**: 3.22.1

## Android (mínimos recomendados):

- Android 8.0 o superior

- 4 GB de RAM

- 500MB de Almacenamiento

- Cámara funcional

- Servicios de Ubicación

- Conexión a internet

## ⚙️ Instalación


Instala las dependencias:

    npm install


Ejecuta la app con expo:

    npx expo start


Utilizar build nativa en android:

    expo prebuil

Limpiar y compilar el proyecto

    cd android
    .\gradlew clean
    cd ..

Ejecutar build nativa:

    npx expo run:android
