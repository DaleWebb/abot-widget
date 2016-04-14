var JSON = require('./json2.js');

var utils = {
  getUniqueKey: function () {
	var s = [], itoh = '0123456789ABCDEF';
	for (var i = 0; i < 36; i++) s[i] = Math.floor(Math.random() * 0x10);
	s[14] = 4;
	s[19] = (s[19] & 0x3) | 0x8;

	for (var x = 0; x < 36; x++) s[x] = itoh[s[x]];
	s[8] = s[13] = s[18] = s[23] = '-';

	return s.join('');
  },

  getEscapeHtml: function (html) {
	return String(html)
	  .replace(/&/g, '&amp;')
	  .replace(/"/g, '&quot;')
	  .replace(/'/g, '&#39;')
	  .replace(/</g, '&lt;')
	  .replace(/>/g, '&gt;');
  },
  getHashCode: function (s) {
	var hash = 0;
	if (s.length === 0) return hash;
	for (var i = 0; i < s.length; i++) {
	  var char1 = s.charCodeAt(i);
	  hash = ((hash << 5) - hash) + char1;
	  hash = hash & hash;
	}
	return hash;
  },
  hasClass: function (el, val) {
	var pattern = new RegExp("(^|\\s)" + val + "(\\s|$)");
	return pattern.test(el.className);
  },
  addClass: function (ele, cls) {
	if (!this.hasClass(ele, cls)) ele.className += " " + cls;
  },
  removeClass: function (ele, cls) {
	if (this.hasClass(ele, cls)) {
	  var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
	  ele.className = ele.className.replace(reg, ' ');
	}
  },
  mergeConfig: function (obj1, obj2) {

	for (var p in obj2) {
	  try {
		if (obj2[p].constructor == Object) {
		  obj1[p] = this.mergeConfig(obj1[p], obj2[p]);
		} else {
		  obj1[p] = obj2[p];
		}
	  } catch (e) {
		obj1[p] = obj2[p];

	  }
	}
	return obj1;
  },
  initXMLhttp: function () {
	var xmlhttp;
	if (window.XMLHttpRequest) {
	  //code for IE7,firefox chrome and above
	  xmlhttp = new XMLHttpRequest();
	} else {
	  //code for Internet Explorer
	  xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	return xmlhttp;
  },
  minAjax: function (config) {

	if (!config.url) {
	  if (config.debugLog == true)
		console.log("No Url!");
	  return;
	}

	if (!config.type) {
	  if (config.debugLog == true)
		console.log("No Default type (GET/POST) given!");
	  return;
	}

	if (!config.method) {
	  config.method = true;
	}

	if (!config.debugLog) {
	  config.debugLog = false;
	}

	var xmlhttp = this.initXMLhttp();

	xmlhttp.onreadystatechange = function () {

	  if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

		if (config.success) {
		  config.success(xmlhttp.responseText, xmlhttp.readyState);
		}

		if (config.debugLog == true)
		  console.log("SuccessResponse");
		if (config.debugLog == true)
		  console.log("Response Data:" + xmlhttp.responseText);

	  } else {

		if (config.debugLog == true)
		  console.log("FailureResponse --> State:" + xmlhttp.readyState + "Status:" + xmlhttp.status);
	  }
	};

	var sendString = [],
	  sendData = config.data;
	if (typeof sendData === "string") {
	  var tmpArr = String.prototype.split.call(sendData, '&');
	  for (var i = 0, j = tmpArr.length; i < j; i++) {
		var datum = tmpArr[i].split('=');
		sendString.push(encodeURIComponent(datum[0]) + "=" + encodeURIComponent(datum[1]));
	  }
	} else if (typeof sendData === 'object' && !( sendData instanceof String || (FormData && sendData instanceof FormData) )) {
	  for (var k in sendData) {
		var datum = sendData[k];
		if (Object.prototype.toString.call(datum) == "[object Array]") {
		  for (var i = 0, j = datum.length; i < j; i++) {
			sendString.push(encodeURIComponent(k) + "[]=" + encodeURIComponent(datum[i]));
		  }
		} else {
		  sendString.push(encodeURIComponent(k) + "=" + encodeURIComponent(datum));
		}
	  }
	}
	sendString = sendString.join('&');

	if (config.type == "GET") {
	  xmlhttp.open("GET", config.url + "?" + sendString, config.method);
	  xmlhttp.send();

	  if (config.debugLog == true)
		console.log("GET fired at:" + config.url + "?" + sendString);
	}
	if (config.type == "POST" || config.type == "PUT") {
	  xmlhttp.open(config.type, config.url, config.method);
	  xmlhttp.setRequestHeader("Content-type", "application/json");
	  xmlhttp.send(sendString);

	  if (config.debugLog == true)
		console.log("POST fired at:" + config.url + " || Data:" + sendString);
	}
  },
  getCookie: function (c_name) {
	var i, x, y, ARRcookies = document.cookie.split(";");
	for (i = 0; i < ARRcookies.length; i++) {
	  x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
	  y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
	  x = x.replace(/^\s+|\s+$/g, "");
	  if (x == c_name) {
		return unescape(y);
	  }
	}
  },
  setCookie: function (c_name, value, exdays) {
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
	document.cookie = c_name + "=" + c_value;
},
  scrollTo: function (element, to, duration) {
	/*
	 to = -(to - element.clientHeight);
	 to = to > 0 ? 0 : to;
	 element.style.webkitTransform = "translateY("+to+"px)";
	 element.style.webkitTransform = "translateY("+to+"px)";
	 element.style.MozTransform = "translateY("+to+"px)";
	 element.style.msTransform = "translateY("+to+"px)";
	 element.style.OTransform = "translateY("+to+"px)";
	 element.style.transform = "translateY("+to+"px)";
	 return;
	 */
	var self = this;
	var start = element.scrollTop,
	  change = to - start,
	  increment = 20;

	var animateScroll = function (elapsedTime) {
	  elapsedTime += increment;
	  var position = self.easeInOut(elapsedTime, start, change, duration);
	  element.scrollTop = position;
	  if (elapsedTime < duration) {
		setTimeout(function () {
		  animateScroll(elapsedTime);
		}, increment);
	  }
	};

	animateScroll(0);
  },
  currentDateStr: function () {
	return (new Date()).toISOString().substring(0, 19);
  },
  easeInOut: function (currentTime, start, change, duration) {
	currentTime /= duration / 2;
	if (currentTime < 1) {
	  return change / 2 * currentTime * currentTime + start;
	}
	currentTime -= 1;
	return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
  },
  secondsTohhmmss: function (totalSeconds) {
	return (new Date(totalSeconds)).toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
  },
  timeSince: function (date) {
	var seconds = Math.floor((new Date() - date) / 1000);
	var interval = Math.floor(seconds / 31536000);

	if (interval > 1) {
	  return interval + " years";
	}
	interval = Math.floor(seconds / 2592000);
	if (interval > 1) {
	  return interval + " months";
	}
	interval = Math.floor(seconds / 86400);
	if (interval > 1) {
	  return interval + " days";
	}
	interval = Math.floor(seconds / 3600);
	if (interval > 1) {
	  return interval + " hours";
	}
	interval = Math.floor(seconds / 60);
	if (interval > 1) {
	  return interval + " minutes";
	}
	return Math.floor(seconds) + " seconds";
  },
  generateShortId: function () {
	return ("0000" + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4);
  }
};

module.exports = utils;
