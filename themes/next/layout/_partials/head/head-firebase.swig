<script src="https://www.gstatic.com/firebasejs/8.8.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.8.1/firebase-messaging.js"></script>
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

  messaging.getToken({vapidKey: 'BGUJBJ5eChMW3VfIyYOI_cQPeMS9Z78UgUuFO6jGPZej7PmzcPJ7e-0sSXl0VnTp5N55BrfIV0_t9ZrWr3CoIAw'}).then((currentToken) => {
  if (currentToken) {
      sendTokenToServer(currentToken);
      // updateUIForPushEnabled(currentToken);
    } else {
      // Show permission request.
      console.log('No registration token available. Request permission to generate one.');
      // Show permission UI.
      // updateUIForPushPermissionRequired();
      setTokenSentToServer(false);
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // showToken('Error retrieving registration token. ', err);
    setTokenSentToServer(false);
  });
</script>