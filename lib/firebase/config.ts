import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCph_cKsUps-HipmNC7Rxo3t_rd2Vk5iwA',
  authDomain: 'ai-flow-web.firebaseapp.com',
  projectId: 'ai-flow-web',
  storageBucket: 'ai-flow-web.firebasestorage.app',
  messagingSenderId: '380600886403',
  appId: '1:380600886403:web:15687b6fbd3288263627b6',
};

// Guard against double-initialization in Next.js dev (hot reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
