const firebaseConfig = {

apiKey: "TU_API",

authDomain: "TU_AUTH",

projectId: "TU_ID",

storageBucket: "TU_BUCKET",

messagingSenderId: "TU_SENDER",

appId: "TU_APP"

};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

mostrar();