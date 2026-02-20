import { IniciarLogin } from '../src/Containers/IniciarSesion';
import { Alert } from 'react-native';
import { 
  signInWithEmailAndPassword, 
  sendEmailVerification, 
  signOut 
} from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Mock de las dependencias
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn()
  }
}));

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  sendEmailVerification: jest.fn(),
  signOut: jest.fn()
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn()
}));

// Mock de datos de prueba
const mockAuth = {
  currentUser: null
};

const mockSetUser = jest.fn();
const mockNavigation = {
  replace: jest.fn()
};

const mockUserVerified = {
  uid: 'user123',
  email: 'test@example.com',
  emailVerified: true
};

const mockUserUnverified = {
  uid: 'user123', 
  email: 'test@example.com',
  emailVerified: false
};

const mockUserData = {
  uid: 'user123',
  nombre: 'Test User',
  email: 'test@example.com',
  rol: 'Usuario'
};

describe('Pruebas de Caja Blanca - Función de Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Test Case P07: Validar función de login', () => {
    
    describe('P07-001: Probar validaciones de campos', () => {
      
      test('Debe mostrar error cuando email está vacío', async () => {
        // Arrange
        const email = '';
        const password = 'password123';

        // Act
        await IniciarLogin(mockAuth, email, password, mockSetUser, mockNavigation);

        // Assert
        expect(Alert.alert).toHaveBeenCalledWith(
          'Campos incompletos', 
          'Por favor ingresa tu correo y contraseña'
        );
        
        console.log('✅ Validación de campos vacíos funciona correctamente');
      });

      test('Debe mostrar error cuando password está vacío', async () => {
        // Arrange
        const email = 'test@example.com';
        const password = '';

        // Act
        await IniciarLogin(mockAuth, email, password, mockSetUser, mockNavigation);

        // Assert
        expect(Alert.alert).toHaveBeenCalledWith(
          'Campos incompletos', 
          'Por favor ingresa tu correo y contraseña'
        );
        
        console.log('✅ Validación de password vacío funciona correctamente');
      });
    });

    describe('P07-002: Probar login exitoso con usuario verificado', () => {
      
      test('Debe completar login exitosamente', async () => {
        // Arrange
        const email = 'test@example.com';
        const password = 'password123';
        
        signInWithEmailAndPassword.mockResolvedValue({
          user: mockUserVerified
        });
        
        getDoc.mockResolvedValue({
          exists: () => true,
          data: () => mockUserData
        });

        // Act
        await IniciarLogin(mockAuth, email, password, mockSetUser, mockNavigation);

        // Assert
        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(mockAuth, email, password);
        expect(getDoc).toHaveBeenCalled();
        expect(mockSetUser).toHaveBeenCalledWith({
          uid: 'user123',
          ...mockUserData
        });
        expect(mockNavigation.replace).toHaveBeenCalledWith('DrawerPrincipal');
        
        console.log('✅ Login exitoso con usuario verificado funciona correctamente');
        console.log('Datos del usuario:', { uid: 'user123', ...mockUserData });
      });
    });

    describe('P07-003: Probar usuario no verificado', () => {
      
      test('Debe manejar usuario no verificado y mostrar alerta', async () => {
        // Arrange
        const email = 'test@example.com';
        const password = 'password123';
        
        signInWithEmailAndPassword.mockResolvedValue({
          user: mockUserUnverified
        });
        signOut.mockResolvedValue();

        // Act
        await IniciarLogin(mockAuth, email, password, mockSetUser, mockNavigation);

        // Assert
        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(mockAuth, email, password);
        expect(signOut).toHaveBeenCalled();
        expect(Alert.alert).toHaveBeenCalledWith(
          'Verificación requerida',
          'Debes verificar tu correo electrónico antes de iniciar sesión.',
          expect.any(Array)
        );
        
        console.log('✅ Manejo de usuario no verificado funciona correctamente');
      });

      test('Debe permitir reenviar correo de verificación', async () => {
        // Arrange
        const email = 'test@example.com';
        const password = 'password123';
        
        signInWithEmailAndPassword
          .mockResolvedValueOnce({ user: mockUserUnverified }) // Primer login
          .mockResolvedValueOnce({ user: mockUserUnverified }); // Reautenticación para reenviar
        
        sendEmailVerification.mockResolvedValue();
        signOut.mockResolvedValue();

        // Act - Ejecutar login
        await IniciarLogin(mockAuth, email, password, mockSetUser, mockNavigation);
        
        // Simular presionar "Reenviar correo"
        const alertCall = Alert.alert.mock.calls.find(call => 
          call[0] === 'Verificación requerida'
        );
        const reenviarButton = alertCall[2][0]; // Botón "Reenviar correo"
        
        await reenviarButton.onPress();

        // Assert
        expect(signInWithEmailAndPassword).toHaveBeenCalledTimes(2);
        expect(sendEmailVerification).toHaveBeenCalled();
        expect(signOut).toHaveBeenCalledTimes(2);
        expect(Alert.alert).toHaveBeenCalledWith('Correo enviado', 'Se ha reenviado el correo de verificación.');
        
        console.log('✅ Reenvío de correo de verificación funciona correctamente');
      });
    });

    describe('P07-004: Probar manejo de errores de Firebase', () => {
      
      test('Debe manejar error de contraseña incorrecta', async () => {
        // Arrange
        const email = 'test@example.com';
        const password = 'wrongpassword';
        
        const error = new Error('Wrong password');
        error.code = 'auth/wrong-password';
        signInWithEmailAndPassword.mockRejectedValue(error);

        // Act
        await IniciarLogin(mockAuth, email, password, mockSetUser, mockNavigation);

        // Assert
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Contraseña incorrecta');
        expect(mockSetUser).toHaveBeenCalledWith(null);
        
        console.log('✅ Manejo de error de contraseña incorrecta funciona correctamente');
      });

      test('Debe manejar error de usuario no encontrado', async () => {
        // Arrange
        const email = 'nonexistent@example.com';
        const password = 'password123';
        
        const error = new Error('User not found');
        error.code = 'auth/user-not-found';
        signInWithEmailAndPassword.mockRejectedValue(error);

        // Act
        await IniciarLogin(mockAuth, email, password, mockSetUser, mockNavigation);

        // Assert
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'No existe una cuenta con este correo');
        expect(mockSetUser).toHaveBeenCalledWith(null);
        
        console.log('✅ Manejo de error de usuario no encontrado funciona correctamente');
      });

      test('Debe manejar error de email inválido', async () => {
        // Arrange
        const email = 'invalid-email';
        const password = 'password123';
        
        const error = new Error('Invalid email');
        error.code = 'auth/invalid-email';
        signInWithEmailAndPassword.mockRejectedValue(error);

        // Act
        await IniciarLogin(mockAuth, email, password, mockSetUser, mockNavigation);

        // Assert
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'El correo electrónico no es válido');
        
        console.log('✅ Manejo de error de email inválido funciona correctamente');
      });

      test('Debe manejar error de demasiados intentos', async () => {
        // Arrange
        const email = 'test@example.com';
        const password = 'password123';
        
        const error = new Error('Too many requests');
        error.code = 'auth/too-many-requests';
        signInWithEmailAndPassword.mockRejectedValue(error);

        // Act
        await IniciarLogin(mockAuth, email, password, mockSetUser, mockNavigation);

        // Assert
        expect(Alert.alert).toHaveBeenCalledWith(
          'Error', 
          'Demasiados intentos fallidos. Intenta más tarde'
        );
        
        console.log('✅ Manejo de error de demasiados intentos funciona correctamente');
      });

      test('Debe manejar error genérico', async () => {
        // Arrange
        const email = 'test@example.com';
        const password = 'password123';
        
        const error = new Error('Some random error');
        error.code = 'auth/random-error';
        signInWithEmailAndPassword.mockRejectedValue(error);

        // Act
        await IniciarLogin(mockAuth, email, password, mockSetUser, mockNavigation);

        // Assert
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Some random error');
        
        console.log('✅ Manejo de error genérico funciona correctamente');
      });
    });
  });
});