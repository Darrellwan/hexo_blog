// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
// importScripts('/__/firebase/9.2.0/firebase-app-compat.js');
// importScripts('/__/firebase/9.2.0/firebase-messaging-compat.js');
// importScripts('/__/firebase/init.js');
importScripts("https://www.gstatic.com/firebasejs/8.8.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.8.1/firebase-messaging.js");

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    if (event.notification && event.notification.data && event.notification.data.FCM_MSG && event.notification.data.FCM_MSG.notification) {
        const url = event.notification.data.FCM_MSG.notification.click_action;

        event.waitUntil(
            self.clients.matchAll({type: 'window'}).then( windowClients => {
                // Check if there is already a window/tab open with the target URL
                for (var i = 0; i < windowClients.length; i++) {
                    var client = windowClients[i];
                    // If so, just focus it.
                    if (client.url === url && 'focus' in client) {
                        return client.focus();
                    }
                }
                // If not, then open the target URL in a new window/tab.
                if (self.clients.openWindow) {
                    return self.clients.openWindow(url);
                }
            })
        )
    }
}, false);

firebase.initializeApp({
    apiKey: "AIzaSyCbDuQldDXIGUYwszFngMPz-dsSKac5shw",
    authDomain: "darrelltestiterable.firebaseapp.com",
    projectId: "darrelltestiterable",
    storageBucket: "darrelltestiterable.appspot.com",
    messagingSenderId: "712933270955",
    appId: "1:712933270955:web:f958378386628d950a9eee"
});
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] onBackgroundMessage message ', payload);
  // // Customize notification here
  // var notificationTitle = payload.data.title; //or payload.notification or whatever your payload is
  // var notificationOptions = {
  //   body: payload.data.body,
  //   icon: payload.data.icon,
  //   data: { url:payload.data.click_action }, //the url which we gonna use later
  //   actions: []
  // };
  // console.log({notificationTitle: notificationTitle});
  // console.log({notificationOptions: notificationOptions});
  // return self.registration.showNotification(notificationTitle,notificationOptions);
});
