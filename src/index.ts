import { getFirestore, connectFirestoreEmulator, addDoc, collection, DocumentData, onSnapshot } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

import { User } from './models/user';

// Firebase initialization.
const app = initializeApp({
  projectId: 'jscamp-example',
});
const db = getFirestore(app);
connectFirestoreEmulator(db, 'localhost', 5001);

const usersCollection = collection(db, 'users');

const tableBody = document.getElementById('table-body') as HTMLElement;

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
  return addDoc(usersCollection, user);
}

onSnapshot(usersCollection, {
  next(snapshot) {
    tableBody.innerHTML = '';
    const users = snapshot.docs.map<User>(doc => ({
      id: doc.id,
      ...doc.data() as User,
    }));

    for (const user of users) {
      const userRowElem = document.createElement('tr');
      userRowElem.appendChild(createUserFieldTd(user, 'id'));
      userRowElem.appendChild(createUserFieldTd(user, 'firstName'));
      userRowElem.appendChild(createUserFieldTd(user, 'lastName'));
      userRowElem.appendChild(createUserFieldTd(user, 'city'));
      userRowElem.appendChild(createUserFieldTd(user, 'country'));
      tableBody?.appendChild(userRowElem);
    }
  },
});

function createUserFieldTd(user: User, field: keyof User): HTMLTableCellElement {
  const value = user[field] ?? '';
  const tdElement = document.createElement('td');
  tdElement.textContent = value;
  return tdElement;
}
