// FIX: Update Firebase imports to v8 compat syntax to resolve module errors.
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/functions';

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
// FIX: Use v8 initialization syntax.
const app = firebase.initializeApp(firebaseConfig);

// Get Firebase services
// FIX: Use v8 service getter syntax.
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
const functions = firebase.functions();

export { app, auth, db, storage, functions };


/*
=================================================
  Firebase Security Rules
=================================================

Copy and paste these rules into your Firebase project console.
Go to Firestore Database > Rules and Storage > Rules.

-------------------------------------------------
Firestore Rules (`firestore.rules`)
-------------------------------------------------

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Inspections can only be created by authenticated users.
    // Users can only read/update/delete their own inspection documents.
    match /inspections/{inspectionId} {
      allow read, update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}

-------------------------------------------------
Firebase Storage Rules (`storage.rules`)
-------------------------------------------------

rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Files can only be uploaded by authenticated users into a path that contains their UID.
    // Users can only read/write their own files.
    match /inspections/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}

*/