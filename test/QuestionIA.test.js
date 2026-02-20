import { containsForbiddenTopic } from '../src/Containers/IALogic';

// Mock de console.log para evitar el ruido
jest.spyOn(console, 'log').mockImplementation(() => {});

describe('Pruebas de Caja Blanca - Lógica de Restricciones IA', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Test Case P06: Validar restricciones de temas del asistente IA', () => {
    
    test('P06-001: Caso principal - Una pregunta de café y una no café', () => {
      // Arrange - Preguntas de prueba
      const preguntaCafe = 'café de nicaragua';
      const preguntaNoCafe = 'como quedo el barcelona vs real madrid';

      // Act
      const resultadoCafe = containsForbiddenTopic(preguntaCafe);
      const resultadoNoCafe = containsForbiddenTopic(preguntaNoCafe);

      // Assert
      console.log('=== RESULTADOS DE PRUEBA ===');
      console.log(`Pregunta CAFÉ: "${preguntaCafe}"`);
      console.log(`¿Es prohibida? ${resultadoCafe}`);
      console.log(`Pregunta NO CAFÉ: "${preguntaNoCafe}"`);
      console.log(`¿Es prohibida? ${resultadoNoCafe}`);
      console.log('============================');
      
      // Verificar que la de café NO es prohibida
      expect(resultadoCafe).toBe(false);
      
      // Verificar que la de NO café SÍ es prohibida  
      expect(resultadoNoCafe).toBe(true);
    });

    test('P06-002: Probar diferentes tipos de preguntas no permitidas', () => {
      // Arrange
      const preguntasProhibidas = [
        'programación en javascript',
        'elecciones políticas',
        'películas de acción',
        'música rock',
        'videojuegos'
      ];

      // Act & Assert
      preguntasProhibidas.forEach((pregunta, index) => {
        const resultado = containsForbiddenTopic(pregunta);
        console.log(`Pregunta prohibida ${index + 1}: "${pregunta}" - ¿Bloqueada? ${resultado}`);
        
        // Todas deberían ser bloqueadas
        expect(resultado).toBe(true);
      });
    });

    test('P06-003: Probar diferentes tipos de preguntas permitidas', () => {
      // Arrange
      const preguntasPermitidas = [
        'cultivo de café',
        'tueste del café',
        'exportación de café',
        'variedades de café',
        'calidad del café'
      ];

      // Act & Assert
      preguntasPermitidas.forEach((pregunta, index) => {
        const resultado = containsForbiddenTopic(pregunta);
        console.log(`Pregunta permitida ${index + 1}: "${pregunta}" - ¿Permitida? ${!resultado}`);
        
        // Todas deberían ser permitidas (no prohibidas)
        expect(resultado).toBe(false);
      });
    });
  });
});