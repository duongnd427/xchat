import { KEY_XXTEA } from '../../config/Config';
import { getUA, isAndroid, isIOS } from 'react-device-detect';
import Router from 'next/router';
import sha256 from 'crypto-js/';
import crypto from 'crypto';
import CircularJSON from 'circular-json';

var xxtea = require('xxtea-node');

var rand = require('../../utils/php/math/rand');
var md5 = require('../../utils/php/strings/md5');

var ranges = [
	{ divider: 1e18, suffix: 'E' },
	{ divider: 1e15, suffix: 'P' },
	{ divider: 1e12, suffix: 'T' },
	{ divider: 1e9, suffix: 'G' },
	{ divider: 1e6, suffix: 'M' },
	{ divider: 1e3, suffix: 'K' },
];

function formatNumber(n) {
	if (!isNaN(n) && n > 0) {
		for (var i = 0; i < ranges.length; i++) {
			if (n >= ranges[i].divider) {
				return (
					(n / ranges[i].divider).toFixed(1).toString().replace('.0', '') +
					ranges[i].suffix
				);
			}
		}

		return n.toString();
	}
	return 0;
}

function formatWithCommas(n) {
	if (!isNaN(n) && n > 0) {
		return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	}
	return 0;
}

var templates = {
	prefix: '',
	suffix: ' trước', //" ago",
	seconds: '1 phút', //"less than a minute",
	minute: '1 phút', //"about a minute",
	minutes: '%d phút', //"%d minutes",
	hour: '1 giờ', //"about an hour",
	hours: '%d giờ', //"about %d hours",
	day: '1 ngày', //"a day",
	days: '%d ngày', //"%d days",
	month: '1 tháng', //"about a month",
	months: '%d tháng', //"%d months",
	year: '1 năm', //"about a year",
	years: '%d năm', //"%d years"
};
var template = function (t, n) {
	return templates[t] && templates[t].replace(/%d/i, Math.abs(Math.round(n)));
};

function getTimeAgo(time) {
	if (!time) return;

	//time = time.replace(/\.\d+/, ""); // remove milliseconds
	//time = time.replace(/-/, "/").replace(/-/, "/");
	//time = time.replace(/T/, " ").replace(/Z/, " UTC");
	//time = time.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2"); // -04:00 -> -0400
	//time = new Date(time * 1000 || time);
	time = new Date(time);

	var now = new Date();
	var seconds = ((now.getTime() - time) * 0.001) >> 0;
	var minutes = seconds / 60;
	var hours = minutes / 60;
	var days = hours / 24;
	var years = days / 365;

	return (
		templates.prefix +
		((seconds < 45 && template('seconds', seconds)) ||
			(seconds < 90 && template('minute', 1)) ||
			(minutes < 45 && template('minutes', minutes)) ||
			(minutes < 90 && template('hour', 1)) ||
			(hours < 24 && template('hours', hours)) ||
			(hours < 42 && template('day', 1)) ||
			(days < 30 && template('days', days)) ||
			(days < 45 && template('month', 1)) ||
			(days < 365 && template('months', days / 30)) ||
			(years < 1.5 && template('year', 1)) ||
			template('years', years)) +
		templates.suffix
	);
}

function getPathname(pathname) {
	let regexV = /^(.+)-v([0-9]+)/;
	let regexT = /^(.+)-t([0-9]+)/;
	let regexM = /^(.+)-m([0-9]+)/;
	let end = pathname.length;
	let beginSearch = pathname.lastIndexOf('?');
	if (beginSearch > -1) {
		let seachStr = pathname.slice(beginSearch, end);
		pathname = pathname.replace(seachStr, '');
	}
	if (regexV.test(pathname)) {
		return pathname;
	} else if (regexT.test(pathname)) {
		return (
			pathname.substring(0, pathname.lastIndexOf('-t')) +
			'-v' +
			pathname.substring(pathname.lastIndexOf('-t') + 2)
		);
	} else if (regexM.test(pathname)) {
		return (
			pathname.substring(0, pathname.lastIndexOf('-m')) +
			'-v' +
			pathname.substring(pathname.lastIndexOf('-m') + 2)
		);
	}

	return pathname;
}

function getIdFromPathname(pathname) {
	var lastV = pathname.lastIndexOf('-v');
	var lastT = pathname.lastIndexOf('-t');
	var lastM = pathname.lastIndexOf('-m');
	var id;
	var length;
	if (pathname.lastIndexOf('?type') > 0) {
		length = pathname.lastIndexOf('?type');
	} else {
		length = pathname.length;
	}
	if (lastM > lastT && lastM > lastV) {
		//    link -m
		id = pathname.slice(lastM + 2, length);
	} else if (lastV > lastT && lastV > lastM) {
		//    link -v
		id = pathname.slice(lastV + 2, length);
	} else if (lastT > lastM && lastT > lastV) {
		//    link -t
		id = pathname.slice(lastT + 2, length);
	}
	return id;
}

function checkUrlMocha(url) {
	if (url.search('/sale3g') > 0) {
		return true;
	}
	return false;
}

function format(inputDate) {
	var date = new Date(inputDate);
	if (!isNaN(date.getTime())) {
		var month = date.getMonth();
		var getMonth = month + 1;
		return date.getDate() + '/' + getMonth + '/' + date.getFullYear();
	}
}

var remove084 = function (username) {
	console.log(username);
	if (username.startsWith('084')) {
		username = username.substring(3, username.length);
		return username;
	}

	if (username.startsWith('00')) {
		username = username.substring(2, username.length);
		return username;
	}

	if (username.startsWith('0')) {
		username = username.substring(1, username.length);
		return username;
	}

	if (username.startsWith('840')) {
		username = username.substring(3, username.length);
		return username;
	}

	if (username.startsWith('84')) {
		username = username.substring(2, username.length);
		return username;
	}

	if (username.startsWith('+84')) {
		username = username.substring(3, username.length);
		return username;
	}
	return username;
};

//bắt lỗi 016
var validatePhoneFormat016 = function (username) {
	// var intRegex = /^[0-1-6 -()+]+$/;
	var intRegex = /^016[2-9]{1}[0-9]{7}$/;
	if (!intRegex.test(username)) {
		return false;
	}
	return true;
};

var validatePhoneStartWith16 = function (username) {
	var arrayStartWith = ['16'];
	var i;
	for (i = 0; i < arrayStartWith.length; i++) {
		if (username.startsWith(arrayStartWith[i])) {
			return false;
		}
	}
	return true;
};

var validatePhoneFormat = function (username) {
	var intRegex = /^[0-9 -()+]+$/;
	if (!intRegex.test(username)) {
		return false;
	}
	return true;
};

function highlightWords(fstring, searchValue) {
	searchValue = unsignString(searchValue);
	//alert(searchValue);
	let string = unsignMaxString(fstring);
	let offs = searchValue.length;
	//alert(string);
	var myKey = trim(searchValue);
	var myStringVar = trim(string);
	if (myStringVar) {
		var first = myStringVar.indexOf(myKey);
		if (first != -1) {
			//alert(first);
			var last = first + offs;
			if (last != -1) {
				if (last > first) {
					var text = fstring.substring(first, last);

					fstring = fstring.replace(
						trim(text),
						'<span>' + trim(text) + '</span>',
					);
				}
			}
		}
	}
	return fstring;
}

function unsignString(str) {
	if (str != undefined && str != null && str != '') {
		str = str.toLowerCase();
		str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
		str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
		str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
		str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
		str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
		str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
		str = str.replace(/đ/g, 'd');
		str = str.replace(
			/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,
			' ',
		);
		/* tìm và thay thế các kí tự đặc biệt trong chuỗi sang kí tự - */
		str = str.replace(/-+-/g, ''); //thay thế 2- thành 1-
		str = str.replace(/^\-+|\-+$/g, '');
		str = str.replace('-', ' ');
		//cắt bỏ ký tự - ở đầu và cuối chuỗi
	}
	return str;
}

function unsignMaxString(str) {
	if (str) {
		str = str.toLowerCase();
		str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
		str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
		str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
		str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
		str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
		str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
		str = str.replace(/đ/g, 'd');
		str = str.replace('-', ' ');
		//cắt bỏ ký tự - ở đầu và cuối chuỗi
		return str;
	} else {
		return null;
	}
}

function trim(s) {
	if (s) {
		var l = 0;
		var r = s.length - 1;
		while (l < s.length && s[l] == ' ') {
			l++;
		}
		while (r > l && s[r] == ' ') {
			r -= 1;
		}
		return s.substring(l, r + 1);
	} else {
		return null;
	}
}

function md5Str(str) {
	return md5(str);
}

function checkObjExist(obj, strings) {
	//var args = Array.prototype.slice.call(arguments, 1);
	var args = strings.split('.');

	for (var i = 0; i < args.length; i++) {
		if (!obj || !obj.hasOwnProperty(args[i])) {
			return false;
		}
		obj = obj[args[i]];
	}
	return true;
}

function checkArrNotEmpty(obj, strings) {
	//var args = Array.prototype.slice.call(arguments, 1);
	var args = strings.split('.');

	for (var i = 0; i < args.length; i++) {
		if (!obj || !obj.hasOwnProperty(args[i])) {
			return false;
		}
		obj = obj[args[i]];
	}

	if (!(obj.constructor === Array && obj.length > 0)) {
		return false;
	}
	return true;
}

// function loadFaceBookPixel() {
//     ReactPixel.init('472036130033640');
//     ReactPixel.pageView();
// }

function logShareFb(id = 0, item_type = 0) {
	LogApi.logShareFB(id, item_type);
}

function count_words(strs) {
	let strConvert = strip(strs);

	//exclude  start and end white-space
	let str1 = strConvert.replace(/(^\s*)|(\s*$)/gi, '');
	//convert 2 or more spaces to 1
	str1 = str1.replace(/[ ]{2,}/gi, ' ');
	// exclude newline with a start spacing
	str1 = str1.replace(/\n /, '\n');
	return str1.split(' ').length;
}

//VIDEO MOCHA START

function getDate(date) {
	var myDate = new Date(date);
	var year = myDate.getFullYear();
	var month = myDate.getMonth() + 1;
	if (month <= 9) month = '0' + month;
	var day = myDate.getDate();
	if (day <= 9) day = '0' + day;
	var prettyDate = year + '-' + month + '-' + day;
	return prettyDate;
}

function getDateTime() {
	var m = new Date();
	var dateString =
		m.getFullYear() +
		'-' +
		('0' + (m.getMonth() + 1)).slice(-2) +
		'-' +
		('0' + m.getDate()).slice(-2) +
		' ' +
		('0' + m.getHours()).slice(-2) +
		':' +
		('0' + m.getMinutes()).slice(-2) +
		':' +
		('0' + m.getSeconds()).slice(-2);
	return dateString;
}

function decryptData(dataEnc) {
	try {
		let tokenDecrypted = xxtea.decryptToString(dataEnc, KEY_XXTEA);
		return JSON.parse(tokenDecrypted);
	} catch (err) {}
	return null;
}

function decryptData_becomstreamer(dataEnc) {
	try {
		// dataEnc = '74Q5cesPiYuAXZq0MGOv9YTZqcMeaZyg5ZQc6ANEE4vXzCQ0BCmPVyyJzUDRnLwzTExoTz0+O/Hixf9FNj+XQ7BoiZuMtFRuZlI7cmMlZI9ciolz7O3F0NQ1FZImJ6x87dmJ4A==';
		let tokenDecrypted = xxtea.decryptToString(dataEnc, KEY_XXTEA);
		return JSON.parse(tokenDecrypted);
	} catch (err) {}
	return null;
}

function encryptData(data) {
	try {
		let dataEncrypted;
		dataEncrypted = xxtea.encryptToString(JSON.stringify(data), KEY_XXTEA);
		return dataEncrypted;
	} catch (err) {}
	return null;
}

function encryptDataSocket(data) {
	try {
		let dataEncrypted;
		dataEncrypted = xxtea.encryptToString(
			JSON.stringify(data),
			KEY_XXTEA_SOCKET,
		);
		return dataEncrypted;
	} catch (err) {}
	return null;
}

function encryptDataPushLog(data) {
	try {
		let dataEncrypted;
		dataEncrypted = xxtea.encryptToString(JSON.stringify(data), KEY_XXTEA);
		return dataEncrypted;
	} catch (err) {}
	return null;
}

function getTokenParamForUrl() {
	let userInfo = getUserInfo();
	if (userInfo) {
		return encodeURIComponent(userInfo.token);
	}

	return '';
}

function getTokenPost() {
	let userInfo = getUserInfo();
	if (userInfo) {
		return userInfo.token;
	}
	return '';
}

function getToken() {
	let token = getCookie('tokenWeb');
	if (token) {
		return token;
	}

	return '';
}

function hasNumber(str) {
	var numbers = /[0-9]/g;
	if (str.match(numbers)) {
		return true;
	}
	return false;
}

function hasCharacter(str) {
	var lowerCaseLetters = /[a-z]|[A-Z]/g;
	if (str.match(lowerCaseLetters)) {
		return true;
	}
	return false;
}

function shareAll(type, linkShare) {
	// debugger
	var urlCur = document.URL.replace(window.location.search, '');
	if (type === 'facebook') {
		//href = "https://www.facebook.com/sharer.php?u=<%=url %>?userid=0?&_rdr"
		window.open(
			'https://m.facebook.com/sharer.php?u=' + linkShare + '?src=' + type,
			'_blank',
		);
	} else if (type === 'google') {
		//href="https://plus.google.com/share?url=<%=url%>"
		window.open(
			'https://plus.google.com/share?url=' + urlCur + '?src=' + type,
			'_blank',
		);
	} else if (type === 'twitter') {
		//href="https://twitter.com/intent/tweet?url=<%=url %>"
		window.open(
			'https://twitter.com/intent/tweet?url=' + urlCur + '?src=' + type,
			'_blank',
		);
	} else if (type === 'linkedin') {
		//href="https://www.linkedin.com/shareArticle?mini=true&url=<%=url %>"
		window.open(
			'https://www.linkedin.com/shareArticle?mini=true&url=' +
				urlCur +
				'?src=' +
				type,
			'_blank',
		);
	} else if (type === 'mail') {
		//href="mailto:?body=<%=url %>"
		window.open('mailto:?body=' + urlCur + '?src=' + type, '_self');
	}
}

function copyUrlShare() {
	var urlText = document.getElementById('txtUrlShare');
	urlText.select();
	document.execCommand('Copy');

	/*$("#popshareAll").hide();
    $("#popup_copy").fadeIn("slow");
    setTimeout(function() { $("#popup_copy").fadeOut("slow"); }, 3000);*/
}

function checkTokenExpired(data) {
	if (data && (data.code === 419 || data.code === 401)) {
		//AuthService.logout();
		// removeCookie('userId');
		// removeCookie(EXPIRE_TIME);
		// removeCookie(IS_DETECTED);

		removeAllCookies();

		let location = {
			pathname: '/login',
		};
		Router.push(location);
	}
	return true;
}

function inArr(arr, value) {
	if (arr.indexOf(value) > -1) {
		return true;
	}
	return false;
}

function encryptStr(data) {
	let dataEncrypted = xxtea.encryptToString(data, KEY_XXTEA);
	return dataEncrypted;
}

function encryptStrPushLog(data) {
	let dataEncrypted = xxtea.encryptToString(data, KEY_XXTEA);
	return dataEncrypted;
}

function decryptStr(data) {
	return xxtea.decryptToString(data, KEY_XXTEA);
}

function showNumber(number) {
	if (!isNaN(number)) {
		return String(number).replace(/(.)(?=(\d{3})+$)/g, '$1.');
	}
	return 0;
}

function getSmsReg(value, _OS = 'Android') {
	let linkTo = '';
	var idx = value.indexOf('://');
	let services = value.substring(0, idx);
	let commandCode = value.substring(idx + 3, value.length);
	_OS = getOperatingSystem();
	console.log('-idex---', services);
	if (_OS == 'iOS') {
		//IOS
		linkTo = 'sms:' + services + '&body=' + commandCode;
	} else {
		//Android
		linkTo = 'sms:' + services + '?body=' + commandCode;
	}

	return linkTo;
}

function getSmsXgame(sms_destination, sms_content, _OS = 'Android') {
	let linkTo = '';
	_OS = getOperatingSystem();

	if (_OS == 'iOS') {
		//IOS
		linkTo = 'sms:' + sms_destination + '&body=' + sms_content;
	} else {
		//Android
		linkTo = 'sms:' + sms_destination + '?body=' + sms_content;
	}

	return linkTo;
}

function getOperatingSystem() {
	let _OS = '';
	if (isIOS) {
		_OS = 'iOS';
	} else if (isAndroid) {
		_OS = 'Android';
	}
	return _OS;
}

function getCookie(key) {
	var name = key + '=';
	var decodedCookie = decodeURIComponent(document.cookie);
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

function setCookie(key, value, expires = 0, path = '/') {
	let expireStr = expires ? ';expires=' + expires.toUTCString() : '';
	let pathStr = ';path=' + path;
	document.cookie = key + '=' + value + expireStr + pathStr;
}

function removeCookie(key) {
	let pathStr = ';path=/;';
	document.cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC' + pathStr;
}

function checkUserLoggedIn() {
	// let expireTime = getCookie(EXPIRE_TIME);
	// if (!expireTime) {
	//     removeCookie(USER_INFO);
	//     return false;
	// }

	let user = getCookie('userId');
	if (user) {
		return true;
	}
	return false;
}

function setUserInfo(user, mustEncrypt = true) {
	//let userEncrypt = AuthService.encryptUser(user);
	if (mustEncrypt) {
		user = encryptData(user);
	}
	setCookie(USER_INFO, user);
}

function checkIsVideoDetail(path) {
	let regexV = /^(.+)-v([0-9]+)/;
	let regexT = /^(.+)-t([0-9]+)/;
	let regexM = /^(.+)-m([0-9]+)/;
	if (regexV.test(path) || regexT.test(path) || regexM.test(path)) {
		return true;
	}
	return false;
}

function getChannelId(link) {
	link = replaceUrl(link);
	// let channelLink = user.channelInfo.link;
	let channelId = 0;
	if (link) {
		channelId = link.substring(link.lastIndexOf('-cn') + 3, link.length);
	}
	if (!isNaN(channelId)) {
		return parseInt(channelId);
	}
	return 0;
}

function getUserAgent() {
	return getUA;
}

function generateClientId() {
	let timeStamp = new Date().getTime();
	let randomInt = rand(1, 1000000);

	return md5(timeStamp * randomInt);
}

function setClientId() {
	let clientId = getCookie(MOCHAVIDEO_CLIENT_ID);
	if (!clientId) {
		clientId = generateClientId();
		setCookie(MOCHAVIDEO_CLIENT_ID, clientId);
	}
	return clientId;
}

function getClientId() {
	let clientId = getCookie(MOCHAVIDEO_CLIENT_ID);
	if (clientId) {
		return clientId;
	}
	return '';
}

function sortVideoSearch(data, value) {
	var listResult = [];
	var query = removeAccents(value);

	for (let i = 0; i < data.length; i++) {
		const nameUpperCase = removeAccents(data[i].name).toUpperCase();
		const nameQuery = query.toUpperCase();
		if (nameQuery === nameUpperCase) {
			if (listResult.length === 0) {
				listResult.push(data[i]);
			} else if (
				listResult.length > 0 &&
				!checkExistVideo(listResult, data[i])
			) {
				listResult.push(data[i]);
			}
		}
	}
	for (let i = 0; i < data.length; i++) {
		const nameUpperCase = removeAccents(data[i].name).toUpperCase();
		const nameQuery = query.toUpperCase();
		if (nameUpperCase.search(nameQuery) === 0) {
			if (listResult.length === 0) {
				listResult.push(data[i]);
			} else if (
				listResult.length > 0 &&
				!checkExistVideo(listResult, data[i])
			) {
				listResult.push(data[i]);
			}
		}
	}
	for (let i = 0; i < data.length; i++) {
		const nameUpperCase = removeAccents(data[i].name).toUpperCase();
		const nameQuery = query.replace(/[^a-z0-9\s]/gi, '').toUpperCase();
		if (nameUpperCase.search(nameQuery) != -1) {
			if (listResult.length === 0) {
				listResult.push(data[i]);
			} else if (
				listResult.length > 0 &&
				!checkExistVideo(listResult, data[i])
			) {
				listResult.push(data[i]);
			}
		}
	}
	for (let i = 0; i < data.length; i++) {
		const newNameStr = data[i].name
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/đ/g, 'd')
			.replace(/Đ/g, 'D');
		const newQueryStr = query
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/đ/g, 'd')
			.replace(/Đ/g, 'D');
		if (removeAccents(newNameStr) === removeAccents(newQueryStr)) {
			if (listResult.length === 0) {
				listResult.push(data[i]);
			} else if (
				listResult.length > 0 &&
				!checkExistVideo(listResult, data[i])
			) {
				listResult.push(data[i]);
			}
		}
	}
	for (let i = 0; i < data.length; i++) {
		const newNameStr = data[i].name
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/đ/g, 'd')
			.replace(/Đ/g, 'D');
		const newQueryStr = query
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/đ/g, 'd')
			.replace(/Đ/g, 'D');
		let a = removeAccents(newNameStr).toUpperCase();
		let b = removeAccents(newQueryStr).toUpperCase();
		if (a.search(b) === 0) {
			if (listResult.length === 0) {
				listResult.push(data[i]);
			} else if (
				listResult.length > 0 &&
				!checkExistVideo(listResult, data[i])
			) {
				listResult.push(data[i]);
			}
		}
	}
	for (let i = 0; i < data.length; i++) {
		const newNameStr = data[i].name
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/đ/g, 'd')
			.replace(/Đ/g, 'D');
		const newQueryStr = query
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/đ/g, 'd')
			.replace(/Đ/g, 'D');
		let a = removeAccents(newNameStr).toUpperCase();
		let b = removeAccents(newQueryStr).toUpperCase();
		if (a.search(b) === 0) {
			if (listResult.length === 0) {
				listResult.push(data[i]);
			} else if (
				listResult.length > 0 &&
				!checkExistVideo(listResult, data[i])
			) {
				listResult.push(data[i]);
			}
		}
	}
	for (let i = 0; i < data.length; i++) {
		const newNameStr = query
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/đ/g, 'd')
			.replace(/Đ/g, 'D');
		var des;
		if (data[i].description != undefined && data[i].description != '') {
			des = data[i].description.replace(
				/[^0-9a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]/gi,
				'',
			);
		}
		if (des != '' && des != undefined) {
			if (des.search(newNameStr) != -1) {
				if (listResult.length === 0) listResult.push(data[i]);
				else if (
					listResult.length > 0 &&
					!checkExistVideo(listResult, data[i])
				) {
					listResult.push(data[i]);
				}
			}
		}
	}
	for (let i = 0; i < data.length; i++) {
		if (listResult.length === 0) listResult.push(data[i]);
		else if (listResult.length > 0 && !checkExistVideo(listResult, data[i])) {
			listResult.push(data[i]);
		}
	}
	return listResult;
}

function removeAccents(value) {
	var query = '';
	if (value) {
		var trimValue = trim(value);
		var replaceValue = trimValue.replace(/ /g, '-');
		query = replaceValue.replace(/-+-/g, '-').replace(/[^A-Z0-9]+/gi, '-');
	}
	return query;
}

function checkExistVideo(array, item) {
	let result = false;
	for (var i = 0; i < array.length; i++) {
		if (array[i].id === item.id) {
			result = true;
		}
	}
	return result;
}

function getActionLogTraffic(pathname) {
	let action = 'NORMAL';
	if (!getCookie('ACTION_LOGTRAFFIC')) {
		let regex = /^(.+)-t([0-9]+)/;
		let regexM = /^(.+)-m([0-9]+)/;
		if (
			pathname.includes('/sale3g/') ||
			regex.test(pathname) ||
			regexM.test(pathname)
		) {
			action = 'ADVERTISEMENT';
			setCookie('ACTION_LOGTRAFFIC', 'ADVERTISEMENT');
		}
	} else {
		action = 'ADVERTISEMENT';
	}
	return action;
}

function linkImageNew(url, type) {
	var domain = url.slice(0, 46);
	var domainNew = url.replace(domain, 'http://cdn2.keeng.net/playnow/images');
	switch (type) {
		case 'channel':
			domainNew = domainNew.replace('channel', 'chanels');
			break;
	}
	return domainNew;
}

function getMobileOperatingSystem() {
	var userAgent = navigator.userAgent || navigator.vendor || window.opera;

	// Windows Phone must come first because its UA also contains "Android"
	if (/windows phone/i.test(userAgent)) {
		return 'Windows Phone';
	}

	if (/android/i.test(userAgent)) {
		return 'Android';
	}

	// iOS detection from: http://stackoverflow.com/a/9039885/177710
	if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
		return 'iOS';
	}

	return 'unknown';
}

function getAvatar(phoneNumber = '00') {
	if (!isNaN(phoneNumber) && phoneNumber > 0) {
		return (
			'http://hlvip2.mocha.com.vn/api/thumbnail/download-cache?ac=' +
			phoneNumber +
			'&t=20180503&u=video'
		);
	}
	return 'http://hlvip2.mocha.com.vn/api/thumbnail/download-cache?ac=00&t=20180503&u=video';
	//return "http://hlvip2.mocha.com.vn/api/thumbnail/download-cache?ac=" + xxtea.decryptToString(phoneNumber, KEY_XXTEA) + "&t=20180503&u=video";
}

function showphoneNumber(phoneNumber) {
	if (phoneNumber && phoneNumber.length > 3) {
		return phoneNumber.substring(0, phoneNumber.length - 3) + '***';
	}
	return phoneNumber;
}

function getIdByLink(link, sLink) {
	link = replaceUrl(link);
	// let channelLink = user.channelInfo.link;
	let channelId = 0;
	if (link) {
		channelId = link.substring(link.lastIndexOf(sLink) + 3, link.length);
	}
	if (!isNaN(channelId)) {
		return parseInt(channelId);
	}
	return 0;
}

//VIDEO MOCHA END

function getIdGameDetail(pathname) {
	if (pathname) {
		let pathnameArr = pathname.replace('/', '').split('-');
		let vid = pathnameArr[pathnameArr.length - 1];
		const id = vid.replace('v', '');
		return id;
	} else return null;
}

function getIdGame(pathname) {
	return pathname.split('/')[2];
}

function formatDate(time) {
	var date = new Date(time);
	var prefix = '-';
	return (
		('0' + date.getDate()).slice(-2) +
		prefix +
		(Number(date.getMonth()) + 1) +
		prefix +
		date.getFullYear() +
		' ' +
		('0' + date.getHours()).slice(-2) +
		':' +
		('0' + date.getMinutes()).slice(-2)
	);
}

function convertTimePublish(time) {
	var date = new Date();
	var currentTime = date.getTime();
	var longTime = currentTime / 1000 - time / 1000;
	var datePub = '';
	if (longTime <= 60) {
		datePub = Math.ceil(longTime) + ' giây trước';
	} else {
		var minute = longTime / 60;
		minute = Math.ceil(minute);

		if (minute <= 60) {
			datePub = minute + ' phút trước';
		} else {
			datePub = formatDate(time);
		}
	}
	return datePub;
}

function getTimeTopup(times) {
	var time = times.split('-');
	return 'Tháng ' + time[1] + '/' + time[0];
}

function getTimeVideo(secondes) {
	var time = Number(secondes);
	var h = Math.floor(time / 3600);
	var m = Math.floor((time % 3600) / 60);
	var s = Math.floor((time % 3600) % 60);
	if (s < 10) s = '0' + s;
	if (h > 0 && m < 10) m = '0' + m;
	if (h > 0) return h + ':' + m + ':' + s;
	else return m + ':' + s;
}

function convertMoney(money) {
	if (money) {
		return money.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') + ' đ';
	} else return null;
}

function convertMoneyVNPay(money) {
	if (money) {
		return (
			(money / 100).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') + ' đ'
		);
	} else return null;
}

function convertNumberThousand(money) {
	if (money) {
		return money.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
	} else return null;
}

function getParam(url) {
	if (url) {
		let param = url.split('/');
		return param.splice(2, 1);
	} else return null;
}

function getTimeOfTransaction(time) {
	if (time) {
		time = Number(time);
		var date = new Date(time).toLocaleDateString('vi-VN');
		var hour = new Date(time).toLocaleTimeString('vi-VN');

		date = date.split('/');
		if (date[0] < 10) date[0] = '0'.concat(date[0]);
		if (date[1] < 10) date[1] = '0'.concat(date[1]);

		date = date[0].concat('-', date[1], '-', date[2]);

		// hour[0].concat(':', hour[1])
		var result = date.concat(' ', hour);

		return result;
	} else return null;
}

function checksum(user_id, user_name, item_price_id) {
	return sha256(
		'5abf3adb6bf1c8be793bfe15cf96250aa65385c989f485d1547ef2cb292708a1'.concat(
			user_id,
			user_name,
		) + item_price_id,
	);
}

function test() {
	const private_key =
		'-----BEGIN PRIVATE KEY-----\n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\n-----END PRIVATE KEY-----';

	const doc = 'user_id=1&user_name=test&item_price_id=1';

	const signer = crypto.createSign('RSA-SHA256');
	signer.write(doc);
	+signer.end();

	const signature = signer.sign(private_key, 'base64');

	return console.log('Digital Signature: ', signature);
}

function removeAllCookies() {
	var cookies = document.cookie.split(';');

	for (var i = 0; i < cookies.length; i++) {
		var cookie = cookies[i];
		var eqPos = cookie.indexOf('=');
		var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
		document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
	}
}

function getTimeMomo(time) {
	var ti = time.split(' ');
	var day = ti[0].split('-');
	return day[2] + '-' + day[1] + '-' + day[0] + ' ' + ti[1];
}

function getTimeVNPay(time) {
	if (time)
		return (
			time.slice(6, 8) +
			'-' +
			time.slice(4, 6) +
			'-' +
			time.slice(0, 4) +
			' ' +
			time.slice(8, 10) +
			':' +
			time.slice(10, 12) +
			':' +
			time.slice(12, 14)
		);
	return null;
}

function getTimeTransactionMonth(time) {
	var ti = time.split(' ');
	var day = ti[0].split('-');
	return day[2] + '/' + day[1] + '/' + day[0] + ' ' + ti[1].slice(0, 5);
}

function formatValueSearch(count) {
	if (Number(count) <= 20) {
		return count.toString();
	} else return '20+';
}

function formatView(views) {
	var vie = Number(views);

	if (vie >= 1100000) return (vie / 1000000).toFixed(1) + 'M';
	else if (vie >= 1000000) return '1M';
	else if (vie >= 1100) return (vie / 1000).toFixed(1) + 'k';
	else if (vie >= 1000) return '1k';
	else return vie.toString();
}

function publicTime(times) {
	var vie = Number(times);

	var time = new Date().getTime() - vie;
	if (time < 60000) return 'vài giây trước';
	else if (time < 3600000) return (time / 60000).toFixed(0) + ' phút trước';
	else if (time < 24 * 3600000)
		return (time / 3600000).toFixed(0) + ' giờ trước';
	else if (time < 24 * 3600000 * 7)
		return (time / 24 / 3600000).toFixed(0) + ' ngày trước';
	else return formatViewDate(new Date(vie).toLocaleDateString('vi-VN'));
}

function formatViewDate(time) {
	var ti = time.split('/');
	if (Number(ti[0]) < 10) ti[0] = '0'.concat(ti[0]);
	if (Number(ti[1]) < 10) ti[1] = '0'.concat(ti[1]);

	return ti[0] + '/' + ti[1] + '/' + ti[2];
}

function sortKeySearch(key) {
	if (key) {
		return key.replace(/[^a-z0-9\s]/gi, '');
	}
}

function setLocalStore(key, value) {
	localStorage.setItem(key, value);
}

function getLocalStore(key) {
	return JSON.parse(localStorage.getItem(key));
}

function getHistorySearch(key) {
	if (key !== null) {
		var history = key.split(',');
		while ((index = history.indexOf('') !== -1)) {
			var index = history.indexOf('');

			if (index > -1) {
				history.splice(index, 1);
			}
		}
		return history;
	}
	return null;
}

function formatTimeResendOTP(time) {
	var ti = Number(time);
	if (ti < 10) return '0' + ti;
	return ti;
}

function convertNumber11to10(number) {
	let arrayOldHead = [
		'0162',
		'0163',
		'0164',
		'0165',
		'0166',
		'0167',
		'0168',
		'0169',
		'0120',
		'0121',
		'0122',
		'0126',
		'0128',
		'0123',
		'0124',
		'0125',
		'0127',
		'0129',
		'0186',
		'0188',
		'0199',
	];
	let arrayNewHead = [
		'032',
		'033',
		'034',
		'035',
		'036',
		'037',
		'038',
		'039',
		'070',
		'079',
		'077',
		'076',
		'078',
		'083',
		'084',
		'085',
		'081',
		'082',
		'056',
		'058',
		'059',
	];
	for (let i = 0; i < arrayOldHead.length; i++) {
		if (number.startsWith(arrayOldHead[i])) {
			return number.replace(arrayOldHead[i], arrayNewHead[i]);
		}
	}
	return number;
}

function sortWord(word) {
	return word.replace(/[%]/g, function (m) {
		return '%' + m.charCodeAt(0).toString(16);
	});
}

function checkMsisdn10(msisdn) {
	if (msisdn.length !== 10) {
		return false;
	}
	if (msisdn.charAt(0) != 0) {
		return false;
	}
	return true;
}

function getPathnameStreamer(url) {
	return url.split('/')[1];
}

function makeIdcmt() {
	var text = '';
	var possible =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (var i = 0; i < 32; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

function replaceUrlGetCommentLocal(url) {
	if (url.includes('http://localhost:3001/')) {
		return url.replace('http://localhost:3001/', 'http://xgaming.vn/');
	}
	return url;
}

function getIdInvite(url) {
	if (url) {
		return url.split('-')[1];
	}
	return null;
}

function getTokenWeb() {
	if (getCookie('tokenWeb')) return getCookie('tokenWeb');

	return '';
}

function checkFromApp() {
	let fromApp = getCookie('paramApp_obj');
	if (fromApp) return true;
	return false;
}

function checkLogin() {
	let login = getCookie('userId');
	if (login) return true;
	return false;
}

function checkCmtNull(cmt) {
	let data = cmt.replace(/ /g, '');
	if (data !== '') return false;
	return true;
}

function getIpAddress() {
	UserApi.getIpAddress()
		.then((responses) => {
			if (responses) {
				let dataHome = JSON.parse(CircularJSON.stringify(responses));
				checkTokenExpired(dataHome.data);
				renewToken(dataHome.data);
				return dataHome.data.ip_address;
			}
		})
		.catch();
	return '';
}

function getUsername() {
	if (getCookie('username')) return getCookie('username');
	return null;
}

function getAvt() {
	if (getCookie('avatar')) return getCookie('avatar');
	return null;
}

export default {
	getMobileOperatingSystem,
	linkImageNew,
	removeAccents,
	checkExistVideo,
	sortVideoSearch,
	formatNumber,
	formatWithCommas,
	getTimeAgo,
	getPathname,
	getIdFromPathname,
	getDate,
	getDateTime,
	format,
	getTokenPost,
	remove084,
	validatePhoneStartWith16,
	validatePhoneFormat016,
	validatePhoneFormat,
	highlightWords,
	unsignString,
	unsignMaxString,
	trim,
	checkObjExist,
	checkArrNotEmpty,
	// loadFaceBookPixel,

	logShareFb,
	count_words,
	md5Str,
	decryptData,
	decryptData_becomstreamer,
	encryptData,
	encryptDataPushLog,
	getTokenParamForUrl,
	getToken,
	hasNumber,
	hasCharacter,
	inArr,
	encryptStr,
	encryptStrPushLog,
	decryptStr,
	showNumber,
	shareAll,
	copyUrlShare,
	getSmsReg,
	getSmsXgame,
	getOperatingSystem,
	getCookie,
	setCookie,
	removeCookie,
	checkUserLoggedIn,
	checkIsVideoDetail,
	getChannelId,
	checkUrlMocha,
	getUserAgent,
	generateClientId,
	setClientId,
	getClientId,
	getActionLogTraffic,
	getAvatar,
	showphoneNumber,
	getIdByLink,

	getIdGame,
	publicTime,
	formatDate,
	getTimeTopup,
	getTimeVideo,
	convertMoney,
	convertMoneyVNPay,
	getParam,
	getTimeOfTransaction,
	checksum,
	test,
	removeAllCookies,
	getTimeMomo,
	getTimeVNPay,
	getTimeTransactionMonth,
	formatValueSearch,
	formatView,
	convertTimePublish,
	formatViewDate,
	sortKeySearch,
	setLocalStore,
	getLocalStore,
	getHistorySearch,
	getIdGameDetail,
	formatTimeResendOTP,
	convertNumber11to10,
	sortWord,
	convertNumberThousand,
	checkMsisdn10,
	getPathnameStreamer,
	makeIdcmt,
	replaceUrlGetCommentLocal,
	getIdInvite,
	getTokenWeb,
	checkFromApp,
	checkLogin,
	checkCmtNull,
	encryptDataSocket,
	getIpAddress,
	getUsername,
	getAvt,
};
