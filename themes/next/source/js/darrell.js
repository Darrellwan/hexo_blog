var currentValue = "";

async function getLocalStorageFirebaseToken() {
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

async function handleCurrentValueExist(currentValue, firebaseToken) {
    updateUserBrowserToken(currentValue, firebaseToken);
}

async function handleCurrentValueNull(currentValue, firebaseToken) {
    var placeholderEmail = currentValue.split('&')[1];
    await updateUserBrowserToken(placeholderEmail, firebaseToken);
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
        return false;
    }

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


async function main() {
    await getNotificationStatus();
    var firebaseToken = await getLocalStorageFirebaseToken();
    var currentValue = await getCurrentUrl();
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
