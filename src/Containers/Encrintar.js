import CryptoJS from 'react-native-crypto-js';

const SECRET_KEY = 'tu_clave_secreta_32_caracteres!!!';

export const encryptText = (text) => {
  if (!text) return '';
  try {
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
  } catch (error) {
    console.error('Error al encriptar:', error);
    return text;
  }
};

export const decryptText = (encryptedText) => {
  if (!encryptedText) return '';
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || encryptedText; // Si está vacío, devuelve el original
  } catch (error) {
    console.error('Error al desencriptar:', error);
    return encryptedText;
  }
};

export const isEncrypted = (text) => {
  if (typeof text !== 'string') return false;
  // Verificación más simple para textos encriptados
  return text.length > 16 && text.includes('U2FsdGVkX1'); // Los textos AES suelen empezar así
};