import { getFirestore, connectFirestoreEmulator, addDoc, collection, DocumentData } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

import { User } from './models/user';

// Firebase initialization.
const app = initializeApp({
  projectId: 'jscamp-example',
});
const db = getFirestore(app);
connectFirestoreEmulator(db, 'localhost', 5001);

// Form submission handling.
const form = document.getElementById('user-form');
form?.addEventListener('submit', async event => {
  event.preventDefault();

  const formElement = event.target as HTMLFormElement;
  const formData = new FormData(formElement);

  const firstName = String(formData.get('firstName'));
  const lastName = String(formData.get('lastName'));
  const city = String(formData.get('city'));
  const country = String(formData.get('country'));

  const user: User = {
    firstName,
    lastName,
    city,
    country,
  };

  await saveUser(user);
  formElement.reset();
});

function saveUser(user: User): Promise<DocumentData> {
  return addDoc(collection(db, 'users'), user);
}
