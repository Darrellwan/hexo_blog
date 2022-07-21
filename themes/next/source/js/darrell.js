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