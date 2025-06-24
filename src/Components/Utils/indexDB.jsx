import { openDB } from 'idb';
import CryptoJS from 'crypto-js';

const DB_NAME = 'BalasilksDB';
const STORE_NAME = 'balasilks';
const SECRET_KEY = '123456';

// Initialize DB
export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
};






// Encrypt data
const encryptData = async (data) => {
  try {

    const jsonData = JSON.stringify(data);


    const encrypted = await CryptoJS.AES.encrypt(jsonData, SECRET_KEY).toString();


    return encrypted;
  } catch (error) {
    console.error("Encryption error:", error);
    return null;
  }
};

// Decrypt data
const decryptData = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedData);
};

// Generic Save
const saveEncryptedData = async (key, data) => {

  const db = await initDB();

  const encrypted = await encryptData(data);

  await db.put(STORE_NAME, encrypted, key);
};

// Generic Get
const getDecryptedData = async (key) => {
  const db = await initDB();
  const encrypted = await db.get(STORE_NAME, key);
  if (!encrypted) return null;
  return decryptData(encrypted);
};

export const savePendingPOs = async (data) => {
  await saveEncryptedData('pendingPOs', data);
};





// Save Functions
export const saveUserDataToBalaSilksDB = (data) => saveEncryptedData('currentUser', data);
export const saveBranchDataToBalaSilksDB = (data) => saveEncryptedData('branchData', data);
export const saveSelectedBranchToBalaSilksDB = (data) => saveEncryptedData('selectedBranchId', data);
export const saveSelectedBranchNameToBalaSilksDB = (data) => saveEncryptedData('selectedBranchName', data);
export const saveSelectedBranchCryptToBalaSilksDB = (data) => saveEncryptedData('selectedBranchIdCrypt', data);
export const saveRolesToBalaSilksDB = (data) => saveEncryptedData('roles', data);
export const savePermissionsToBalaSilksDB = (data) => saveEncryptedData('permissions', data);
export const savePendingPOsData = (data) => savePendingPOs(data);



// Get Functions
export const getUserDataFromBalaSilksDB = () => getDecryptedData('currentUser');
export const getBranchDataFromBalaSilksDB = () => getDecryptedData('branchData');
export const getSelectedBranchFromBalaSilksDB = () => getDecryptedData('selectedBranchId');
export const getSelectedBranchNameFromBalaSilksDB = () => getDecryptedData('selectedBranchName');
export const getSelectedBranchCryptFromBalaSilksDB = () => getDecryptedData('selectedBranchIdCrypt');
export const getRolesFromBalaSilksDB = () => getDecryptedData('roles');
export const getPermissionsFromBalaSilksDB = () => getDecryptedData('permissions');
export const getDecryptedPosData = () => getDecryptedData('pendingPOs');



// Remove
export const removeUserDataFromBalaSilksDB = async () => {
  const db = await initDB();
  await db.delete(STORE_NAME, 'currentUser');
  await db.delete(STORE_NAME, 'branchData');
  await db.delete(STORE_NAME, 'selectedBranchId');
  await db.delete(STORE_NAME, 'selectedBranchName');
  await db.delete(STORE_NAME, 'selectedBranchIdCrypt');
  await db.delete(STORE_NAME, 'roles');
  await db.delete(STORE_NAME, 'permissions');
};

export const removeAllDataFromBalaSilksDB = async () => {
  const db = await initDB();
  const keys = await db.getAllKeys(STORE_NAME);
  for (let key of keys) {
    await db.delete(STORE_NAME, key);
  }
};
