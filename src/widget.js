var utils = require('./utils.js');
var JSON = require('./json2.js');
require("./widget.css");

var elements = {};

window.AbotChat = {
	status: {
		current: undefined,
		last: undefined
	},
  init: function (config) {

	  this.config = utils.mergeConfig({
		  user: 'guest',
		  server: undefined
		}, config);

	var div_root = document.createElement('div');
	div_root.id = 'abot';

	div_root.innerHTML = require('./widget.html');

	var _root = document.getElementsByTagName('body')[0];
	_root.appendChild(div_root);

	elements.divLauncher = document.getElementById('abot-launcher');
	elements.divChatbox = document.getElementById('abot-chatbox');
	elements.txMessage = document.getElementById('txMessage');

	document.querySelector('.abot-sheet-header-title').innerHTML = "Abot";

	// Add Event on elements
	this.initEventHandler();
  },
  open: function () {
	utils.removeClass(elements.divLauncher, 'abot-launcher-active');
	utils.addClass(elements.divLauncher, 'abot-launcher-inactive');
	elements.divChatbox.style.display = 'block';
	if(document.getElementById('abot-conversation')!=undefined){
	  utils.removeClass(document.getElementById('abot-conversation'), 'abot-inactive');
	  utils.addClass(document.getElementById('abot-conversation'), 'abot-active');
	}
  },
  close: function () {
	utils.removeClass(elements.divLauncher, 'abot-launcher-inactive');
	utils.addClass(elements.divLauncher, 'abot-launcher-active');
	elements.divChatbox.style.display = 'none';
	if(document.getElementById('abot-conversation')!=undefined){
	  utils.removeClass(document.getElementById('abot-conversation'), 'abot-active');
	  utils.addClass(document.getElementById('abot-conversation'), 'abot-inactive');
	}
  },
  addMessage: function (message, timestamp, user, type) {

	var div_message = document.getElementById('abot-message');

	this.status.current = 'abot';
	if (user == this.config.user) {
	  this.status.current = 'user';
	}

	message = decodeURIComponent(message);

	var msgClass = 'abot-embed-body';
	var divClass = '';
	var divCaret = '';

	message = '<p>'+message+'</p>';
	divCaret = '<div class="abot-comment-caret"></div>';

	var msgHtml = '<div class="abot-comment-body-container"><div class="abot-comment-body '+msgClass+'">';
	msgHtml = msgHtml + message + '</div>'+divCaret+'</div>';

	var msgContainer = document.createElement("div");
	utils.addClass(msgContainer, 'abot-comment abot-comment-by-' + this.status.current+" "+divClass);
	msgContainer.innerHTML = msgHtml;

	var t = document.querySelector('.abot-comment-metadata-container');
	if (this.status.last != this.status.current) {
	  if (t) {
		utils.removeClass(t, 'abot-comment-metadata-container');
		utils.addClass(t, 'abot-comment-metadata-container-static');
	  }
	} else {
	  t.parentNode.removeChild(t);
	}

	window.metadata = this.metadata = document.createElement("div");
	utils.addClass(this.metadata, "abot-comment-metadata-container");
	this.metadata.innerHTML = '<div class="abot-comment-metadata"><span class="abot-comment-state"></span><span class="abot-relative-time">' + utils.secondsTohhmmss(timestamp) + '</span></div><div class="abot-comment-readstate"></div></div>';

	msgContainer.appendChild(this.metadata);

	msgHtml = msgContainer.outerHTML;

	var classStr = 'abot-conversation-part abot-conversation-part-grouped';
	if (this.status.last != this.status.current) {
	  if (this.status.current == 'abot') { // add avatar image (on the first abot message)
		  msgHtml = '<img src="' + require('./abot.svg') + '" class="abot-comment-avatar">' + msgHtml;
	  }
	  classStr = classStr + '-first';
	}
	classStr += " fromBottomToUp";
	var chatDiv = document.createElement("div");
	chatDiv.className = classStr;
	chatDiv.innerHTML = msgHtml;

	var removeClass = function () {
	  this.classList.remove("fromBottomToUp");
	  this.removeEventListener("animationend", removeClass, false);
	};
	chatDiv.addEventListener("animationend", removeClass, false);


	div_message.appendChild(chatDiv);
	div_message.scrollTop = div_message.scrollHeight;

	this.status.last = this.status.current;
  },
  initEventHandler: function () {

	// element event handlers
	document.getElementById('abot-launcher-button').onclick = function (e) {
	  AbotChat.open();
	};

	if( document.getElementById('btnClose') != undefined ){
	  document.getElementById('btnClose').onclick = function (e) {
		AbotChat.close();
	  };
	}

	var fncTxMessageKeydown = function (e) {

	  e = window.event || e;
	  var keyCode = (e.which) ? e.which : e.keyCode;

	  if (keyCode == 13 && !e.shiftKey) {

		if (e.preventDefault) {
		  e.preventDefault();
		} else {
		  e.returnValue = false;
		}

		var message = elements.txMessage.value.toString().trim();
		//message = utils.getEscapeHtml(message.replace(/^\s+|\s+$/g, ''));
		message = encodeURIComponent(message);

		if (message !== "") {
		  AbotChat.sendMessage(message);
		}

		elements.txMessage.value = "";

		return false;
	  }
	};

	if( elements.txMessage != undefined ){
	  elements.txMessage.onkeydown = fncTxMessageKeydown;
	}

},


  sendMessage: function (msg, type) {
    var self = this;
    this.addMessage(msg, new Date(), 'guest', type);
    var msgContainer = document.querySelector(".abot-sheet-content");
    utils.scrollTo(msgContainer, msgContainer.scrollHeight, 400);
    utils.minAjax({
      url: self.config.server,
      type: 'POST',
      data: {
          CMD: msg,
          FlexID: '+13105555555',
          FlexIDType: 2
      },
      success: function(data) {
        self.addMessage(data, new Date(), 'abot', type);
        var msgContainer = document.querySelector(".abot-sheet-content");
        utils.scrollTo(msgContainer, msgContainer.scrollHeight, 400);
      }
  });
}
};
