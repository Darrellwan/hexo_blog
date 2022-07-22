// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
// importScripts('/__/firebase/9.2.0/firebase-app-compat.js');
// importScripts('/__/firebase/9.2.0/firebase-messaging-compat.js');
// importScripts('/__/firebase/init.js');
importScripts("https://www.gstatic.com/firebasejs/8.8.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.8.1/firebase-messaging.js");

// Initialize Firebase
// firebase.initializeApp(firebaseConfig);
firebase.initializeApp({
    apiKey: "AIzaSyCbDuQldDXIGUYwszFngMPz-dsSKac5shw",
    authDomain: "darrelltestiterable.firebaseapp.com",
    projectId: "darrelltestiterable",
    storageBucket: "darrelltestiterable.appspot.com",
    messagingSenderId: "712933270955",
    appId: "1:712933270955:web:f958378386628d950a9eee"
});
const messaging = firebase.messaging();

self.addEventListener('notificationclick', function(event) {
  console.log("notificationclick")
  console.log({event: event})
  var redirect_url = event.notification.data.click_action;
  console.log({redirect_url: redirect_url})
  event.notification.close();
  event.waitUntil(
    clients
      .matchAll({
        type: "window"
      })
      .then(function(clientList) {
        console.log(clientList);
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if (client.url === "/" && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(redirect_url);
        }
      })
  );
});

// FCM
messaging.setBackgroundMessageHandler(function(payload) {
  console.log("setBackgroundMessageHandler")
  console.log({payload: payload})
  // var data = payload.data;
  // var title = data.title;
  // var options = {
  //   body: data.body,
  //   icon: '/logo/logo192.png',
  //   badge: '/logo/logo192.png'
  // };
  // click_action = data.click_action;

  // return self.registration.showNotification(title, options);
});


messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // // Customize notification here
  var notificationTitle = payload.data.title; //or payload.notification or whatever your payload is
  var notificationOptions = {
    body: payload.data.body,
    icon: payload.data.icon,
    data: { url:payload.data.click_action }, //the url which we gonna use later
    actions: []
  };
  console.log({notificationTitle: notificationTitle});
  console.log({notificationOptions: notificationOptions});
  return self.registration.showNotification(notificationTitle,notificationOptions);
});