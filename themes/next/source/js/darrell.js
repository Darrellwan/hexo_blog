var currentValue = "";

function getLocalStorageFirebaseToken() {
    var userFirebaseId = '';
    if (localStorage.getItem('currentToken')) {
        userFirebaseId = localStorage.getItem('currentToken');
    }
    return userFirebaseId;
}

async function getCurrentUrl() {
    var currentUrl = window.location.href;
    var currentEmail = currentUrl.split('?')[1];
    return currentEmail;
}

function handleCurrentValueExist(currentValue, firebaseToken) {
    updateUserBrowserToken(currentValue, firebaseToken);
}

function handleCurrentValueNull(currentValue, firebaseToken) {
    var placeholderEmail = currentValue.split('&')[1];
    updateUserBrowserToken(placeholderEmail, firebaseToken);
}

var cookieValue = "";

async function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";Path=/; domain=allyoung.com.tw;";
}

const getNotificationStatus = async () => {
    var cname = "notificationStatus";
    if (Notification.permission == "default") {
        cookieValue = "default";
        await setCookie(cname, cookieValue, 365);
    }
    else if (Notification.permission == "denied") {
        cookieValue = "denied";
        await setCookie(cname, cookieValue, 365);
    }
    else if (Notification.permission == "granted") {
        cookieValue = "granted";
        await setCookie(cname, cookieValue, 365);
    }
}

const updateUserBrowserToken = async (currentValue, firebaseToken) => {
    if(!currentValue){
        console.log(`updateUserBrowserToken currentValue wrong ${currentValue}`)
    }
    return false;

    var cname = "browserTokens";
    cookieValue = firebaseToken;
    await setCookie(cname, cookieValue, 365);

    var data = {
        "email": currentValue,
        "browserToken": firebaseToken
    }
    fetch ('https://api.iterable.com/api/users/registerBrowserToken', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
            'Api_Key': 'f70dde2f1d614c28848538c1e0077735',
            'Content-Type': 'application/json'
        })
    })
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => console.log('Success:', response));
}


function main() {
    getNotificationStatus();
    var firebaseToken = getLocalStorageFirebaseToken();
    var currentValue = getCurrentUrl();
    var regex = /.?__lt__cid/gm;
    var result = regex.test(currentValue);
    if (result == true && firebaseToken != "") {
        handleCurrentValueNull(currentValue, firebaseToken);
    }
    else if (firebaseToken != "") {
        handleCurrentValueExist(currentValue, firebaseToken);
    }
    else {
        console.log('NOT ENTER ANY');
    }
}

function sendTokenToServer(currentToken) {
    localStorage.setItem('currentToken', currentToken);
    if (!isTokenSentToServer()) {
      console.log('Sending token to server...');
      // TODO(developer): Send the current token to your server.
      setTokenSentToServer(true);
      main();
      // should add
      closeWindow();
      console.log("window close");
    } else {
      console.log('Token already sent to server so won\'t send it again ' +
          'unless it changes');
      main();
      // should add
      closeWindow();
      console.log("window close");
    }
}
function showToken(currentToken) {
    // Show token in console and UI.
    const tokenElement = document.querySelector('#token');
    tokenElement.textContent = currentToken;
    console.log(currentToken);
  }

  // Send the registration token your application server, so that it can:
  // - send messages back to this app
  // - subscribe/unsubscribe the token from topics
  function sendTokenToServer(currentToken) {
    localStorage.setItem('currentToken', currentToken);
    if (!isTokenSentToServer()) {
      console.log('Sending token to server...');
      // TODO(developer): Send the current token to your server.
      setTokenSentToServer(true);
      main();
      // should add
      closeWindow();
      console.log("window close");
    } else {
      console.log('Token already sent to server so won\'t send it again ' +
          'unless it changes');
      main();
      // should add
      closeWindow();
      console.log("window close");
    }
  }

  function isTokenSentToServer() {
    return window.localStorage.getItem('sentToServer') === '1';
  }

  function setTokenSentToServer(sent) {
    window.localStorage.setItem('sentToServer', sent ? '1' : '0');
    main();
    closeWindow();
  }

  function showHideDiv(divId, show) {
    const div = document.querySelector('#' + divId);
    if (show) {
      div.style = 'display: visible';
    } else {
      div.style = 'display: none';
    }
  }

  function closeWindow() {
    setTimeout(function() {
     //  window.close();
    }, 500)
  }

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

    if('serviceWorker' in navigator) {   // 檢查browser有無支援serviceWorker
        navigator.serviceWorker.register('/firebase-messaging-sw.js').then(function() {   // register會回傳一個Promise
            console.log('Service worker registered!');
        });
    }

  "serviceWorker"in navigator && window.addEventListener("load", (()=>{
      messaging.getToken({vapidKey: 'BGUJBJ5eChMW3VfIyYOI_cQPeMS9Z78UgUuFO6jGPZej7PmzcPJ7e-0sSXl0VnTp5N55BrfIV0_t9ZrWr3CoIAw'}).then((currentToken) => {
        if (currentToken) {
        	console.log({currentToken: currentToken})
            // sendTokenToServer(currentToken);
            // updateUIForPushEnabled(currentToken);
          } else {
            // Show permission request.
            console.log('No registration token available. Request permission to generate one.');
            // Show permission UI.
            // updateUIForPushPermissionRequired();
            // setTokenSentToServer(false);
          }
        }).catch((err) => {
          console.log('An error occurred while retrieving token. ', err);
          // showToken('Error retrieving registration token. ', err);
          // setTokenSentToServer(false);
        });
  }))

  

                