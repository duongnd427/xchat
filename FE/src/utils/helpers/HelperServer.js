import {USER_INFO, DECRYPT_KEY, EXPIRE_TIME, MOCHAVIDEO_CLIENT_ID} from "../../config/Config";
import Helper from './Helper';
var xxtea = require('xxtea-node');


function getCookieServer(cookie,key) {
    var name = key + "=";
    var decodedCookie = decodeURIComponent(cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
}

function checkUserLoggedInServer(cookie) {
    let user = getCookieServer(cookie,USER_INFO);
    return !!user;
}

function getTokenParamForServer(cookie) {
    let userInfo =getCookieServer(cookie,USER_INFO);
    if (userInfo) {
        var dataDecrypted = JSON.parse(xxtea.decryptToString(userInfo, DECRYPT_KEY));
        return encodeURIComponent(dataDecrypted.token);
    }

    return '';
}

function getTokenParamForUrlServer(cookie) {
    let userInfo = getUserInfoServer(cookie);
    if (userInfo) {
        return encodeURIComponent(userInfo.token);
    }

    return '';
}

function getUserInfoServer(cookie) {
    let expireTime = getCookieServer(cookie,EXPIRE_TIME);
    if (!expireTime) {
        return null;
    }

    let user = getCookieServer(cookie,USER_INFO);
    if (user) {
        return Helper.decryptData(user);
    }
    return null;
}

function getClientIdServer(cookie) {
    let clientId = getCookieServer(cookie,MOCHAVIDEO_CLIENT_ID);
    if (clientId) {
        return clientId;
    }
    return '';
}
function setClientIdServer() {
    let clientId = getCookieServer(MOCHAVIDEO_CLIENT_ID);
    if (!clientId) {
        clientId = generateClientId();
        setCookieServer(MOCHAVIDEO_CLIENT_ID, clientId);
    }
    return clientId;
}
function generateClientId() {
    let timeStamp = new Date().getTime();
    let randomInt = rand(1, 1000000);

    return md5(timeStamp * randomInt);
}
function setCookieServer(key, value, expires = 0, path = '/') {
    let expireStr = expires ? ";expires=" + expires.toUTCString() : '';
    let pathStr = ";path=" + path;
    document.cookie = key + "=" + value + expireStr + pathStr;
}

export  default  {
    getCookieServer,
    checkUserLoggedInServer,
    getTokenParamForServer,
    getTokenParamForUrlServer,
    getUserInfoServer,
    getClientIdServer,
    setClientIdServer,
    generateClientId,
    setCookieServer
}