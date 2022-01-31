import { getFirestore, connectFirestoreEmulator, addDoc, collection } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

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

  await saveUser(firstName, lastName);
  formElement.reset();
});

async function saveUser(firstName: string, lastName: string): Promise<void> {
  await addDoc(collection(db, 'users'), {
    firstName,
    lastName,
  });
}
