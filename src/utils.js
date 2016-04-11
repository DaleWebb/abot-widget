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
  isIE: function () {
	return (/MSIE (\d+\.\d+);/.test(navigator.userAgent));
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
  getUserAgent: function () {
	return navigator.userAgent.toLowerCase();
  },
  getBrowserName: function () {
	var BrowserKey = {
	  ie: "msie",
	  ie6: "msie 6",
	  ie7: "msie 7",
	  ie8: "msie 8",
	  ie9: "msie 9",
	  ie10: "msie 10",
	  chrome: "chrome",
	  safari: "safari",
	  safari3: "applewebkir/5",
	  mac: "mac",
	  firefox: "firefox"
	};
	var ua = this.getUserAgent();
	var re = /\S*\/[\d.]*/g;
	var m;

	while ((m = re.exec(ua)) != null) {
	  if (m.index === re.lastIndex) {
		re.lastIndex++;
	  }
	  for (var k in BrowserKey) {
		if (m[0].indexOf(BrowserKey[k]) != -1) return k;
	  }
	}
  },
  getOSName: function () {

	var uanaVigatorOs = navigator.userAgent;
	var AgentUserOs = uanaVigatorOs.replace(/ /g, '');
	var Ostxt = "";
	var OSName = "";
	var OsVers = "";
	new function () {
	  var OsNo = navigator.userAgent.toLowerCase();
	  jQuery = {};
	  jQuery.os = {
		Linux: /linux/.test(OsNo),
		Unix: /x11/.test(OsNo),
		Mac: /mac/.test(OsNo),
		Windows: /win/.test(OsNo)
	  };
	};
	// Android의 단말 이름을 반환
	function getAndroidDevName() {
	  var uaAdata = navigator.userAgent;
	  var regex = /Android (.*);.*;\s*(.*)\sBuild/;
	  var match = regex.exec(uaAdata);
	  if (match) {
		var ver = match[1];
		var dev_name = match[2];
		return "Android " + ver + " " + dev_name;
	  }
	  return "Android OS";
	}

	if (jQuery.os.Windows) {
	  if (AgentUserOs.indexOf("WindowsCE") != -1) OSName = "Windows CE";
	  else if (AgentUserOs.indexOf("Windows95") != -1) OSName = "Windows 95";
	  else if (AgentUserOs.indexOf("Windows98") != -1) {
		if (AgentUserOs.indexOf("Win9x4.90") != -1) OSName = "Windows Millennium Edition (Windows Me)";
		else OSName = "Windows 98";
	  }
	  else if (AgentUserOs.indexOf("WindowsNT4.0") != -1) OSName = "Microsoft Windows NT 4.0";
	  else if (AgentUserOs.indexOf("WindowsNT5.0") != -1) OSName = "Windows 2000";
	  else if (AgentUserOs.indexOf("WindowsNT5.01") != -1) OSName = "Windows 2000, Service Pack 1 (SP1)";
	  else if (AgentUserOs.indexOf("WindowsNT5.1") != -1) OSName = "Windows XP";
	  else if (AgentUserOs.indexOf("WindowsNT5.2") != -1) OSName = "Windows 2003";
	  else if (AgentUserOs.indexOf("WindowsNT6.0") != -1) OSName = "Windows Vista/Server 2008";
	  else if (AgentUserOs.indexOf("WindowsNT6.1") != -1) OSName = "Windows 7";
	  else if (AgentUserOs.indexOf("WindowsNT6.2") != -1) OSName = "Windows 8";
	  else if (AgentUserOs.indexOf("WindowsNT6.3") != -1) OSName = "Windows 8.1";
	  else if (AgentUserOs.indexOf("WindowsPhone8.0") != -1) OSName = "Windows Phone 8.0";
	  else if (AgentUserOs.indexOf("WindowsPhoneOS7.5") != -1) OSName = "Windows Phone OS 7.5";
	  else if (AgentUserOs.indexOf("Xbox") != -1) OSName = "Xbox 360";
	  else if (AgentUserOs.indexOf("XboxOne") != -1) OSName = "Xbox One";
	  else if (AgentUserOs.indexOf("Win16") != -1) OSName = "Windows 3.x";
	  else if (AgentUserOs.indexOf("ARM") != -1) OSName = "Windows RT";
	  else OSName = "Windows (Unknown)";

	  if (AgentUserOs.indexOf("WOW64") != -1) OsVers = " 64-bit(s/w 32-bit)";
	  else if (AgentUserOs.indexOf("Win64;x64;") != -1) OsVers = " 64-bit(s/w 64-bit)";
	  else if (AgentUserOs.indexOf("Win16") != -1) OsVers = " 16-bit";
	  else OsVers = " 32-bit";

	} else if (jQuery.os.Linux) {
	  if (AgentUserOs.indexOf("Android") != -1) {
		OSName = getAndroidDevName();
	  }
	  else if (AgentUserOs.indexOf("BlackBerry9000") != -1) OSName = "BlackBerry9000";
	  else if (AgentUserOs.indexOf("BlackBerry9300") != -1) OSName = "BlackBerry9300";
	  else if (AgentUserOs.indexOf("BlackBerry9700") != -1) OSName = "BlackBerry9700";
	  else if (AgentUserOs.indexOf("BlackBerry9780") != -1) OSName = "BlackBerry9780";
	  else if (AgentUserOs.indexOf("BlackBerry9900") != -1) OSName = "BlackBerry9900";
	  else if (AgentUserOs.indexOf("BlackBerry;Opera Mini") != -1) OSName = "Opera/9.80";
	  else if (AgentUserOs.indexOf("Symbian/3") != -1) OSName = "Symbian OS3";
	  else if (AgentUserOs.indexOf("SymbianOS/6") != -1) OSName = "Symbian OS6";
	  else if (AgentUserOs.indexOf("SymbianOS/9") != -1) OSName = "Symbian OS9";
	  else if (AgentUserOs.indexOf("Ubuntu") != -1) OSName = "Ubuntu";
	  else if (AgentUserOs.indexOf("PDA") != -1) OSName = "PDA";
	  else if (AgentUserOs.indexOf("NintendoWii") != -1) OSName = "Nintendo Wii";
	  else if (AgentUserOs.indexOf("PSP") != -1) OSName = "PlayStation Portable";
	  else if (AgentUserOs.indexOf("PS2;") != -1) OSName = "PlayStation 2";
	  else if (AgentUserOs.indexOf("PLAYSTATION3") != -1) OSName = "PlayStation 3";
	  else OSName = "Linux (Unknown)";

	  if (AgentUserOs.indexOf("x86_64") != -1) OsVers = " 64-bit";
	  else if (AgentUserOs.indexOf("i386") != -1) OsVers = " 32-bit";
	  else if (AgentUserOs.indexOf("IA-32") != -1) OsVers = " 32-bit";
	  else OsVers = "";

	} else if (jQuery.os.Unix) {
	  OSName = "UNIX";
	} else if (jQuery.os.Mac) {
	  if (AgentUserOs.indexOf("iPhoneOS3") != -1) OSName = "iPhone OS 3";
	  else if (AgentUserOs.indexOf("iPhoneOS4") != -1) OSName = "iPhone OS 4";
	  else if (AgentUserOs.indexOf("iPhoneOS5") != -1) OSName = "iPhone OS 5";
	  else if (AgentUserOs.indexOf("iPhoneOS6") != -1) OSName = "iPhone OS 6";
	  else if (AgentUserOs.indexOf("iPad") != -1) OSName = "iPad";
	  else if ((AgentUserOs.indexOf("MacOSX10_9") || AgentUserOs.indexOf("MacOSX10.1")) != -1) OSName = "Mac OS X Puma";
	  else if ((AgentUserOs.indexOf("MacOSX10_9") || AgentUserOs.indexOf("MacOSX10.2")) != -1) OSName = "Mac OS X Jaguar";
	  else if ((AgentUserOs.indexOf("MacOSX10_9") || AgentUserOs.indexOf("MacOSX10.3")) != -1) OSName = "Mac OS X Panther";
	  else if ((AgentUserOs.indexOf("MacOSX10_9") || AgentUserOs.indexOf("MacOSX10.4")) != -1) OSName = "Mac OS X Tiger";
	  else if ((AgentUserOs.indexOf("MacOSX10_9") || AgentUserOs.indexOf("MacOSX10.5")) != -1) OSName = "Mac OS X Leopard";
	  else if ((AgentUserOs.indexOf("MacOSX10_9") || AgentUserOs.indexOf("MacOSX10.6")) != -1) OSName = "Mac OS X Snow Leopard";
	  else if ((AgentUserOs.indexOf("MacOSX10_9") || AgentUserOs.indexOf("MacOSX10.7")) != -1) OSName = "Mac OS X Lion";
	  else if ((AgentUserOs.indexOf("MacOSX10_9") || AgentUserOs.indexOf("MacOSX10.8")) != -1) OSName = "Mac OS X Mountain Lion";
	  else if ((AgentUserOs.indexOf("MacOSX10_9") || AgentUserOs.indexOf("MacOSX10.9")) != -1) OSName = "Mac OS X Mavericks";
	  else OSName = "MacOS (Unknown)";
	} else {
	  OSName = "Unknown OS";
	}
	var OSDev = OSName + OsVers;
	return OSDev;
  },
  isMobile: function () {
	var isMobile = (/iphone|ipod|android|ie|blackberry|fennec/).test
	(navigator.userAgent.toLowerCase());
	return isMobile;
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
