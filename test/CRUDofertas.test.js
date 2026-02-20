import { EliminarOferta } from '../src/Containers/EliminarOferta';
import { Guardar } from '../src/Containers/GuardarOferta';
import { Alert } from 'react-native';

// Mock de AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock de react-native
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn()
  },
  Platform: {
    OS: 'ios'
  }
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getFirestore: jest.fn(),
  query: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  deleteDoc: jest.fn(),
  updateDoc: jest.fn(),
  where: jest.fn(),
  addDoc: jest.fn()
}));

// Mock de Firebase
jest.mock('../src/Services/Firebase', () => ({
  __esModule: true,
  default: {
    // Mock de la app de Firebase
  }
}));

// Mock de Supabase (si lo usas)
jest.mock('../src/Services/SupaBase', () => ({
  supabase: {
    storage: {
      from: jest.fn(() => ({
        remove: jest.fn()
      }))
    }
  }
}));

// Mock de datos de prueba
const mockOferta = {
  id: '1',
  titulo: 'Café Arabica Premium',
  tipoCafe: 'Arabica',
  variedad: 'Bourbon',
  estadoGrano: 'Verde',
  clima: 'Templado',
  altura: '1200',
  procesoCorte: 'Manual',
  fechaCosecha: '2024-11-01',
  cantidadProduccion: '1000',
  ofertaLibra: 25,
  imagen: 'https://ejemplo.com/cafe_arabica.jpg',
  estado: 'Activo',
  userId: 'user123',
  lugarSeleccionado: 'lugar_abc123' // ← Cambiado a ID de Firestore
};

const mockAuth = {
  currentUser: {
    uid: 'user123'
  }
};

const mockDb = {};
const mockNavigation = {
  goBack: jest.fn()
};
const mockLeerDatos = jest.fn();

describe('Pruebas de Caja Blanca - Funciones CRUD Mis Ofertas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test Case P05 - Validar funciones CRUD
  describe('Test Case P05: Validar funciones CRUD de Mis ofertas', () => {
    
    describe('P05-001: Probar función Guardar', () => {
      
      test('Debe crear nueva oferta exitosamente', async () => {
        // Arrange
        const { addDoc } = require('firebase/firestore');
        addDoc.mockResolvedValue();

        // Act
        await Guardar({
          Titulo: 'Café Nuevo',
          TipoCafe: 'Robusta',
          Variedad: 'Conilon',
          EstadoGrano: 'Tostado',
          Clima: 'Cálido',
          Altura: '800',
          ProcesoCorte: 'Mecánico',
          FechaCosecha: '2024-10-15',
          CantidadProduccion: '500',
          OfertaLibra: 20,
          imagen: 'https://ejemplo.com/nueva_imagen.jpg',
          ofertaEditar: null,
          auth: mockAuth,
          db: mockDb,
          navigation: mockNavigation,
          Estado: 'Activo',
          lugarSeleccionado: 'lugar_def456' // ← ID de Firestore
        });

        // Assert
        expect(addDoc).toHaveBeenCalled();
        expect(Alert.alert).toHaveBeenCalledWith('Éxito', 'Oferta guardada correctamente', expect.any(Array));
        
        console.log('Oferta creada exitosamente');
        const datosEnviados = addDoc.mock.calls[0][1];
        console.log('Datos enviados a Firebase:', datosEnviados);
      });

      test('Debe actualizar oferta existente exitosamente', async () => {
        // Arrange
        const { setDoc, doc } = require('firebase/firestore');
        setDoc.mockResolvedValue();
        // Mock de la referencia al documento
        const mockDocRef = {};
        doc.mockReturnValue(mockDocRef);

        // Act
        await Guardar({
          Titulo: 'Café Actualizado',
          TipoCafe: 'Arabica',
          Variedad: 'Bourbon',
          EstadoGrano: 'Verde',
          Clima: 'Templado',
          Altura: '1200',
          ProcesoCorte: 'Manual',
          FechaCosecha: '2024-11-01',
          CantidadProduccion: '1000',
          OfertaLibra: 30,
          imagen: 'https://ejemplo.com/existing_image.jpg',
          ofertaEditar: { id: '1' },
          auth: mockAuth,
          db: mockDb,
          navigation: mockNavigation,
          Estado: 'Activo',
          lugarSeleccionado: 'lugar_xyz789' // ← ID de Firestore
        });

        // Assert
        expect(setDoc).toHaveBeenCalledWith(mockDocRef, {
          titulo: 'Café Actualizado',
          tipoCafe: 'Arabica',
          variedad: 'Bourbon',
          estadoGrano: 'Verde',
          clima: 'Templado',
          altura: '1200',
          procesoCorte: 'Manual',
          fechaCosecha: '2024-11-01',
          cantidadProduccion: '1000',
          ofertaLibra: 30,
          imagen: 'https://ejemplo.com/existing_image.jpg',
          estado: 'Activo',
          userId: 'user123',
          lugarSeleccionado: 'lugar_xyz789' // ← ID de Firestore
        });
        expect(Alert.alert).toHaveBeenCalledWith('Actualizado', 'La oferta fue actualizada correctamente', expect.any(Array));
        
        console.log('Oferta actualizada exitosamente');
        const datosActualizados = setDoc.mock.calls[0][1];
        console.log('Datos actualizados:', datosActualizados);
      });
    });

    describe('P05-002: Probar función Guardar - Validaciones', () => {
      
      test('Debe mostrar error cuando faltan campos obligatorios', async () => {
        // Arrange & Act
        await Guardar({
          Titulo: '',
          TipoCafe: 'Arabica',
          Variedad: 'Bourbon',
          EstadoGrano: 'Verde',
          Clima: 'Templado',
          Altura: '1200',
          ProcesoCorte: 'Manual',
          FechaCosecha: '2024-11-01',
          CantidadProduccion: '1000',
          OfertaLibra: 25,
          imagen: 'https://ejemplo.com/image.jpg',
          ofertaEditar: null,
          auth: mockAuth,
          db: mockDb,
          navigation: mockNavigation,
          Estado: 'Activo',
          lugarSeleccionado: null // Campo faltante
        });

        // Assert
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Todos los campos son obligatorios o Seleccione la ubicacion nuevamente');
        
        console.log('Validación de campos: ERROR mostrado correctamente - Campos faltantes detectados');
      });

      test('Debe mostrar error cuando imagen está vacía', async () => {
        // Arrange & Act
        await Guardar({
          Titulo: 'Café Test',
          TipoCafe: 'Arabica',
          Variedad: 'Bourbon',
          EstadoGrano: 'Verde',
          Clima: 'Templado',
          Altura: '1200',
          ProcesoCorte: 'Manual',
          FechaCosecha: '2024-11-01',
          CantidadProduccion: '1000',
          OfertaLibra: 25,
          imagen: '', // Imagen vacía
          ofertaEditar: null,
          auth: mockAuth,
          db: mockDb,
          navigation: mockNavigation,
          Estado: 'Activo',
          lugarSeleccionado: 'lugar_abc123' // ← ID de Firestore
        });

        // Assert
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Todos los campos son obligatorios o Seleccione la ubicacion nuevamente');
        
        console.log('Validación de campos: ERROR mostrado correctamente - Imagen vacía detectada');
      });
    });

    describe('P05-003: Probar función EliminarOferta', () => {
      
      test('Debe mostrar alerta de confirmación', async () => {
        // Arrange
        const { getDoc, deleteDoc } = require('firebase/firestore');
        getDoc.mockResolvedValue({
          data: () => mockOferta
        });
        deleteDoc.mockResolvedValue();

        // Act
        await EliminarOferta('1', mockLeerDatos);

        // Assert
        expect(Alert.alert).toHaveBeenCalledWith(
          'Confirmar eliminación',
          '¿Estás seguro de que deseas eliminar el registro?',
          expect.any(Array),
          { cancelable: true }
        );
        
        console.log('Alerta de confirmación mostrada correctamente');
      });

      test('Debe eliminar oferta cuando se confirma', async () => {
        // Arrange
        const { getDoc, deleteDoc, doc } = require('firebase/firestore');
        getDoc.mockResolvedValue({
          data: () => mockOferta
        });
        deleteDoc.mockResolvedValue();
        const mockDocRef = {};
        doc.mockReturnValue(mockDocRef);

        // Simular que se presiona "Eliminar" en el alert
        await EliminarOferta('1', mockLeerDatos);
        const alertCall = Alert.alert.mock.calls[0];
        const eliminarButton = alertCall[2][1]; // El botón "Eliminar"
        
        // Act
        await eliminarButton.onPress();

        // Assert
        expect(getDoc).toHaveBeenCalled();
        expect(deleteDoc).toHaveBeenCalledWith(mockDocRef);
        expect(mockLeerDatos).toHaveBeenCalled();
        
        console.log('Oferta eliminada exitosamente');
        console.log('ID de oferta eliminada:', '1');
      });

      test('Debe manejar error al eliminar oferta', async () => {
        // Arrange
        const { getDoc, deleteDoc, doc } = require('firebase/firestore');
        getDoc.mockResolvedValue({
          data: () => mockOferta
        });
        deleteDoc.mockRejectedValue(new Error('Error de Firebase'));
        const mockDocRef = {};
        doc.mockReturnValue(mockDocRef);

        // Simular que se presiona "Eliminar"
        await EliminarOferta('1', mockLeerDatos);
        const alertCall = Alert.alert.mock.calls[0];
        const eliminarButton = alertCall[2][1];
        
        // Act
        await eliminarButton.onPress();

        // Assert
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'No se pudo eliminar la oferta correctamente.');
        
        console.log('Error manejado correctamente al eliminar oferta');
      });
    });

    describe('P05-004: Probar estructura de datos', () => {
      
      test('Debe crear objeto nuevaOferta con estructura correcta', async () => {
        // Arrange
        const { setDoc, doc } = require('firebase/firestore');
        setDoc.mockResolvedValue();
        const mockDocRef = {};
        doc.mockReturnValue(mockDocRef);

        // Act
        await Guardar({
          Titulo: 'Café Test Estructura',
          TipoCafe: 'Arabica',
          Variedad: 'Bourbon',
          EstadoGrano: 'Verde',
          Clima: 'Templado',
          Altura: '1200',
          ProcesoCorte: 'Manual',
          FechaCosecha: '2024-11-01',
          CantidadProduccion: '1000',
          OfertaLibra: 25,
          imagen: 'https://ejemplo.com/test_image.jpg',
          ofertaEditar: { id: '1' },
          auth: mockAuth,
          db: mockDb,
          navigation: mockNavigation,
          Estado: 'Activo',
          lugarSeleccionado: 'lugar_test123'
        });

        // Assert
        const nuevaOferta = setDoc.mock.calls[0][1];
        
        console.log('Estructura de nuevaOferta:');
        console.log(nuevaOferta);
        
        // Verificar estructura completa
        expect(nuevaOferta).toEqual({
          titulo: 'Café Test Estructura',
          tipoCafe: 'Arabica',
          variedad: 'Bourbon',
          estadoGrano: 'Verde',
          clima: 'Templado',
          altura: '1200',
          procesoCorte: 'Manual',
          fechaCosecha: '2024-11-01',
          cantidadProduccion: '1000',
          ofertaLibra: 25,
          imagen: 'https://ejemplo.com/test_image.jpg',
          estado: 'Activo',
          userId: 'user123',
          lugarSeleccionado: 'lugar_test123' // ← ID de Firestore
        });
      });
    });
  });
});