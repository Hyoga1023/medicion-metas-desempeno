import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js';

const firebaseConfig = {
  apiKey: "AIzaSyCYwgJ3BY7g1B0rjXLpgSR1Xv51NjJrGY0",
  authDomain: "medicion-correos-inhouse.firebaseapp.com",
  projectId: "medicion-correos-inhouse",
  storageBucket: "medicion-correos-inhouse.firebasestorage.app",
  messagingSenderId: "1048780674359",
  appId: "1:1048780674359:web:d8de74e35cffb5bda176b2",
  measurementId: "G-VSV7HN0CH0"
};

const app = initializeApp(firebaseConfig);

// Analytics solo si es navegador
if (typeof window !== 'undefined') {
  const analytics = getAnalytics(app);
}

export default app;