<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCbDuQldDXIGUYwszFngMPz-dsSKac5shw",
    authDomain: "darrelltestiterable.firebaseapp.com",
    projectId: "darrelltestiterable",
    storageBucket: "darrelltestiterable.appspot.com",
    messagingSenderId: "712933270955",
    appId: "1:712933270955:web:f958378386628d950a9eee"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Initialize Firebase Cloud Messaging and get a reference to the service
  const messaging = firebase.messaging();
</script>