(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["nf"] = factory();
	else
		root["nf"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.FULLY_CONNECTED = exports.WEBRTC = exports.WebChannel = undefined;

	var _WebChannel = __webpack_require__(1);

	Object.defineProperty(exports, 'WebChannel', {
	  enumerable: true,
	  get: function get() {
	    return _WebChannel.WebChannel;
	  }
	});

	var _serviceProvider = __webpack_require__(2);

	Object.defineProperty(exports, 'WEBRTC', {
	  enumerable: true,
	  get: function get() {
	    return _serviceProvider.WEBRTC;
	  }
	});
	Object.defineProperty(exports, 'FULLY_CONNECTED', {
	  enumerable: true,
	  get: function get() {
	    return _serviceProvider.FULLY_CONNECTED;
	  }
	});

	__webpack_require__(15);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.WebChannel = exports.USER_DATA = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _serviceProvider = __webpack_require__(2);

	var _serviceProvider2 = _interopRequireDefault(_serviceProvider);

	var _Channel = __webpack_require__(14);

	var _Channel2 = _interopRequireDefault(_Channel);

	var _JoiningPeer = __webpack_require__(6);

	var _JoiningPeer2 = _interopRequireDefault(_JoiningPeer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var formatter = (0, _serviceProvider2.default)(_serviceProvider.MESSAGE_FORMATTER);

	var MAX_ID = 4294967295;

	/**
	 * Constant used to build a message designated to API user.
	 * @type {int}
	 */
	var USER_DATA = exports.USER_DATA = 0;

	/**
	 * Constant used to build a message designated to a specific service.
	 * @type {int}
	 */
	var SERVICE_DATA = 1;
	/**
	 * Constant used to build a message that a user has left Web Channel.
	 * @type {int}
	 */
	var LEAVE = 2;
	/**
	 * Constant used to build a message to be sent to a newly joining peer.
	 * @type {int}
	 */
	var JOIN_INIT = 3;
	/**
	 * Constant used to build a message to be sent to all peers in Web Channel to
	 * notify them about a new peer who is about to join the Web Channel.
	 * @type {int}
	 */
	var JOIN_NEW_MEMBER = 4;
	/**
	 * Constant used to build a message to be sent to all peers in Web Channel to
	 * notify them that the new peer who should join the Web Channel, refuse to join.
	 * @type {int}
	 */
	var REMOVE_NEW_MEMBER = 5;
	/**
	 * Constant used to build a message to be sent to a newly joining peer that he
	 * has can now succesfully join Web Channel.
	 * @type {int}
	 */
	var JOIN_FINILIZE = 6;
	/**
	 * Constant used to build a message to be sent by the newly joining peer to all
	 * peers in Web Channel to notify them that he has succesfully joined the Web
	 * Channel.
	 * @type {int}
	 */
	var JOIN_SUCCESS = 7;
	/**
	 * @type {int}
	 */
	var INIT_CHANNEL_PONG = 9;

	/**
	 * This class is an API starting point. It represents a group of collaborators
	 * also called peers. Each peer can send/receive broadcast as well as personal
	 * messages. Every peer in the `WebChannel` can invite another person to join
	 * the *WebChannel* and he also possess enough information to be able to add it
	 * preserving the current *WebChannel* structure (network topology).
	 */

	var WebChannel = function () {

	  /**
	   * `WebChannel` constructor. `WebChannel` can be parameterized in terms of
	   * network topology and connector technology (WebRTC or WebSocket. Currently
	   * WebRTC is only available).
	   *
	   * @param  {Object} [options] `WebChannel` configuration.
	   * @param  {string} [options.topology=FULLY_CONNECTED] Defines the network
	   *            topology.
	   * @param  {string} [options.connector=WEBRTC] Determines the connection
	   *            technology to use for build `WebChannel`.
	   * @return {WebChannel} Empty `WebChannel` without any connection.
	   */

	  function WebChannel() {
	    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	    _classCallCheck(this, WebChannel);

	    this.defaults = {
	      connector: _serviceProvider.WEBRTC,
	      topology: _serviceProvider.FULLY_CONNECTED
	    };
	    this.settings = Object.assign({}, this.defaults, options);

	    /**
	     * Channels through which this peer is connected with other peers. This
	     * attribute depends on the `WebChannel` topology. E. g. in fully connected
	     * `WebChannel` you are connected to each other peer in the group, however
	     * in the star structure this attribute contains only the connection to
	     * the central peer.
	     *
	     * @private
	     */
	    this.channels = new Set();

	    /**
	     * This event handler is used to resolve *Promise* in `WebChannel.join`.
	     *
	     * @private
	     */
	    this.onJoin;

	    /** @private */
	    this.joiningPeers = new Set();
	    /** @private */
	    this.connectWithRequests = new Map();

	    /** @private */
	    this.topology = this.settings.topology;

	    // Public attributes

	    /**
	     * Unique identifier of this `WebChannel`. The same for all peers.
	     * @readonly
	     */
	    this.id = this.generateId();

	    /**
	     * Unique peer identifier in this `WebChannel`. After each `join` function call
	     * this id will change, because it is up to the `WebChannel` to assign it when
	     * you join.
	     *
	     * @readonly
	     */
	    this.myId = this.generateId();

	    this.onJoining = function (id) {};
	    this.onMessage = function (id, msg) {};
	    this.onLeaving = function (id) {};
	  }

	  /** Leave `WebChannel`. No longer can receive and send messages to the group. */


	  _createClass(WebChannel, [{
	    key: 'leave',
	    value: function leave() {
	      if (this.channels.size !== 0) {
	        this.manager.broadcast(this, formatter.msg(LEAVE, { id: this.myId }));
	        this.topology = this.settings.topology;
	        this.channels.forEach(function (c) {
	          c.close();
	        });
	        this.channels.clear();
	      }
	    }

	    /**
	     * Send broadcast message.
	     *
	     * @param  {string} data Message
	     */

	  }, {
	    key: 'send',
	    value: function send(data) {
	      var _this = this;

	      if (this.channels.size !== 0) {
	        formatter.handleUserMessage(data, this.myId, null, function (dataChunk) {
	          _this.manager.broadcast(_this, dataChunk);
	        });
	      }
	    }

	    /**
	     * Send the message to a particular peer.
	     *
	     * @param  {type} id Peer id of the recipient peer
	     * @param  {type} data Message
	     */

	  }, {
	    key: 'sendTo',
	    value: function sendTo(id, data) {
	      var _this2 = this;

	      if (this.channels.size !== 0) {
	        formatter.handleUserMessage(data, this.myId, id, function (dataChunk) {
	          _this2.manager.sendTo(id, _this2, dataChunk);
	        });
	      }
	    }

	    /**
	     * Enable other peers to join the `WebChannel` with your help as an intermediary
	     * peer.
	     *
	     * @param  {Object} [options] Any available connection service options.
	     * @return {string} The key required by other peer to join the `WebChannel`.
	     */

	  }, {
	    key: 'openForJoining',
	    value: function openForJoining() {
	      var _this3 = this;

	      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	      var settings = Object.assign({}, this.settings, options);

	      var cBuilder = (0, _serviceProvider2.default)(settings.connector, settings);
	      return cBuilder.open(this.generateKey(), function (channel) {
	        _this3.initChannel(channel, false).then(function (channel) {
	          var jp = new _JoiningPeer2.default(channel.peerId, _this3.myId);
	          jp.intermediaryChannel = channel;
	          _this3.joiningPeers.add(jp);
	          channel.send(formatter.msg(JOIN_INIT, {
	            manager: _this3.settings.topology,
	            id: channel.peerId,
	            intermediaryId: _this3.myId }));
	          _this3.manager.broadcast(_this3, formatter.msg(JOIN_NEW_MEMBER, { id: channel.peerId, intermediaryId: _this3.myId }));
	          _this3.manager.add(channel).then(function () {
	            return channel.send(formatter.msg(JOIN_FINILIZE));
	          }).catch(function (msg) {
	            _this3.manager.broadcast(_this3, formatter(REMOVE_NEW_MEMBER, { id: channel.peerId }));
	            _this3.removeJoiningPeer(jp.id);
	          });
	        });
	      }).then(function (data) {
	        _this3.webRTCOpen = data.socket;
	        return { key: data.key, url: data.url };
	      });
	    }

	    /**
	     * Prevent other peers to join the `WebChannel` even if they have a key.
	     */

	  }, {
	    key: 'closeForJoining',
	    value: function closeForJoining() {
	      if (Reflect.has(this, 'webRTCOpen')) {
	        this.webRTCOpen.close();
	      }
	    }

	    /**
	     * Join the `WebChannel`.
	     *
	     * @param  {string} key The key provided by a `WebChannel` member.
	     * @param  {type} [options] Any available connection service options.
	     * @return {Promise} It resolves once you became a `WebChannel` member.
	     */

	  }, {
	    key: 'join',
	    value: function join(key) {
	      var _this4 = this;

	      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	      var settings = Object.assign({}, this.settings, options);

	      var cBuilder = (0, _serviceProvider2.default)(settings.connector, settings);
	      return new Promise(function (resolve, reject) {
	        _this4.onJoin = function () {
	          return resolve(_this4);
	        };
	        cBuilder.join(key).then(function (channel) {
	          return _this4.initChannel(channel, true);
	        }).catch(reject);
	      });
	    }

	    /**
	     *
	     *
	     * @private
	     * @return {type}  description
	     */

	  }, {
	    key: 'isInviting',
	    value: function isInviting() {}

	    /**
	     * has - description
	     *
	     * @private
	     * @param  {type} peerId description
	     * @return {type}        description
	     */

	  }, {
	    key: 'has',
	    value: function has(peerId) {
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = this.channels[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var c = _step.value;

	          if (c.peerId === peerId) {
	            return true;
	          }
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }

	      return false;
	    }

	    /**
	     * Send a message to a service of the same peer, joining peer or any peer in
	     * the Web Channel).
	     *
	     * @private
	     * @param  {string} serviceName - Service name.
	     * @param  {string} recepient - Identifier of recepient peer id.
	     * @param  {Object} [msg={}] - Message to send.
	     */

	  }, {
	    key: 'sendSrvMsg',
	    value: function sendSrvMsg(serviceName, recepient) {
	      var msg = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	      var channel = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

	      var fullMsg = formatter.msg(SERVICE_DATA, { serviceName: serviceName, recepient: recepient, data: Object.assign({}, msg) });
	      if (channel !== null) {
	        channel.send(fullMsg);
	        return;
	      }
	      if (recepient === this.myId) {
	        this.onChannelMessage(null, fullMsg);
	      } else {
	        // If this function caller is a peer who is joining
	        if (this.isJoining()) {
	          this.getJoiningPeer(this.myId).intermediaryChannel.send(fullMsg);
	        } else {
	          // If the recepient is a joining peer
	          if (this.hasJoiningPeer(recepient)) {
	            var jp = this.getJoiningPeer(recepient);
	            // If I am an intermediary peer for recepient
	            if (jp.intermediaryId === this.myId) {
	              jp.intermediaryChannel.send(fullMsg);
	              // If not, then send this message to the recepient's intermediary peer
	            } else {
	                this.manager.sendTo(jp.intermediaryId, this, fullMsg);
	              }
	            // If the recepient is a member of webChannel
	          } else {
	              this.manager.sendTo(recepient, this, fullMsg);
	            }
	        }
	      }
	    }
	  }, {
	    key: 'onChannelMessage',
	    value: function onChannelMessage(channel, data) {
	      var _this5 = this;

	      var header = formatter.readHeader(data);
	      if (header.code === USER_DATA) {
	        formatter.readUserMessage(this.id, header.senderId, data, function (fullData) {
	          _this5.onMessage(header.senderId, fullData);
	        });
	      } else {
	        var msg = formatter.readInternalMessage(data);
	        switch (header.code) {
	          case LEAVE:
	            var _iteratorNormalCompletion2 = true;
	            var _didIteratorError2 = false;
	            var _iteratorError2 = undefined;

	            try {
	              for (var _iterator2 = this.channels[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                var c = _step2.value;

	                if (c.peerId === msg.id) {
	                  c.close();
	                  this.channels.delete(c);
	                }
	              }
	            } catch (err) {
	              _didIteratorError2 = true;
	              _iteratorError2 = err;
	            } finally {
	              try {
	                if (!_iteratorNormalCompletion2 && _iterator2.return) {
	                  _iterator2.return();
	                }
	              } finally {
	                if (_didIteratorError2) {
	                  throw _iteratorError2;
	                }
	              }
	            }

	            this.onLeaving(msg.id);
	            break;
	          case SERVICE_DATA:
	            if (this.myId === msg.recepient) {
	              (0, _serviceProvider2.default)(msg.serviceName, this.settings).onMessage(this, channel, msg.data);
	            } else {
	              this.sendSrvMsg(msg.serviceName, msg.recepient, msg.data);
	            }
	            break;
	          case JOIN_INIT:
	            this.topology = msg.manager;
	            this.myId = msg.id;
	            channel.peerId = msg.intermediaryId;
	            var jp = new _JoiningPeer2.default(this.myId, channel.peerId);
	            jp.intermediaryChannel = channel;
	            this.addJoiningPeer(jp);
	            break;
	          case JOIN_NEW_MEMBER:
	            this.addJoiningPeer(new _JoiningPeer2.default(msg.id, msg.intermediaryId));
	            break;
	          case REMOVE_NEW_MEMBER:
	            this.removeJoiningPeer(msg.id);
	            break;
	          case JOIN_FINILIZE:
	            this.joinSuccess(this.myId);
	            this.manager.broadcast(this, formatter.msg(JOIN_SUCCESS, { id: this.myId }));
	            this.onJoin();
	            break;
	          case JOIN_SUCCESS:
	            this.joinSuccess(msg.id);
	            this.onJoining(msg.id);
	            break;
	          case INIT_CHANNEL_PONG:
	            channel.onPong();
	            delete channel.onPong;
	            break;
	        }
	      }
	    }
	  }, {
	    key: 'onChannelError',
	    value: function onChannelError(evt) {
	      console.log('DATA_CHANNEL ERROR: ', evt);
	    }
	  }, {
	    key: 'onChannelClose',
	    value: function onChannelClose(evt) {
	      console.log('DATA_CHANNEL CLOSE: ', evt);
	    }
	  }, {
	    key: 'initChannel',
	    value: function initChannel(ch, isInitiator) {
	      var _this6 = this;

	      var id = arguments.length <= 2 || arguments[2] === undefined ? -1 : arguments[2];

	      return new Promise(function (resolve, reject) {
	        if (id === -1) {
	          id = _this6.generateId();
	        }
	        var channel = new _Channel2.default(ch, _this6, id);
	        // TODO: treat the case when the 'ping' or 'pong' message has not been received
	        if (isInitiator) {
	          channel.config();
	          channel.onPong = function () {
	            return resolve(channel);
	          };
	          ch.send('ping');
	        } else {
	          ch.onmessage = function (msgEvt) {
	            if (msgEvt.data === 'ping') {
	              channel.config();
	              channel.send(formatter.msg(INIT_CHANNEL_PONG));
	              resolve(channel);
	            }
	          };
	        }
	      });
	    }

	    /**
	     * joinSuccess - description
	     *
	     * @private
	     * @param  {type} id description
	     * @return {type}    description
	     */

	  }, {
	    key: 'joinSuccess',
	    value: function joinSuccess(id) {
	      var _this7 = this;

	      var jp = this.getJoiningPeer(id);
	      jp.channelsToAdd.forEach(function (c) {
	        _this7.channels.add(c);
	        _this7.joiningPeers.delete(jp);
	      });
	    }

	    /**
	     * getJoiningPeer - description
	     *
	     * @private
	     * @param  {type} id description
	     * @return {type}    description
	     */

	  }, {
	    key: 'getJoiningPeer',
	    value: function getJoiningPeer(id) {
	      var _iteratorNormalCompletion3 = true;
	      var _didIteratorError3 = false;
	      var _iteratorError3 = undefined;

	      try {
	        for (var _iterator3 = this.joiningPeers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	          var jp = _step3.value;

	          if (jp.id === id) {
	            return jp;
	          }
	        }
	      } catch (err) {
	        _didIteratorError3 = true;
	        _iteratorError3 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion3 && _iterator3.return) {
	            _iterator3.return();
	          }
	        } finally {
	          if (_didIteratorError3) {
	            throw _iteratorError3;
	          }
	        }
	      }

	      throw new Error('Joining peer not found!');
	    }

	    /**
	     * addJoiningPeer - description
	     *
	     * @private
	     * @param  {type} jp description
	     * @return {type}    description
	     */

	  }, {
	    key: 'addJoiningPeer',
	    value: function addJoiningPeer(jp) {
	      if (this.hasJoiningPeer(jp.id)) {
	        throw new Error('Joining peer already exists!');
	      }
	      this.joiningPeers.add(jp);
	    }

	    /**
	     * removeJoiningPeer - description
	     *
	     * @private
	     * @param  {type} id description
	     * @return {type}    description
	     */

	  }, {
	    key: 'removeJoiningPeer',
	    value: function removeJoiningPeer(id) {
	      if (this.hasJoiningPeer(id)) {
	        this.joiningPeers.delete(this.getJoiningPeer(id));
	      }
	    }

	    /**
	     * isJoining - description
	     *
	     * @private
	     * @return {type}  description
	     */

	  }, {
	    key: 'isJoining',
	    value: function isJoining() {
	      var _iteratorNormalCompletion4 = true;
	      var _didIteratorError4 = false;
	      var _iteratorError4 = undefined;

	      try {
	        for (var _iterator4 = this.joiningPeers[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	          var jp = _step4.value;

	          if (jp.id === this.myId) {
	            return true;
	          }
	        }
	      } catch (err) {
	        _didIteratorError4 = true;
	        _iteratorError4 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion4 && _iterator4.return) {
	            _iterator4.return();
	          }
	        } finally {
	          if (_didIteratorError4) {
	            throw _iteratorError4;
	          }
	        }
	      }

	      return false;
	    }

	    /**
	     * hasJoiningPeer - description
	     *
	     * @private
	     * @param  {type} id description
	     * @return {type}    description
	     */

	  }, {
	    key: 'hasJoiningPeer',
	    value: function hasJoiningPeer(id) {
	      var _iteratorNormalCompletion5 = true;
	      var _didIteratorError5 = false;
	      var _iteratorError5 = undefined;

	      try {
	        for (var _iterator5 = this.joiningPeers[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	          var jp = _step5.value;

	          if (jp.id === id) {
	            return true;
	          }
	        }
	      } catch (err) {
	        _didIteratorError5 = true;
	        _iteratorError5 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion5 && _iterator5.return) {
	            _iterator5.return();
	          }
	        } finally {
	          if (_didIteratorError5) {
	            throw _iteratorError5;
	          }
	        }
	      }

	      return false;
	    }

	    /**
	     * generateKey - description
	     *
	     * @private
	     * @return {type}  description
	     */

	  }, {
	    key: 'generateKey',
	    value: function generateKey() {
	      var MIN_LENGTH = 5;
	      var DELTA_LENGTH = 0;
	      var MASK = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	      var result = '';
	      var length = MIN_LENGTH + Math.round(Math.random() * DELTA_LENGTH);

	      for (var i = 0; i < length; i++) {
	        result += MASK[Math.round(Math.random() * (MASK.length - 1))];
	      }
	      return result;
	    }
	  }, {
	    key: 'generateId',
	    value: function generateId() {
	      var id = void 0;
	      do {
	        id = Math.ceil(Math.random() * MAX_ID);
	        var _iteratorNormalCompletion6 = true;
	        var _didIteratorError6 = false;
	        var _iteratorError6 = undefined;

	        try {
	          for (var _iterator6 = this.channels[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
	            var c = _step6.value;

	            if (id === c.peerId) continue;
	          }
	        } catch (err) {
	          _didIteratorError6 = true;
	          _iteratorError6 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion6 && _iterator6.return) {
	              _iterator6.return();
	            }
	          } finally {
	            if (_didIteratorError6) {
	              throw _iteratorError6;
	            }
	          }
	        }

	        if (this.hasJoiningPeer(id)) continue;
	        if (id === this.myId) continue;
	        break;
	      } while (true);
	      return id;
	    }
	  }, {
	    key: 'topology',
	    set: function set(name) {
	      this.settings.topology = name;
	      this.manager = (0, _serviceProvider2.default)(this.settings.topology);
	    },
	    get: function get() {
	      return this.settings.topology;
	    }
	  }]);

	  return WebChannel;
	}();

	exports.WebChannel = WebChannel;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.MESSAGE_FORMATTER = exports.FULLY_CONNECTED = exports.WEBRTC = undefined;
	exports.default = provide;

	var _FullyConnectedService = __webpack_require__(3);

	var _FullyConnectedService2 = _interopRequireDefault(_FullyConnectedService);

	var _WebRTCService = __webpack_require__(7);

	var _WebRTCService2 = _interopRequireDefault(_WebRTCService);

	var _MessageBuilderService = __webpack_require__(9);

	var _MessageBuilderService2 = _interopRequireDefault(_MessageBuilderService);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Service Provider module is a helper module for {@link module:service}. It is
	 * responsible to instantiate all services. This module must be used to get
	 * any service instance.
	 * @module serviceProvider
	 */

	/**
	 * Constant used to get an instance of {@link WebRTCService}.
	 * @type {string}
	 */
	var WEBRTC = exports.WEBRTC = 'WebRTCService';

	/**
	 * Constant used to get an instance of {@link FullyConnectedService}.
	 * @type {string}
	 */
	var FULLY_CONNECTED = exports.FULLY_CONNECTED = 'FullyConnectedService';

	var MESSAGE_FORMATTER = exports.MESSAGE_FORMATTER = 'MessageBuilderService';

	var services = new Map();

	/**
	 * Provides the service instance specified by `name`.
	 *
	 * @param  {(module:serviceProvider.CHANNEL_PROXY|
	 *          module:serviceProvider.WEBRTC|
	 *          module:serviceProvider.FULLY_CONNECTED)} name - The service name.
	 * @param  {Object} [options] - Any options that the service accepts.
	 * @return {module:service~Interface} - Service instance.
	 */
	function provide(name) {
	  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	  if (services.has(name)) {
	    return services.get(name);
	  }
	  var service = void 0;
	  switch (name) {
	    case WEBRTC:
	      return new _WebRTCService2.default(options);
	    case FULLY_CONNECTED:
	      service = new _FullyConnectedService2.default();
	      services.set(name, service);
	      return service;
	    case MESSAGE_FORMATTER:
	      service = new _MessageBuilderService2.default();
	      services.set(name, service);
	      return service;
	    default:
	      return null;
	  }
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _webChannelManager = __webpack_require__(4);

	var wcManager = _interopRequireWildcard(_webChannelManager);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * Fully connected web channel manager. Implements fully connected topology
	 * network, when each peer is connected to each other.
	 *
	 * @extends module:webChannelManager~Interface
	 */

	var FullyConnectedService = function (_wcManager$Interface) {
	  _inherits(FullyConnectedService, _wcManager$Interface);

	  function FullyConnectedService() {
	    _classCallCheck(this, FullyConnectedService);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(FullyConnectedService).apply(this, arguments));
	  }

	  _createClass(FullyConnectedService, [{
	    key: 'add',
	    value: function add(ch) {
	      var wCh = ch.webChannel;
	      var peers = [wCh.myId];
	      wCh.channels.forEach(function (ch) {
	        peers[peers.length] = ch.peerId;
	      });
	      wCh.joiningPeers.forEach(function (jp) {
	        if (ch.peerId !== jp.id) {
	          peers[peers.length] = jp.id;
	        }
	      });
	      return this.connectWith(wCh, ch.peerId, ch.peerId, peers);
	    }
	  }, {
	    key: 'broadcast',
	    value: function broadcast(webChannel, data) {
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = webChannel.channels[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var c = _step.value;

	          c.send(data);
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'sendTo',
	    value: function sendTo(id, webChannel, data) {
	      var _iteratorNormalCompletion2 = true;
	      var _didIteratorError2 = false;
	      var _iteratorError2 = undefined;

	      try {
	        for (var _iterator2 = webChannel.channels[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	          var c = _step2.value;

	          if (c.peerId === id) {
	            c.send(data);
	            return;
	          }
	        }
	      } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion2 && _iterator2.return) {
	            _iterator2.return();
	          }
	        } finally {
	          if (_didIteratorError2) {
	            throw _iteratorError2;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'leave',
	    value: function leave(webChannel) {}
	  }]);

	  return FullyConnectedService;
	}(wcManager.Interface);

	exports.default = FullyConnectedService;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Interface = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _service = __webpack_require__(5);

	var service = _interopRequireWildcard(_service);

	var _serviceProvider = __webpack_require__(2);

	var _serviceProvider2 = _interopRequireDefault(_serviceProvider);

	var _JoiningPeer = __webpack_require__(6);

	var _JoiningPeer2 = _interopRequireDefault(_JoiningPeer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * Web Channel Manager module is a submodule of {@link module:service} and the
	 * main component of any Web Channel. It is responsible to preserve Web Channel
	 * structure intact (i.e. all peers have the same vision of the Web Channel).
	 * Among its duties are:
	 *
	 * - Add a new peer into Web Channel.
	 * - Remove a peer from Web Channel.
	 * - Send a broadcast message.
	 * - Send a message to a particular peer.
	 *
	 * @module webChannelManager
	 * @see FullyConnectedService
	 */

	/**
	 * Connection service of the peer who received a message of this type should
	 * establish connection with one or several peers.
	 */
	var CONNECT_WITH = 1;
	var CONNECT_WITH_FEEDBACK = 2;
	var CONNECT_WITH_TIMEOUT = 5000;
	var ADD_INTERMEDIARY_CHANNEL = 4;
	var THIS_CHANNEL_TO_JOINING_PEER = 5;

	/**
	 * Each Web Channel Manager Service must implement this interface.
	 * @interface
	 * @extends module:service~Interface
	 */

	var Interface = function (_service$Interface) {
	  _inherits(Interface, _service$Interface);

	  function Interface() {
	    _classCallCheck(this, Interface);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Interface).apply(this, arguments));
	  }

	  _createClass(Interface, [{
	    key: 'onMessage',
	    value: function onMessage(wc, channel, msg) {
	      var _this2 = this;

	      var cBuilder = (0, _serviceProvider2.default)(wc.settings.connector, wc.settings);
	      switch (msg.code) {
	        case CONNECT_WITH:
	          msg.peers = this.reUseIntermediaryChannelIfPossible(wc, msg.jpId, msg.peers);
	          var failed = [];
	          if (msg.peers.length === 0) {
	            wc.sendSrvMsg(this.name, msg.sender, { code: CONNECT_WITH_FEEDBACK, id: wc.myId, failed: failed });
	          } else {
	            (function () {
	              var counter = 0;
	              msg.peers.forEach(function (id) {
	                cBuilder.connectMeTo(wc, id).then(function (channel) {
	                  return wc.initChannel(channel, true, id);
	                }).then(function (channel) {
	                  wc.getJoiningPeer(msg.jpId).toAddList(channel);
	                  wc.sendSrvMsg(_this2.name, wc.myId, { code: THIS_CHANNEL_TO_JOINING_PEER, id: msg.jpId, toBeAdded: true }, channel);
	                  counter++;
	                  if (counter === msg.peers.length) {
	                    wc.sendSrvMsg(_this2.name, msg.sender, { code: CONNECT_WITH_FEEDBACK, id: wc.myId, failed: failed });
	                  }
	                }).catch(function (reason) {
	                  counter++;
	                  failed.push({ id: id, reason: reason });
	                  if (counter === msg.peers.length) {
	                    wc.sendSrvMsg(_this2.name, msg.sender, { code: CONNECT_WITH_FEEDBACK, id: wc.myId, failed: failed });
	                  }
	                });
	              });
	            })();
	          }
	          break;
	        case CONNECT_WITH_FEEDBACK:
	          wc.connectWithRequests.get(msg.id)(true);
	          break;
	        case ADD_INTERMEDIARY_CHANNEL:
	          var jp = wc.getJoiningPeer(msg.jpId);
	          jp.toAddList(jp.intermediaryChannel);
	          break;
	        case THIS_CHANNEL_TO_JOINING_PEER:
	          if (wc.hasJoiningPeer(msg.id)) {
	            jp = wc.getJoiningPeer(msg.id);
	          } else {
	            jp = new _JoiningPeer2.default(msg.id);
	            wc.addJoiningPeer(jp);
	          }
	          if (msg.toBeAdded) {
	            jp.toAddList(this);
	          } else {
	            jp.toRemoveList(this);
	          }
	          break;
	      }
	    }

	    /**
	     * Send a request to a peer asking him to establish a connection with some
	     * peers. This function is used when a new peer is joining Web Channel.
	     * The request can be sent to the peer who is joining as well as other peers
	     * who are already members of Web Channel.
	     *
	     * @param  {WebChannel} wc - The Web Channel.
	     * @param  {string} id - Id of the peer who will receive this request.
	     * @param  {string} jpId - Joining peer id (it is possible that `id`=`jpId`).
	     * @param  {string[]} peers - Ids of peers with whom `id` peer must established
	    *              connections.
	     * @return {Promise} - Is resolved once some of the connections could be established. It is rejected when an error occured.
	     */

	  }, {
	    key: 'connectWith',
	    value: function connectWith(wc, id, jpId, peers) {
	      var _this3 = this;

	      wc.sendSrvMsg(this.name, id, { code: CONNECT_WITH, jpId: jpId, sender: wc.myId, peers: peers });
	      return new Promise(function (resolve, reject) {
	        wc.connectWithRequests.set(id, function (isDone) {
	          if (isDone) {
	            resolve();
	          } else {
	            reject();
	          }
	        });
	        setTimeout(function () {
	          reject('CONNECT_WITH_TIMEOUT');
	        }, _this3.calculateConnectWithTimeout(peers.length));
	      });
	    }
	  }, {
	    key: 'calculateConnectWithTimeout',
	    value: function calculateConnectWithTimeout(nbPeers) {
	      if (nbPeers > 0) {
	        return CONNECT_WITH_TIMEOUT + Math.log10(nbPeers);
	      } else {
	        return CONNECT_WITH_TIMEOUT;
	      }
	    }
	  }, {
	    key: 'reUseIntermediaryChannelIfPossible',
	    value: function reUseIntermediaryChannelIfPossible(webChannel, jpId, ids) {
	      var idToRemove = null;
	      var jp = void 0;
	      if (webChannel.isJoining()) {
	        jp = webChannel.getJoiningPeer(jpId);
	        if (ids.indexOf(jp.intermediaryId) !== -1) {
	          idToRemove = jp.intermediaryId;
	        }
	      } else {
	        if (ids.indexOf(jpId) !== -1) {
	          jp = webChannel.getJoiningPeer(jpId);
	          if (jp.intermediaryChannel !== null) {
	            idToRemove = jpId;
	          }
	        }
	      }
	      if (idToRemove !== null) {
	        jp.toAddList(jp.intermediaryChannel);
	        webChannel.sendSrvMsg(this.name, idToRemove, {
	          code: ADD_INTERMEDIARY_CHANNEL, jpId: jpId
	        });
	        ids.splice(ids.indexOf(idToRemove), 1);
	      }
	      return ids;
	    }

	    /**
	     * Adds a new peer into Web Channel.
	     *
	     * @abstract
	     * @param  {Channel} ch - Channel to be added (it should has
	     * the `webChannel` property).
	     * @return {Promise} - Resolved once the channel has been succesfully added,
	     * rejected otherwise.
	     */

	  }, {
	    key: 'add',
	    value: function add(ch) {
	      throw new Error('Must be implemented by subclass!');
	    }

	    /**
	     * Send a message to all peers in Web Channel.
	     *
	     * @abstract
	     * @param  {WebChannel} wc - Web Channel where the message will be propagated.
	     * @param  {string} data - Data in stringified JSON format to be send.
	     */

	  }, {
	    key: 'broadcast',
	    value: function broadcast(wc, data) {
	      throw new Error('Must be implemented by subclass!');
	    }

	    /**
	     * Send a message to a particular peer in Web Channel.
	     *
	     * @abstract
	     * @param  {string} id - Peer id.
	     * @param  {WebChannel} wc - Web Channel where the message will be propagated.
	     * @param  {string} data - Data in stringified JSON format to be send.
	     */

	  }, {
	    key: 'sendTo',
	    value: function sendTo(id, wc, data) {
	      throw new Error('Must be implemented by subclass!');
	    }

	    /**
	     * Leave Web Channel.
	     *
	     * @abstract
	     * @param  {WebChannel} wc - Web Channel to leave.
	     */

	  }, {
	    key: 'leave',
	    value: function leave(wc) {
	      throw new Error('Must be implemented by subclass!');
	    }
	  }]);

	  return Interface;
	}(service.Interface);

	exports.
	/** @see module:webChannelManager~Interface */
	Interface = Interface;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Service module includes {@link module:channelBuilder},
	 * {@link module:webChannelManager} and {@link module:channelProxy} modules.
	 * Services are substitutable stateless objects. Each service is identified by
	 * its class name and can receive messages via `WebChannel` sent by another
	 * service.
	 *
	 * @module service
	 * @see module:channelBuilder
	 * @see module:webChannelManager
	 * @see module:channelProxy
	 */

	/**
	 * Each service must implement this interface.
	 *
	 * @interface
	 */

	var Interface = function () {
	  function Interface() {
	    _classCallCheck(this, Interface);
	  }

	  _createClass(Interface, [{
	    key: "name",


	    /**
	     * Service name which corresponds to its class name.
	     *
	     * @return {string} - name
	     */
	    get: function get() {
	      return this.constructor.name;
	    }
	  }]);

	  return Interface;
	}();

	exports.
	/** @see module:service~Interface */
	Interface = Interface;

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * This class represents a temporary state of a peer, while he is about to join
	 * the web channel. During the joining process every peer in the web channel
	 * and the joining peer have an instance of this class with the same `id` and
	 * `intermediaryId` attribute values. After the joining process has been finished
	 * regardless of success, these instances will be deleted.
	 */

	var JoiningPeer = function () {
	  function JoiningPeer(id, intermediaryId) {
	    _classCallCheck(this, JoiningPeer);

	    /**
	     * The joining peer id.
	     *
	     * @type {string}
	     */
	    this.id = id;

	    /**
	     * The id of the peer who invited the joining peer to the web channel. It is
	     * a member of the web channel and called an intermediary peer between the
	     * joining peer and the web channel. The same value for all instances.
	     *
	     * @type {string}
	     */
	    this.intermediaryId = intermediaryId;

	    /**
	     * The channel between the joining peer and intermediary peer. It is null
	     * for every peer, but the joining and intermediary peers.
	     *
	     * @type {Channel}
	     */
	    this.intermediaryChannel = null;

	    /**
	     * This attribute is proper to each peer. Array of channels which will be
	     * added to the current peer once the joining peer become the member of the
	     * web channel.
	     *
	     * @type {Array[Channel]}
	     */
	    this.channelsToAdd = [];

	    /**
	     * This attribute is proper to each peer. Array of channels which will be
	     * closed with the current peer once the joining peer become the member of the
	     * web channel.
	     *
	     * @type {Array[Channel]}
	     */
	    this.channelsToRemove = [];
	  }

	  /**
	   * Add channel to `channelsToAdd` array.
	   *
	   * @param  {Channel} channel - Channel to add.
	   */


	  _createClass(JoiningPeer, [{
	    key: "toAddList",
	    value: function toAddList(channel) {
	      this.channelsToAdd[this.channelsToAdd.length] = channel;
	    }

	    /**
	     * Add channel to `channelsToRemove` array
	     *
	     * @param  {Channel} channel - Channel to add.
	     */

	  }, {
	    key: "toRemoveList",
	    value: function toRemoveList(channel) {
	      this.channelsToAdd[this.channelsToAdd.length] = channel;
	    }
	  }]);

	  return JoiningPeer;
	}();

	exports.default = JoiningPeer;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @external RTCPeerConnection
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @see {@link https://developer.mozilla.org/en/docs/Web/API/RTCPeerConnection}
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */
	/**
	 * @external RTCSessionDescription
	 * @see {@link https://developer.mozilla.org/en/docs/Web/API/RTCSessionDescription}
	 */
	/**
	 * @external RTCDataChannel
	 * @see {@link https://developer.mozilla.org/en/docs/Web/API/RTCDataChannel}
	 */
	/**
	 * @external RTCIceCandidate
	 * @see {@link https://developer.mozilla.org/en/docs/Web/API/RTCIceCandidate}
	 */
	/**
	 * @external RTCPeerConnectionIceEvent
	 * @see {@link https://developer.mozilla.org/en/docs/Web/API/RTCPeerConnectionIceEvent}
	 */

	var _channelBuilder = __webpack_require__(8);

	var channelBuilder = _interopRequireWildcard(_channelBuilder);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Ice candidate event handler.
	 *
	 * @callback WebRTCService~onCandidate
	 * @param {external:RTCPeerConnectionIceEvent} evt - Event.
	 */

	/**
	 * Session description event handler.
	 *
	 * @callback WebRTCService~onSDP
	 * @param {external:RTCPeerConnectionIceEvent} evt - Event.
	 */

	/**
	 * Data channel event handler.
	 *
	 * @callback WebRTCService~onChannel
	 * @param {external:RTCPeerConnectionIceEvent} evt - Event.
	 */

	/**
	 * The goal of this class is to prevent the error when adding an ice candidate
	 * before the remote description has been set.
	 */

	var RTCPendingConnections = function () {
	  function RTCPendingConnections() {
	    _classCallCheck(this, RTCPendingConnections);

	    this.connections = new Map();
	  }

	  /**
	   * Prepares pending connection for the specified peer only if it has not been added already.
	   *
	   * @param  {string} id - Peer id
	   */


	  _createClass(RTCPendingConnections, [{
	    key: 'add',
	    value: function add(id) {
	      var _this = this;

	      if (!this.connections.has(id)) {
	        (function () {
	          var pc = null;
	          var obj = { promise: null };
	          obj.promise = new Promise(function (resolve, reject) {
	            Object.defineProperty(obj, 'pc', {
	              get: function get() {
	                return pc;
	              },
	              set: function set(value) {
	                pc = value;
	                resolve();
	              }
	            });
	            setTimeout(reject, CONNECT_TIMEOUT, 'timeout');
	          });
	          _this.connections.set(id, obj);
	        })();
	      }
	    }

	    /**
	     * Remove a pending connection from the Map. Usually when the connection has already
	     * been established and there is now interest to hold this reference.
	     *
	     * @param  {string} id - Peer id.
	     */

	  }, {
	    key: 'remove',
	    value: function remove(id) {
	      this.connections.delete(id);
	    }

	    /**
	     * Returns RTCPeerConnection object for the provided peer id.
	     *
	     * @param  {string} id - Peer id.
	     * @return {external:RTCPeerConnection} - Peer connection.
	     */

	  }, {
	    key: 'getPC',
	    value: function getPC(id) {
	      return this.connections.get(id).pc;
	    }

	    /**
	     * Updates RTCPeerConnection reference for the provided peer id.
	     *
	     * @param  {string} id - Peer id.
	     * @param  {external:RTCPeerConnection} pc - Peer connection.
	     */

	  }, {
	    key: 'setPC',
	    value: function setPC(id, pc) {
	      this.connections.get(id).pc = pc;
	    }

	    /**
	     * When the remote description is set, it will add the ice candidate to the
	     * peer connection of specified peer.
	     *
	     * @param  {string} id - Peer id.
	     * @param  {external:RTCIceCandidate} candidate - Ice candidate.
	     * @return {Promise} - Resolved once the ice candidate has been succesfully added.
	     */

	  }, {
	    key: 'addIceCandidate',
	    value: function addIceCandidate(id, candidate) {
	      var obj = this.connections.get(id);
	      return obj.promise.then(function () {
	        return obj.pc.addIceCandidate(candidate);
	      });
	    }
	  }]);

	  return RTCPendingConnections;
	}();

	var CONNECT_TIMEOUT = 2000;
	var connectionsByWC = new Map();

	/**
	 * Service class responsible to establish connections between peers via
	 * `RTCDataChannel`.
	 *
	 * @see {@link external:RTCPeerConnection}
	 * @extends module:channelBuilder~Interface
	 */

	var WebRTCService = function (_channelBuilder$Inter) {
	  _inherits(WebRTCService, _channelBuilder$Inter);

	  /**
	   * WebRTCService constructor.
	   *
	   * @param  {Object} [options] - This service options.
	   * @param  {Object} [options.signaling='wws://sigver-coastteam.rhcloud.com:8000'] -
	   * Signaling server URL.
	   * @param  {Object[]} [options.iceServers=[{urls: 'stun:23.21.150.121'},{urls: 'stun:stun.l.google.com:19302'},{urls: 'turn:numb.viagenie.ca', credential: 'webrtcdemo', username: 'louis%40mozilla.com'}]] - WebRTC options to setup which STUN
	   * and TURN servers to be used.
	   */

	  function WebRTCService() {
	    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	    _classCallCheck(this, WebRTCService);

	    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(WebRTCService).call(this));

	    _this2.defaults = {
	      signaling: 'wws://sigver-coastteam.rhcloud.com:8000',
	      iceServers: [{ urls: 'stun:23.21.150.121' }, { urls: 'stun:stun.l.google.com:19302' }, { urls: 'turn:numb.viagenie.ca', credential: 'webrtcdemo', username: 'louis%40mozilla.com' }]
	    };
	    _this2.settings = Object.assign({}, _this2.defaults, options);
	    return _this2;
	  }

	  _createClass(WebRTCService, [{
	    key: 'open',
	    value: function open(key, onChannel) {
	      var _this3 = this;

	      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	      var settings = Object.assign({}, this.settings, options);
	      return new Promise(function (resolve, reject) {
	        var connections = new RTCPendingConnections();
	        var socket = void 0;
	        try {
	          socket = new window.WebSocket(settings.signaling);
	        } catch (err) {
	          reject(err.message);
	        }
	        // Send a message to signaling server: ready to receive offer
	        socket.onopen = function () {
	          try {
	            socket.send(JSON.stringify({ key: key }));
	          } catch (err) {
	            reject(err.message);
	          }
	          // TODO: find a better solution than setTimeout. This is for the case when the key already exists and thus the server will close the socket, but it will close it after this function resolves the Promise.
	          setTimeout(resolve, 100, { key: key, url: settings.signaling, socket: socket });
	        };
	        socket.onmessage = function (evt) {
	          var msg = JSON.parse(evt.data);
	          if (!Reflect.has(msg, 'id') || !Reflect.has(msg, 'data')) {
	            console.log('Unknown message from the signaling server: ' + evt.data);
	            socket.close();
	            return;
	          }
	          connections.add(msg.id);
	          if (Reflect.has(msg.data, 'offer')) {
	            _this3.createPeerConnectionAndAnswer(function (candidate) {
	              return socket.send(JSON.stringify({ id: msg.id, data: { candidate: candidate } }));
	            }, function (answer) {
	              return socket.send(JSON.stringify({ id: msg.id, data: { answer: answer } }));
	            }, onChannel, msg.data.offer).then(function (pc) {
	              return connections.setPC(msg.id, pc);
	            }).catch(function (reason) {
	              console.error('Answer generation failed: ' + reason);
	            });
	          } else if (Reflect.has(msg.data, 'candidate')) {
	            connections.addIceCandidate(msg.id, _this3.createIceCandidate(msg.data.candidate)).catch(function (reason) {
	              console.error('Adding ice candidate failed: ' + reason);
	            });
	          }
	        };
	        socket.onclose = function (closeEvt) {
	          if (closeEvt.code !== 1000) {
	            console.error('Socket with signaling server ' + settings.signaling + ' has been closed with code ' + closeEvt.code + ': ' + closeEvt.reason);
	            reject(closeEvt.reason);
	          }
	        };
	      });
	    }
	  }, {
	    key: 'join',
	    value: function join(key) {
	      var _this4 = this;

	      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	      var settings = Object.assign({}, this.settings, options);
	      return new Promise(function (resolve, reject) {
	        var pc = void 0;
	        // Connect to the signaling server
	        var socket = new WebSocket(settings.signaling);
	        socket.onopen = function () {
	          // Prepare and send offer
	          _this4.createPeerConnectionAndOffer(function (candidate) {
	            return socket.send(JSON.stringify({ data: { candidate: candidate } }));
	          }, function (offer) {
	            return socket.send(JSON.stringify({ join: key, data: { offer: offer } }));
	          }, resolve).then(function (peerConnection) {
	            pc = peerConnection;
	          }).catch(reject);
	        };
	        socket.onmessage = function (evt) {
	          try {
	            var msg = JSON.parse(evt.data);
	            // Check message format
	            if (!Reflect.has(msg, 'data')) {
	              reject('Unknown message from the signaling server: ' + evt.data);
	            }

	            if (Reflect.has(msg.data, 'answer')) {
	              pc.setRemoteDescription(_this4.createSessionDescription(msg.data.answer)).catch(reject);
	            } else if (Reflect.has(msg.data, 'candidate')) {
	              pc.addIceCandidate(_this4.createIceCandidate(msg.data.candidate)).catch(function (evt) {
	                // This exception does not reject the current Promise, because
	                // still the connection may be established even without one or
	                // several candidates
	                console.error('Adding candidate failed: ', evt);
	              });
	            } else {
	              reject('Unknown message from the signaling server: ' + evt.data);
	            }
	          } catch (err) {
	            reject(err.message);
	          }
	        };
	        socket.onerror = function (evt) {
	          reject('WebSocket with signaling server error');
	        };
	        socket.onclose = function (closeEvt) {
	          if (closeEvt.code !== 1000) {
	            reject('Socket with signaling server ' + settings.signaling + ' has been closed with code ' + closeEvt.code + ': ' + closeEvt.reason);
	          }
	        };
	      });
	    }
	  }, {
	    key: 'connectMeTo',
	    value: function connectMeTo(wc, id) {
	      var _this5 = this;

	      return new Promise(function (resolve, reject) {
	        var sender = wc.myId;
	        var connections = _this5.getPendingConnections(wc);
	        connections.add(id);
	        _this5.createPeerConnectionAndOffer(function (candidate) {
	          return wc.sendSrvMsg(_this5.name, id, { sender: sender, candidate: candidate });
	        }, function (offer) {
	          return wc.sendSrvMsg(_this5.name, id, { sender: sender, offer: offer });
	        }, function (channel) {
	          connections.remove(id);
	          resolve(channel);
	        }).then(function (pc) {
	          return connections.setPC(id, pc);
	        });
	        setTimeout(reject, CONNECT_TIMEOUT, 'Timeout');
	      });
	    }
	  }, {
	    key: 'onMessage',
	    value: function onMessage(wc, channel, msg) {
	      var _this6 = this;

	      var connections = this.getPendingConnections(wc);
	      connections.add(msg.sender);
	      if (Reflect.has(msg, 'offer')) {
	        this.createPeerConnectionAndAnswer(function (candidate) {
	          return wc.sendSrvMsg(_this6.name, msg.sender, { sender: wc.myId, candidate: candidate });
	        }, function (answer) {
	          return wc.sendSrvMsg(_this6.name, msg.sender, { sender: wc.myId, answer: answer });
	        }, function (channel) {
	          wc.initChannel(channel, false, msg.sender);
	          connections.remove(channel.peerId);
	        }, msg.offer).then(function (pc) {
	          connections.setPC(msg.sender, pc);
	        });
	      }if (Reflect.has(msg, 'answer')) {
	        connections.getPC(msg.sender).setRemoteDescription(this.createSessionDescription(msg.answer)).catch(function (reason) {
	          console.error('Setting answer error: ' + reason);
	        });
	      } else if (Reflect.has(msg, 'candidate')) {
	        connections.addIceCandidate(msg.sender, this.createIceCandidate(msg.candidate)).catch(function (reason) {
	          console.error('Setting candidate error: ' + reason);
	        });
	      }
	    }

	    /**
	     * Creates a peer connection and generates an SDP offer.
	     *
	     * @param  {WebRTCService~onCandidate} onCandidate - Ice candidate event handler.
	     * @param  {WebRTCService~onSDP} sendOffer - Session description event handler.
	     * @param  {WebRTCService~onChannel} onChannel - Handler event when the data channel is ready.
	     * @return {Promise} - Resolved when the offer has been succesfully created,
	     * set as local description and sent to the peer.
	     */

	  }, {
	    key: 'createPeerConnectionAndOffer',
	    value: function createPeerConnectionAndOffer(onCandidate, sendOffer, onChannel) {
	      var pc = this.createPeerConnection(onCandidate);
	      var dc = pc.createDataChannel(null);
	      pc.oniceconnectionstatechange = function () {
	        if (pc.iceConnectionState === 'disconnected') {
	          dc.onclose();
	        }
	      };
	      dc.onopen = function (evt) {
	        return onChannel(dc);
	      };
	      return pc.createOffer().then(function (offer) {
	        return pc.setLocalDescription(offer);
	      }).then(function () {
	        sendOffer(pc.localDescription.toJSON());
	        return pc;
	      });
	    }

	    /**
	     * Creates a peer connection and generates an SDP answer.
	     *
	     * @param  {WebRTCService~onCandidate} onCandidate - Ice candidate event handler.
	     * @param  {WebRTCService~onSDP} sendOffer - Session description event handler.
	     * @param  {WebRTCService~onChannel} onChannel - Handler event when the data channel is ready.
	     * @param  {Object} offer - Offer received from a peer.
	     * @return {Promise} - Resolved when the offer has been succesfully created,
	     * set as local description and sent to the peer.
	     */

	  }, {
	    key: 'createPeerConnectionAndAnswer',
	    value: function createPeerConnectionAndAnswer(onCandidate, sendAnswer, onChannel, offer) {
	      var pc = this.createPeerConnection(onCandidate);
	      pc.ondatachannel = function (dcEvt) {
	        var dc = dcEvt.channel;
	        pc.oniceconnectionstatechange = function () {
	          if (pc.iceConnectionState === 'disconnected') {
	            dc.onclose();
	          }
	        };
	        dc.onopen = function (evt) {
	          return onChannel(dc);
	        };
	      };
	      return pc.setRemoteDescription(this.createSessionDescription(offer)).then(function () {
	        return pc.createAnswer();
	      }).then(function (answer) {
	        return pc.setLocalDescription(answer);
	      }).then(function () {
	        sendAnswer(pc.localDescription.toJSON());
	        return pc;
	      });
	    }

	    /**
	     * Creates an instance of `RTCPeerConnection` and sets `onicecandidate` event handler.
	     *
	     * @private
	     * @param  {WebRTCService~onCandidate} onCandidate - Ice
	     * candidate event handler.
	     * @return {external:RTCPeerConnection} - Peer connection.
	     */

	  }, {
	    key: 'createPeerConnection',
	    value: function createPeerConnection(onCandidate) {
	      var pc = new RTCPeerConnection({ iceServers: this.settings.iceServers });
	      pc.onicecandidate = function (evt) {
	        if (evt.candidate !== null) {
	          var candidate = {
	            candidate: evt.candidate.candidate,
	            sdpMLineIndex: evt.candidate.sdpMLineIndex
	          };
	          onCandidate(candidate);
	        }
	      };
	      return pc;
	    }

	    /**
	     * Creates an instance of `RTCIceCandidate`.
	     *
	     * @private
	     * @param  {Object} candidate - Candidate object created in
	     * {@link WebRTCService#createPeerConnection}.
	     * @param {} candidate.candidate
	     * @param {} candidate.sdpMLineIndex
	     * @return {external:RTCIceCandidate} - Ice candidate.
	     */

	  }, {
	    key: 'createIceCandidate',
	    value: function createIceCandidate(candidate) {
	      return new RTCIceCandidate(candidate);
	    }

	    /**
	     * Creates an instance of `RTCSessionDescription`.
	     *
	     * @private
	     * @param  {Object} sd - An offer or an answer created by WebRTC API.
	     * @param  {} sd.type
	     * @param  {} sd.sdp
	     * @return {external:RTCSessionDescription} - Session description.
	     */

	  }, {
	    key: 'createSessionDescription',
	    value: function createSessionDescription(sd) {
	      return Object.assign(new RTCSessionDescription(), sd);
	    }
	  }, {
	    key: 'getPendingConnections',
	    value: function getPendingConnections(wc) {
	      if (connectionsByWC.has(wc.id)) {
	        return connectionsByWC.get(wc.id);
	      } else {
	        var connections = new RTCPendingConnections();
	        connectionsByWC.set(wc.id, connections);
	        return connections;
	      }
	    }
	  }]);

	  return WebRTCService;
	}(channelBuilder.Interface);

	exports.default = WebRTCService;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Interface = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _service = __webpack_require__(5);

	var service = _interopRequireWildcard(_service);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * Channel Builder module is responsible to create a connection between two
	 * peers.
	 * @module channelBuilder
	 * @see Channel
	 */

	/**
	 * On channel callback for {@link module:channelBuilder~Interface#open}
	 * function.
	 *
	 * @callback module:channelBuilder~onChannelCallback
	 * @param {Channel} channel - A new channel.
	 */

	/**
	 * Call back to initialize the channel. It should be executed on both peer
	 * sides during connection establishment to assure that both channels would be
	 * ready to be used in the web channel.
	 *
	 * @callback module:channelBuilder~initChannel
	 * @param {Channel} ch - Channel.
	 * @param {string} id - Unique channel identifier.
	 */

	/**
	 * Interface to be implemented by each connection service.
	 *
	 * @interface
	 * @extends module:service~Interface
	 */

	var Interface = function (_service$Interface) {
	  _inherits(Interface, _service$Interface);

	  function Interface() {
	    _classCallCheck(this, Interface);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Interface).apply(this, arguments));
	  }

	  _createClass(Interface, [{
	    key: 'open',

	    /**
	     * Enables other clients to establish a connection with you.
	     *
	     * @abstract
	     * @param {string} key - The unique identifier which has to be passed to the
	     * peers who need to connect to you.
	     * @param {module:channelBuilder~Interface~onChannelCallback} onChannel - Callback
	     * function to execute once the connection has been established.
	     * @param {Object} [options] - Any other options which depend on the service implementation.
	     * @return {Promise} - Once resolved, provide an Object with `key` and `url`
	     * attributes to be passed to {@link module:channelBuilder~Interface#join} function.
	     * It is rejected if an error occured.
	     */
	    value: function open(key, onChannel, options) {
	      throw new Error('Must be implemented by subclass!');
	    }

	    /**
	     * Connects you with the peer who provided the `key`.
	     *
	     * @abstract
	     * @param  {string} key - A key obtained from the peer who executed
	     * {@link module:channelBuilder~Interface#open} function.
	     * @param  {Object} [options] Any other options which depend on the implementation.
	     * @return {Promise} It is resolved when the connection is established, otherwise it is rejected.
	     */

	  }, {
	    key: 'join',
	    value: function join(key, options) {
	      throw new Error('Must be implemented by subclass!');
	    }

	    /**
	     * Establish a connection between you and another peer (including joining peer) via web channel.
	     *
	     * @abstract
	     * @param  {WebChannel} wc - Web Channel through which the connection will be established.
	     * @param  {string} id - Peer id with whom you will be connected.
	     * @return {Promise} - Resolved once the connection has been established, rejected otherwise.
	     */

	  }, {
	    key: 'connectMeTo',
	    value: function connectMeTo(wc, id) {
	      throw new Error('Must be implemented by subclass!');
	    }
	  }]);

	  return Interface;
	}(service.Interface);

	exports.
	/** @see module:channelBuilder~Interface */
	Interface = Interface;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.HEADER_OFFSET = exports.USER_MSG_OFFSET = exports.MAX_USER_MSG_SIZE = exports.MAX_MSG_SIZE = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _service = __webpack_require__(5);

	var service = _interopRequireWildcard(_service);

	var _WebChannel = __webpack_require__(1);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	// Max message size sent on Channel: 16kb
	var MAX_MSG_SIZE = exports.MAX_MSG_SIZE = 16384;

	var MAX_USER_MSG_SIZE = exports.MAX_USER_MSG_SIZE = 16366;

	var USER_MSG_OFFSET = exports.USER_MSG_OFFSET = 18;

	var HEADER_OFFSET = exports.HEADER_OFFSET = 9;

	var MAX_MSG_ID_SIZE = 65535;

	var ARRAY_BUFFER_TYPE = 1;
	var U_INT_8_ARRAY_TYPE = 2;
	var STRING_TYPE = 3;
	var INT_8_ARRAY_TYPE = 4;
	var U_INT_8_CLAMPED_ARRAY_TYPE = 5;
	var INT_16_ARRAY_TYPE = 6;
	var U_INT_16_ARRAY_TYPE = 7;
	var INT_32_ARRAY_TYPE = 8;
	var U_INT_32_ARRAY_TYPE = 9;
	var FLOAT_32_ARRAY_TYPE = 10;
	var FLOAT_64_ARRAY_TYPE = 11;
	var DATA_VIEW_TYPE = 12;

	var buffers = new Map();

	var MessageBuilder = function (_service$Interface) {
	  _inherits(MessageBuilder, _service$Interface);

	  function MessageBuilder() {
	    _classCallCheck(this, MessageBuilder);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(MessageBuilder).apply(this, arguments));
	  }

	  _createClass(MessageBuilder, [{
	    key: 'handleUserMessage',
	    value: function handleUserMessage(data, senderId, recipientId, action) {
	      var workingData = this.userDataToType(data);
	      var dataUint8Array = workingData.content;
	      if (dataUint8Array.byteLength <= MAX_USER_MSG_SIZE) {
	        var dataView = this.writeHeader(_WebChannel.USER_DATA, senderId, recipientId, dataUint8Array.byteLength + USER_MSG_OFFSET);
	        dataView.setUint32(HEADER_OFFSET, dataUint8Array.byteLength);
	        dataView.setUint8(13, workingData.type);
	        var resultUint8Array = new Uint8Array(dataView.buffer);
	        resultUint8Array.set(dataUint8Array, USER_MSG_OFFSET);
	        action(resultUint8Array.buffer);
	      } else {
	        var msgId = Math.ceil(Math.random() * MAX_MSG_ID_SIZE);
	        var totalChunksNb = Math.ceil(dataUint8Array.byteLength / MAX_USER_MSG_SIZE);
	        for (var chunkNb = 0; chunkNb < totalChunksNb; chunkNb++) {
	          var currentChunkMsgByteLength = Math.min(MAX_USER_MSG_SIZE, dataUint8Array.byteLength - MAX_USER_MSG_SIZE * chunkNb);
	          var _dataView = this.writeHeader(_WebChannel.USER_DATA, senderId, recipientId, USER_MSG_OFFSET + currentChunkMsgByteLength);
	          _dataView.setUint32(9, dataUint8Array.byteLength);
	          _dataView.setUint8(13, workingData.type);
	          _dataView.setUint16(14, msgId);
	          _dataView.setUint16(16, chunkNb);
	          var _resultUint8Array = new Uint8Array(_dataView.buffer);
	          var j = USER_MSG_OFFSET;
	          var startIndex = MAX_USER_MSG_SIZE * chunkNb;
	          var endIndex = startIndex + currentChunkMsgByteLength;
	          for (var i = startIndex; i < endIndex; i++) {
	            _resultUint8Array[j++] = dataUint8Array[i];
	          }
	          action(_resultUint8Array.buffer);
	        }
	      }
	    }
	  }, {
	    key: 'msg',
	    value: function msg(code) {
	      var data = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	      var msgEncoded = new TextEncoder().encode(JSON.stringify(data));
	      var msgSize = msgEncoded.byteLength + HEADER_OFFSET;
	      var dataView = this.writeHeader(code, null, null, msgSize);
	      var fullMsg = new Uint8Array(dataView.buffer);
	      fullMsg.set(msgEncoded, HEADER_OFFSET);
	      return fullMsg;
	    }
	  }, {
	    key: 'readUserMessage',
	    value: function readUserMessage(wcId, senderId, data, action) {
	      var _this2 = this;

	      var dataView = new DataView(data);
	      var msgSize = dataView.getUint32(HEADER_OFFSET);
	      var dataType = dataView.getUint8(13);
	      if (msgSize > MAX_USER_MSG_SIZE) {
	        var msgId = dataView.getUint16(14);
	        var chunk = dataView.getUint16(16);
	        var buffer = this.getBuffer(wcId, senderId, msgId);
	        if (buffer === undefined) {
	          this.setBuffer(wcId, senderId, msgId, new Buffer(msgSize, data, chunk, function (fullData) {
	            action(_this2.extractUserData(fullData, dataType));
	          }));
	        } else {
	          buffer.add(data, chunk);
	        }
	      } else {
	        var dataArray = new Uint8Array(data);
	        var userData = new Uint8Array(data.byteLength - USER_MSG_OFFSET);
	        var j = USER_MSG_OFFSET;
	        for (var i in userData) {
	          userData[i] = dataArray[j++];
	        }
	        action(this.extractUserData(userData.buffer, dataType));
	      }
	    }
	  }, {
	    key: 'readInternalMessage',
	    value: function readInternalMessage(data) {
	      var uInt8Array = new Uint8Array(data);
	      return JSON.parse(new TextDecoder().decode(uInt8Array.subarray(HEADER_OFFSET, uInt8Array.byteLength)));
	    }
	  }, {
	    key: 'readHeader',
	    value: function readHeader(data) {
	      var dataView = new DataView(data);
	      return {
	        code: dataView.getUint8(0),
	        senderId: dataView.getUint32(1),
	        recepientId: dataView.getUint32(5)
	      };
	    }
	  }, {
	    key: 'writeHeader',
	    value: function writeHeader(code, senderId, recipientId, dataSize) {
	      var dataView = new DataView(new ArrayBuffer(dataSize));
	      dataView.setUint8(0, code);
	      dataView.setUint32(1, senderId);
	      dataView.setUint32(5, recipientId);
	      return dataView;
	    }
	  }, {
	    key: 'extractUserData',
	    value: function extractUserData(buffer, type) {
	      switch (type) {
	        case ARRAY_BUFFER_TYPE:
	          return buffer;
	        case U_INT_8_ARRAY_TYPE:
	          return new Uint8Array(buffer);
	        case STRING_TYPE:
	          return new TextDecoder().decode(new Uint8Array(buffer));
	        case INT_8_ARRAY_TYPE:
	          return new Int8Array(buffer);
	        case U_INT_8_CLAMPED_ARRAY_TYPE:
	          return new Uint8ClampedArray(buffer);
	        case INT_16_ARRAY_TYPE:
	          return new Int16Array(buffer);
	        case U_INT_16_ARRAY_TYPE:
	          return new Uint16Array(buffer);
	        case INT_32_ARRAY_TYPE:
	          return new Int32Array(buffer);
	        case U_INT_32_ARRAY_TYPE:
	          return new Uint32Array(buffer);
	        case FLOAT_32_ARRAY_TYPE:
	          return new Float32Array(buffer);
	        case FLOAT_64_ARRAY_TYPE:
	          return new Float64Array(buffer);
	        case DATA_VIEW_TYPE:
	          return new DataView(buffer);
	      }
	    }
	  }, {
	    key: 'userDataToType',
	    value: function userDataToType(data) {
	      var result = {};
	      if (data instanceof ArrayBuffer) {
	        result.type = ARRAY_BUFFER_TYPE;
	        result.content = new Uint8Array(data);
	      } else if (data instanceof Uint8Array) {
	        result.type = U_INT_8_ARRAY_TYPE;
	        result.content = data;
	      } else if (typeof data === 'string' || data instanceof String) {
	        result.type = STRING_TYPE;
	        result.content = new TextEncoder().encode(data);
	      } else {
	        result.content = new Uint8Array(data.buffer);
	        if (data instanceof Int8Array) {
	          result.type = INT_8_ARRAY_TYPE;
	        } else if (data instanceof Uint8ClampedArray) {
	          result.type = U_INT_8_CLAMPED_ARRAY_TYPE;
	        } else if (data instanceof Int16Array) {
	          result.type = INT_16_ARRAY_TYPE;
	        } else if (data instanceof Uint16Array) {
	          result.type = U_INT_16_ARRAY_TYPE;
	        } else if (data instanceof Int32Array) {
	          result.type = INT_32_ARRAY_TYPE;
	        } else if (data instanceof Uint32Array) {
	          result.type = U_INT_32_ARRAY_TYPE;
	        } else if (data instanceof Float32Array) {
	          result.type = FLOAT_32_ARRAY_TYPE;
	        } else if (data instanceof Float64Array) {
	          result.type = FLOAT_64_ARRAY_TYPE;
	        } else if (data instanceof DataView) {
	          result.type = DATA_VIEW_TYPE;
	        } else {
	          throw new Error('Unknown data object');
	        }
	      }
	      return result;
	    }
	  }, {
	    key: 'getBuffer',
	    value: function getBuffer(wcId, peerId, msgId) {
	      var wcBuffer = buffers.get(wcId);
	      if (wcBuffer !== undefined) {
	        var peerBuffer = wcBuffer.get(peerId);
	        if (peerBuffer !== undefined) {
	          return peerBuffer.get(msgId);
	        }
	      }
	      return undefined;
	    }
	  }, {
	    key: 'setBuffer',
	    value: function setBuffer(wcId, peerId, msgId, buffer) {
	      var wcBuffer = buffers.get(wcId);
	      if (wcBuffer === undefined) {
	        wcBuffer = new Map();
	        buffers.set(wcId, wcBuffer);
	      }
	      var peerBuffer = wcBuffer.get(peerId);
	      if (peerBuffer === undefined) {
	        peerBuffer = new Map();
	        wcBuffer.set(peerId, peerBuffer);
	      }
	      peerBuffer.set(msgId, buffer);
	    }
	  }]);

	  return MessageBuilder;
	}(service.Interface);

	var Buffer = function () {
	  function Buffer(fullDataSize, data, chunkNb, action) {
	    _classCallCheck(this, Buffer);

	    this.fullData = new Uint8Array(fullDataSize);
	    this.currentSize = 0;
	    this.action = action;
	    this.add(data, chunkNb);
	  }

	  _createClass(Buffer, [{
	    key: 'add',
	    value: function add(data, chunkNb) {
	      var dataChunk = new Uint8Array(data);
	      var dataChunkSize = data.byteLength;
	      this.currentSize += dataChunkSize - USER_MSG_OFFSET;
	      var index = chunkNb * MAX_USER_MSG_SIZE;
	      for (var i = USER_MSG_OFFSET; i < dataChunkSize; i++) {
	        this.fullData[index++] = dataChunk[i];
	      }
	      if (this.currentSize === this.fullData.byteLength) {
	        this.action(this.fullData.buffer);
	      }
	    }
	  }]);

	  return Buffer;
	}();

	exports.default = MessageBuilder;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10).Buffer))

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer, global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */

	'use strict'

	var base64 = __webpack_require__(11)
	var ieee754 = __webpack_require__(12)
	var isArray = __webpack_require__(13)

	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50
	Buffer.poolSize = 8192 // not used by this implementation

	var rootParent = {}

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
	 *     on objects.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.

	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
	  ? global.TYPED_ARRAY_SUPPORT
	  : typedArraySupport()

	function typedArraySupport () {
	  function Bar () {}
	  try {
	    var arr = new Uint8Array(1)
	    arr.foo = function () { return 42 }
	    arr.constructor = Bar
	    return arr.foo() === 42 && // typed array instances can be augmented
	        arr.constructor === Bar && // constructor can be set
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	}

	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}

	/**
	 * Class: Buffer
	 * =============
	 *
	 * The Buffer constructor returns instances of `Uint8Array` that are augmented
	 * with function properties for all the node `Buffer` API functions. We use
	 * `Uint8Array` so that square bracket notation works as expected -- it returns
	 * a single octet.
	 *
	 * By augmenting the instances, we can avoid modifying the `Uint8Array`
	 * prototype.
	 */
	function Buffer (arg) {
	  if (!(this instanceof Buffer)) {
	    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
	    if (arguments.length > 1) return new Buffer(arg, arguments[1])
	    return new Buffer(arg)
	  }

	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    this.length = 0
	    this.parent = undefined
	  }

	  // Common case.
	  if (typeof arg === 'number') {
	    return fromNumber(this, arg)
	  }

	  // Slightly less common case.
	  if (typeof arg === 'string') {
	    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
	  }

	  // Unusual.
	  return fromObject(this, arg)
	}

	function fromNumber (that, length) {
	  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < length; i++) {
	      that[i] = 0
	    }
	  }
	  return that
	}

	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'

	  // Assumption: byteLength() return value is always < kMaxLength.
	  var length = byteLength(string, encoding) | 0
	  that = allocate(that, length)

	  that.write(string, encoding)
	  return that
	}

	function fromObject (that, object) {
	  if (Buffer.isBuffer(object)) return fromBuffer(that, object)

	  if (isArray(object)) return fromArray(that, object)

	  if (object == null) {
	    throw new TypeError('must start with number, buffer, array or string')
	  }

	  if (typeof ArrayBuffer !== 'undefined') {
	    if (object.buffer instanceof ArrayBuffer) {
	      return fromTypedArray(that, object)
	    }
	    if (object instanceof ArrayBuffer) {
	      return fromArrayBuffer(that, object)
	    }
	  }

	  if (object.length) return fromArrayLike(that, object)

	  return fromJsonObject(that, object)
	}

	function fromBuffer (that, buffer) {
	  var length = checked(buffer.length) | 0
	  that = allocate(that, length)
	  buffer.copy(that, 0, 0, length)
	  return that
	}

	function fromArray (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	// Duplicate of fromArray() to keep fromArray() monomorphic.
	function fromTypedArray (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  // Truncating the elements is probably not what people expect from typed
	  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
	  // of the old Buffer constructor.
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	function fromArrayBuffer (that, array) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    array.byteLength
	    that = Buffer._augment(new Uint8Array(array))
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromTypedArray(that, new Uint8Array(array))
	  }
	  return that
	}

	function fromArrayLike (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
	// Returns a zero-length buffer for inputs that don't conform to the spec.
	function fromJsonObject (that, object) {
	  var array
	  var length = 0

	  if (object.type === 'Buffer' && isArray(object.data)) {
	    array = object.data
	    length = checked(array.length) | 0
	  }
	  that = allocate(that, length)

	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype
	  Buffer.__proto__ = Uint8Array
	} else {
	  // pre-set for values that may exist in the future
	  Buffer.prototype.length = undefined
	  Buffer.prototype.parent = undefined
	}

	function allocate (that, length) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = Buffer._augment(new Uint8Array(length))
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that.length = length
	    that._isBuffer = true
	  }

	  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
	  if (fromPool) that.parent = rootParent

	  return that
	}

	function checked (length) {
	  // Note: cannot use `length < kMaxLength` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}

	function SlowBuffer (subject, encoding) {
	  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

	  var buf = new Buffer(subject, encoding)
	  delete buf.parent
	  return buf
	}

	Buffer.isBuffer = function isBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}

	Buffer.compare = function compare (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }

	  if (a === b) return 0

	  var x = a.length
	  var y = b.length

	  var i = 0
	  var len = Math.min(x, y)
	  while (i < len) {
	    if (a[i] !== b[i]) break

	    ++i
	  }

	  if (i !== len) {
	    x = a[i]
	    y = b[i]
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}

	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'binary':
	    case 'base64':
	    case 'raw':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}

	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

	  if (list.length === 0) {
	    return new Buffer(0)
	  }

	  var i
	  if (length === undefined) {
	    length = 0
	    for (i = 0; i < list.length; i++) {
	      length += list[i].length
	    }
	  }

	  var buf = new Buffer(length)
	  var pos = 0
	  for (i = 0; i < list.length; i++) {
	    var item = list[i]
	    item.copy(buf, pos)
	    pos += item.length
	  }
	  return buf
	}

	function byteLength (string, encoding) {
	  if (typeof string !== 'string') string = '' + string

	  var len = string.length
	  if (len === 0) return 0

	  // Use a for loop to avoid recursion
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'binary':
	      // Deprecated
	      case 'raw':
	      case 'raws':
	        return len
	      case 'utf8':
	      case 'utf-8':
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	Buffer.byteLength = byteLength

	function slowToString (encoding, start, end) {
	  var loweredCase = false

	  start = start | 0
	  end = end === undefined || end === Infinity ? this.length : end | 0

	  if (!encoding) encoding = 'utf8'
	  if (start < 0) start = 0
	  if (end > this.length) end = this.length
	  if (end <= start) return ''

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)

	      case 'ascii':
	        return asciiSlice(this, start, end)

	      case 'binary':
	        return binarySlice(this, start, end)

	      case 'base64':
	        return base64Slice(this, start, end)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	}

	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	}

	Buffer.prototype.inspect = function inspect () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max) str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}

	Buffer.prototype.compare = function compare (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return 0
	  return Buffer.compare(this, b)
	}

	Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
	  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
	  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
	  byteOffset >>= 0

	  if (this.length === 0) return -1
	  if (byteOffset >= this.length) return -1

	  // Negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

	  if (typeof val === 'string') {
	    if (val.length === 0) return -1 // special case: looking for empty string always fails
	    return String.prototype.indexOf.call(this, val, byteOffset)
	  }
	  if (Buffer.isBuffer(val)) {
	    return arrayIndexOf(this, val, byteOffset)
	  }
	  if (typeof val === 'number') {
	    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
	      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
	    }
	    return arrayIndexOf(this, [ val ], byteOffset)
	  }

	  function arrayIndexOf (arr, val, byteOffset) {
	    var foundIndex = -1
	    for (var i = 0; byteOffset + i < arr.length; i++) {
	      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
	        if (foundIndex === -1) foundIndex = i
	        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
	      } else {
	        foundIndex = -1
	      }
	    }
	    return -1
	  }

	  throw new TypeError('val must be string, number or Buffer')
	}

	// `get` is deprecated
	Buffer.prototype.get = function get (offset) {
	  console.log('.get() is deprecated. Access using array indexes instead.')
	  return this.readUInt8(offset)
	}

	// `set` is deprecated
	Buffer.prototype.set = function set (v, offset) {
	  console.log('.set() is deprecated. Access using array indexes instead.')
	  return this.writeUInt8(v, offset)
	}

	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; i++) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(parsed)) throw new Error('Invalid hex string')
	    buf[offset + i] = parsed
	  }
	  return i
	}

	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}

	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}

	function binaryWrite (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}

	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}

	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}

	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8'
	    length = this.length
	    offset = 0
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset
	    length = this.length
	    offset = 0
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0
	    if (isFinite(length)) {
	      length = length | 0
	      if (encoding === undefined) encoding = 'utf8'
	    } else {
	      encoding = length
	      length = undefined
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    var swap = encoding
	    encoding = offset
	    offset = length | 0
	    length = swap
	  }

	  var remaining = this.length - offset
	  if (length === undefined || length > remaining) length = remaining

	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('attempt to write outside buffer bounds')
	  }

	  if (!encoding) encoding = 'utf8'

	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)

	      case 'ascii':
	        return asciiWrite(this, string, offset, length)

	      case 'binary':
	        return binaryWrite(this, string, offset, length)

	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}

	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}

	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end)
	  var res = []

	  var i = start
	  while (i < end) {
	    var firstByte = buf[i]
	    var codePoint = null
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1

	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint

	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1]
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          fourthByte = buf[i + 3]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint
	            }
	          }
	      }
	    }

	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD
	      bytesPerSequence = 1
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
	      codePoint = 0xDC00 | codePoint & 0x3FF
	    }

	    res.push(codePoint)
	    i += bytesPerSequence
	  }

	  return decodeCodePointsArray(res)
	}

	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000

	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }

	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = ''
	  var i = 0
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    )
	  }
	  return res
	}

	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i] & 0x7F)
	  }
	  return ret
	}

	function binarySlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}

	function hexSlice (buf, start, end) {
	  var len = buf.length

	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len

	  var out = ''
	  for (var i = start; i < end; i++) {
	    out += toHex(buf[i])
	  }
	  return out
	}

	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}

	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end

	  if (start < 0) {
	    start += len
	    if (start < 0) start = 0
	  } else if (start > len) {
	    start = len
	  }

	  if (end < 0) {
	    end += len
	    if (end < 0) end = 0
	  } else if (end > len) {
	    end = len
	  }

	  if (end < start) end = start

	  var newBuf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = Buffer._augment(this.subarray(start, end))
	  } else {
	    var sliceLen = end - start
	    newBuf = new Buffer(sliceLen, undefined)
	    for (var i = 0; i < sliceLen; i++) {
	      newBuf[i] = this[i + start]
	    }
	  }

	  if (newBuf.length) newBuf.parent = this.parent || this

	  return newBuf
	}

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}

	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }

	  return val
	}

	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length)
	  }

	  var val = this[offset + --byteLength]
	  var mul = 1
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul
	  }

	  return val
	}

	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  return this[offset]
	}

	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}

	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}

	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}

	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	}

	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var i = byteLength
	  var mul = 1
	  var val = this[offset + --i]
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}

	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	}

	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	}

	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}

	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}

	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}

	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}

	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	}

	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

	  var mul = 1
	  var i = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

	  var i = byteLength - 1
	  var mul = 1
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = (value & 0xff)
	  return offset + 1
	}

	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}

	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}

	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = 0
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = byteLength - 1
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = (value & 0xff)
	  return offset + 1
	}

	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	  if (offset < 0) throw new RangeError('index out of range')
	}

	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}

	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (targetStart >= target.length) targetStart = target.length
	  if (!targetStart) targetStart = 0
	  if (end > 0 && end < start) end = start

	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0

	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')

	  // Are we oob?
	  if (end > this.length) end = this.length
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start
	  }

	  var len = end - start
	  var i

	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; i--) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; i++) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else {
	    target._set(this.subarray(start, start + len), targetStart)
	  }

	  return len
	}

	// fill(value, start=0, end=buffer.length)
	Buffer.prototype.fill = function fill (value, start, end) {
	  if (!value) value = 0
	  if (!start) start = 0
	  if (!end) end = this.length

	  if (end < start) throw new RangeError('end < start')

	  // Fill 0 bytes; we're done
	  if (end === start) return
	  if (this.length === 0) return

	  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
	  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

	  var i
	  if (typeof value === 'number') {
	    for (i = start; i < end; i++) {
	      this[i] = value
	    }
	  } else {
	    var bytes = utf8ToBytes(value.toString())
	    var len = bytes.length
	    for (i = start; i < end; i++) {
	      this[i] = bytes[i % len]
	    }
	  }

	  return this
	}

	/**
	 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
	 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
	 */
	Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
	  if (typeof Uint8Array !== 'undefined') {
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	      return (new Buffer(this)).buffer
	    } else {
	      var buf = new Uint8Array(this.length)
	      for (var i = 0, len = buf.length; i < len; i += 1) {
	        buf[i] = this[i]
	      }
	      return buf.buffer
	    }
	  } else {
	    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
	  }
	}

	// HELPER FUNCTIONS
	// ================

	var BP = Buffer.prototype

	/**
	 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
	 */
	Buffer._augment = function _augment (arr) {
	  arr.constructor = Buffer
	  arr._isBuffer = true

	  // save reference to original Uint8Array set method before overwriting
	  arr._set = arr.set

	  // deprecated
	  arr.get = BP.get
	  arr.set = BP.set

	  arr.write = BP.write
	  arr.toString = BP.toString
	  arr.toLocaleString = BP.toString
	  arr.toJSON = BP.toJSON
	  arr.equals = BP.equals
	  arr.compare = BP.compare
	  arr.indexOf = BP.indexOf
	  arr.copy = BP.copy
	  arr.slice = BP.slice
	  arr.readUIntLE = BP.readUIntLE
	  arr.readUIntBE = BP.readUIntBE
	  arr.readUInt8 = BP.readUInt8
	  arr.readUInt16LE = BP.readUInt16LE
	  arr.readUInt16BE = BP.readUInt16BE
	  arr.readUInt32LE = BP.readUInt32LE
	  arr.readUInt32BE = BP.readUInt32BE
	  arr.readIntLE = BP.readIntLE
	  arr.readIntBE = BP.readIntBE
	  arr.readInt8 = BP.readInt8
	  arr.readInt16LE = BP.readInt16LE
	  arr.readInt16BE = BP.readInt16BE
	  arr.readInt32LE = BP.readInt32LE
	  arr.readInt32BE = BP.readInt32BE
	  arr.readFloatLE = BP.readFloatLE
	  arr.readFloatBE = BP.readFloatBE
	  arr.readDoubleLE = BP.readDoubleLE
	  arr.readDoubleBE = BP.readDoubleBE
	  arr.writeUInt8 = BP.writeUInt8
	  arr.writeUIntLE = BP.writeUIntLE
	  arr.writeUIntBE = BP.writeUIntBE
	  arr.writeUInt16LE = BP.writeUInt16LE
	  arr.writeUInt16BE = BP.writeUInt16BE
	  arr.writeUInt32LE = BP.writeUInt32LE
	  arr.writeUInt32BE = BP.writeUInt32BE
	  arr.writeIntLE = BP.writeIntLE
	  arr.writeIntBE = BP.writeIntBE
	  arr.writeInt8 = BP.writeInt8
	  arr.writeInt16LE = BP.writeInt16LE
	  arr.writeInt16BE = BP.writeInt16BE
	  arr.writeInt32LE = BP.writeInt32LE
	  arr.writeInt32BE = BP.writeInt32BE
	  arr.writeFloatLE = BP.writeFloatLE
	  arr.writeFloatBE = BP.writeFloatBE
	  arr.writeDoubleLE = BP.writeDoubleLE
	  arr.writeDoubleBE = BP.writeDoubleBE
	  arr.fill = BP.fill
	  arr.inspect = BP.inspect
	  arr.toArrayBuffer = BP.toArrayBuffer

	  return arr
	}

	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}

	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}

	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}

	function utf8ToBytes (string, units) {
	  units = units || Infinity
	  var codePoint
	  var length = string.length
	  var leadSurrogate = null
	  var bytes = []

	  for (var i = 0; i < length; i++) {
	    codePoint = string.charCodeAt(i)

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        }

	        // valid lead
	        leadSurrogate = codePoint

	        continue
	      }

	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	        leadSurrogate = codePoint
	        continue
	      }

	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	    }

	    leadSurrogate = null

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint)
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }

	  return bytes
	}

	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}

	function utf16leToBytes (str, units) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    if ((units -= 2) < 0) break

	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }

	  return byteArray
	}

	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}

	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; i++) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i]
	  }
	  return i
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10).Buffer, (function() { return this; }())))

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	;(function (exports) {
		'use strict';

	  var Arr = (typeof Uint8Array !== 'undefined')
	    ? Uint8Array
	    : Array

		var PLUS   = '+'.charCodeAt(0)
		var SLASH  = '/'.charCodeAt(0)
		var NUMBER = '0'.charCodeAt(0)
		var LOWER  = 'a'.charCodeAt(0)
		var UPPER  = 'A'.charCodeAt(0)
		var PLUS_URL_SAFE = '-'.charCodeAt(0)
		var SLASH_URL_SAFE = '_'.charCodeAt(0)

		function decode (elt) {
			var code = elt.charCodeAt(0)
			if (code === PLUS ||
			    code === PLUS_URL_SAFE)
				return 62 // '+'
			if (code === SLASH ||
			    code === SLASH_URL_SAFE)
				return 63 // '/'
			if (code < NUMBER)
				return -1 //no match
			if (code < NUMBER + 10)
				return code - NUMBER + 26 + 26
			if (code < UPPER + 26)
				return code - UPPER
			if (code < LOWER + 26)
				return code - LOWER + 26
		}

		function b64ToByteArray (b64) {
			var i, j, l, tmp, placeHolders, arr

			if (b64.length % 4 > 0) {
				throw new Error('Invalid string. Length must be a multiple of 4')
			}

			// the number of equal signs (place holders)
			// if there are two placeholders, than the two characters before it
			// represent one byte
			// if there is only one, then the three characters before it represent 2 bytes
			// this is just a cheap hack to not do indexOf twice
			var len = b64.length
			placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

			// base64 is 4/3 + up to two characters of the original data
			arr = new Arr(b64.length * 3 / 4 - placeHolders)

			// if there are placeholders, only get up to the last complete 4 chars
			l = placeHolders > 0 ? b64.length - 4 : b64.length

			var L = 0

			function push (v) {
				arr[L++] = v
			}

			for (i = 0, j = 0; i < l; i += 4, j += 3) {
				tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
				push((tmp & 0xFF0000) >> 16)
				push((tmp & 0xFF00) >> 8)
				push(tmp & 0xFF)
			}

			if (placeHolders === 2) {
				tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
				push(tmp & 0xFF)
			} else if (placeHolders === 1) {
				tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
				push((tmp >> 8) & 0xFF)
				push(tmp & 0xFF)
			}

			return arr
		}

		function uint8ToBase64 (uint8) {
			var i,
				extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
				output = "",
				temp, length

			function encode (num) {
				return lookup.charAt(num)
			}

			function tripletToBase64 (num) {
				return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
			}

			// go through the array every three bytes, we'll deal with trailing stuff later
			for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
				temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
				output += tripletToBase64(temp)
			}

			// pad the end with zeros, but make sure to not forget the extra bytes
			switch (extraBytes) {
				case 1:
					temp = uint8[uint8.length - 1]
					output += encode(temp >> 2)
					output += encode((temp << 4) & 0x3F)
					output += '=='
					break
				case 2:
					temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
					output += encode(temp >> 10)
					output += encode((temp >> 4) & 0x3F)
					output += encode((temp << 2) & 0x3F)
					output += '='
					break
			}

			return output
		}

		exports.toByteArray = b64ToByteArray
		exports.fromByteArray = uint8ToBase64
	}( false ? (this.base64js = {}) : exports))


/***/ },
/* 12 */
/***/ function(module, exports) {

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var nBits = -7
	  var i = isLE ? (nBytes - 1) : 0
	  var d = isLE ? -1 : 1
	  var s = buffer[offset + i]

	  i += d

	  e = s & ((1 << (-nBits)) - 1)
	  s >>= (-nBits)
	  nBits += eLen
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & ((1 << (-nBits)) - 1)
	  e >>= (-nBits)
	  nBits += mLen
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen)
	    e = e - eBias
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}

	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
	  var i = isLE ? 0 : (nBytes - 1)
	  var d = isLE ? 1 : -1
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

	  value = Math.abs(value)

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0
	    e = eMax
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2)
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--
	      c *= 2
	    }
	    if (e + eBias >= 1) {
	      value += rt / c
	    } else {
	      value += rt * Math.pow(2, 1 - eBias)
	    }
	    if (value * c >= 2) {
	      e++
	      c /= 2
	    }

	    if (e + eBias >= eMax) {
	      m = 0
	      e = eMax
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen)
	      e = e + eBias
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
	      e = 0
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = (e << mLen) | m
	  eLen += mLen
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128
	}


/***/ },
/* 13 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};


/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Channel interface.
	 * [RTCDataChannel]{@link https://developer.mozilla.org/en-US/docs/Web/API/RTCDataChannel}
	 * and
	 * [WebSocket]{@link https://developer.mozilla.org/en-US/docs/Web/API/WebSocket}
	 * implement it implicitly. Any other channel must implement this interface.
	 *
	 * @interface
	 */

	var Channel = function () {
	  function Channel(channel, webChannel, peerId) {
	    _classCallCheck(this, Channel);

	    channel.binaryType = 'arraybuffer';
	    this.channel = channel;
	    this.webChannel = webChannel;
	    this.peerId = peerId;
	  }

	  _createClass(Channel, [{
	    key: 'config',
	    value: function config() {
	      var _this = this;

	      this.channel.onmessage = function (msgEvt) {
	        _this.webChannel.onChannelMessage(_this, msgEvt.data);
	      };
	      this.channel.onerror = function (evt) {
	        _this.webChannel.onChannelError(evt);
	      };
	      this.channel.onclose = function (evt) {
	        _this.webChannel.onChannelClose(evt);
	      };
	    }

	    /**
	     * send - description.
	     *
	     * @abstract
	     * @param {string} msg - Message in stringified JSON format.
	     */

	  }, {
	    key: 'send',
	    value: function send(data) {
	      if (this.channel.readyState !== 'closed') {
	        this.channel.send(data);
	      }
	    }

	    /**
	     * Close channel.
	     *
	     * @abstract
	     */

	  }, {
	    key: 'close',
	    value: function close() {
	      this.channel.close();
	    }
	  }]);

	  return Channel;
	}();

	exports.default = Channel;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var require;var require;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return require(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

	},{}],2:[function(require,module,exports){
	/*
	 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
	 *
	 *  Use of this source code is governed by a BSD-style license
	 *  that can be found in the LICENSE file in the root of the source
	 *  tree.
	 */
	 /* eslint-env node */

	'use strict';

	// Shimming starts here.
	(function() {
	  // Utils.
	  var logging = require('./utils').log;
	  var browserDetails = require('./utils').browserDetails;
	  // Export to the adapter global object visible in the browser.
	  module.exports.browserDetails = browserDetails;
	  module.exports.extractVersion = require('./utils').extractVersion;
	  module.exports.disableLog = require('./utils').disableLog;

	  // Comment out the line below if you want logging to occur, including logging
	  // for the switch statement below. Can also be turned on in the browser via
	  // adapter.disableLog(false), but then logging from the switch statement below
	  // will not appear.
	  require('./utils').disableLog(true);

	  // Browser shims.
	  var chromeShim = require('./chrome/chrome_shim') || null;
	  var edgeShim = require('./edge/edge_shim') || null;
	  var firefoxShim = require('./firefox/firefox_shim') || null;
	  var safariShim = require('./safari/safari_shim') || null;

	  // Shim browser if found.
	  switch (browserDetails.browser) {
	    case 'opera': // fallthrough as it uses chrome shims
	    case 'chrome':
	      if (!chromeShim || !chromeShim.shimPeerConnection) {
	        logging('Chrome shim is not included in this adapter release.');
	        return;
	      }
	      logging('adapter.js shimming chrome.');
	      // Export to the adapter global object visible in the browser.
	      module.exports.browserShim = chromeShim;

	      chromeShim.shimGetUserMedia();
	      chromeShim.shimMediaStream();
	      chromeShim.shimSourceObject();
	      chromeShim.shimPeerConnection();
	      chromeShim.shimOnTrack();
	      break;
	    case 'firefox':
	      if (!firefoxShim || !firefoxShim.shimPeerConnection) {
	        logging('Firefox shim is not included in this adapter release.');
	        return;
	      }
	      logging('adapter.js shimming firefox.');
	      // Export to the adapter global object visible in the browser.
	      module.exports.browserShim = firefoxShim;

	      firefoxShim.shimGetUserMedia();
	      firefoxShim.shimSourceObject();
	      firefoxShim.shimPeerConnection();
	      firefoxShim.shimOnTrack();
	      break;
	    case 'edge':
	      if (!edgeShim || !edgeShim.shimPeerConnection) {
	        logging('MS edge shim is not included in this adapter release.');
	        return;
	      }
	      logging('adapter.js shimming edge.');
	      // Export to the adapter global object visible in the browser.
	      module.exports.browserShim = edgeShim;

	      edgeShim.shimGetUserMedia();
	      edgeShim.shimPeerConnection();
	      break;
	    case 'safari':
	      if (!safariShim) {
	        logging('Safari shim is not included in this adapter release.');
	        return;
	      }
	      logging('adapter.js shimming safari.');
	      // Export to the adapter global object visible in the browser.
	      module.exports.browserShim = safariShim;

	      safariShim.shimGetUserMedia();
	      break;
	    default:
	      logging('Unsupported browser!');
	  }
	})();

	},{"./chrome/chrome_shim":3,"./edge/edge_shim":1,"./firefox/firefox_shim":5,"./safari/safari_shim":7,"./utils":8}],3:[function(require,module,exports){

	/*
	 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
	 *
	 *  Use of this source code is governed by a BSD-style license
	 *  that can be found in the LICENSE file in the root of the source
	 *  tree.
	 */
	 /* eslint-env node */
	'use strict';
	var logging = require('../utils.js').log;
	var browserDetails = require('../utils.js').browserDetails;

	var chromeShim = {
	  shimMediaStream: function() {
	    window.MediaStream = window.MediaStream || window.webkitMediaStream;
	  },

	  shimOnTrack: function() {
	    if (typeof window === 'object' && window.RTCPeerConnection && !('ontrack' in
	        window.RTCPeerConnection.prototype)) {
	      Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
	        get: function() {
	          return this._ontrack;
	        },
	        set: function(f) {
	          var self = this;
	          if (this._ontrack) {
	            this.removeEventListener('track', this._ontrack);
	            this.removeEventListener('addstream', this._ontrackpoly);
	          }
	          this.addEventListener('track', this._ontrack = f);
	          this.addEventListener('addstream', this._ontrackpoly = function(e) {
	            // onaddstream does not fire when a track is added to an existing
	            // stream. But stream.onaddtrack is implemented so we use that.
	            e.stream.addEventListener('addtrack', function(te) {
	              var event = new Event('track');
	              event.track = te.track;
	              event.receiver = {track: te.track};
	              event.streams = [e.stream];
	              self.dispatchEvent(event);
	            });
	            e.stream.getTracks().forEach(function(track) {
	              var event = new Event('track');
	              event.track = track;
	              event.receiver = {track: track};
	              event.streams = [e.stream];
	              this.dispatchEvent(event);
	            }.bind(this));
	          }.bind(this));
	        }
	      });
	    }
	  },

	  shimSourceObject: function() {
	    if (typeof window === 'object') {
	      if (window.HTMLMediaElement &&
	        !('srcObject' in window.HTMLMediaElement.prototype)) {
	        // Shim the srcObject property, once, when HTMLMediaElement is found.
	        Object.defineProperty(window.HTMLMediaElement.prototype, 'srcObject', {
	          get: function() {
	            return this._srcObject;
	          },
	          set: function(stream) {
	            var self = this;
	            // Use _srcObject as a private property for this shim
	            this._srcObject = stream;
	            if (this.src) {
	              URL.revokeObjectURL(this.src);
	            }

	            if (!stream) {
	              this.src = '';
	              return;
	            }
	            this.src = URL.createObjectURL(stream);
	            // We need to recreate the blob url when a track is added or
	            // removed. Doing it manually since we want to avoid a recursion.
	            stream.addEventListener('addtrack', function() {
	              if (self.src) {
	                URL.revokeObjectURL(self.src);
	              }
	              self.src = URL.createObjectURL(stream);
	            });
	            stream.addEventListener('removetrack', function() {
	              if (self.src) {
	                URL.revokeObjectURL(self.src);
	              }
	              self.src = URL.createObjectURL(stream);
	            });
	          }
	        });
	      }
	    }
	  },

	  shimPeerConnection: function() {
	    // The RTCPeerConnection object.
	    window.RTCPeerConnection = function(pcConfig, pcConstraints) {
	      // Translate iceTransportPolicy to iceTransports,
	      // see https://code.google.com/p/webrtc/issues/detail?id=4869
	      logging('PeerConnection');
	      if (pcConfig && pcConfig.iceTransportPolicy) {
	        pcConfig.iceTransports = pcConfig.iceTransportPolicy;
	      }

	      var pc = new webkitRTCPeerConnection(pcConfig, pcConstraints);
	      var origGetStats = pc.getStats.bind(pc);
	      pc.getStats = function(selector, successCallback, errorCallback) {
	        var self = this;
	        var args = arguments;

	        // If selector is a function then we are in the old style stats so just
	        // pass back the original getStats format to avoid breaking old users.
	        if (arguments.length > 0 && typeof selector === 'function') {
	          return origGetStats(selector, successCallback);
	        }

	        var fixChromeStats_ = function(response) {
	          var standardReport = {};
	          var reports = response.result();
	          reports.forEach(function(report) {
	            var standardStats = {
	              id: report.id,
	              timestamp: report.timestamp,
	              type: report.type
	            };
	            report.names().forEach(function(name) {
	              standardStats[name] = report.stat(name);
	            });
	            standardReport[standardStats.id] = standardStats;
	          });

	          return standardReport;
	        };

	        // shim getStats with maplike support
	        var makeMapStats = function(stats, legacyStats) {
	          var map = new Map(Object.keys(stats).map(function(key) {
	            return[key, stats[key]];
	          }));
	          legacyStats = legacyStats || stats;
	          Object.keys(legacyStats).forEach(function(key) {
	            map[key] = legacyStats[key];
	          });
	          return map;
	        };

	        if (arguments.length >= 2) {
	          var successCallbackWrapper_ = function(response) {
	            args[1](makeMapStats(fixChromeStats_(response)));
	          };

	          return origGetStats.apply(this, [successCallbackWrapper_,
	              arguments[0]]);
	        }

	        // promise-support
	        return new Promise(function(resolve, reject) {
	          if (args.length === 1 && typeof selector === 'object') {
	            origGetStats.apply(self, [
	              function(response) {
	                resolve(makeMapStats(fixChromeStats_(response)));
	              }, reject]);
	          } else {
	            // Preserve legacy chrome stats only on legacy access of stats obj
	            origGetStats.apply(self, [
	              function(response) {
	                resolve(makeMapStats(fixChromeStats_(response),
	                    response.result()));
	              }, reject]);
	          }
	        }).then(successCallback, errorCallback);
	      };

	      return pc;
	    };
	    window.RTCPeerConnection.prototype = webkitRTCPeerConnection.prototype;

	    // wrap static methods. Currently just generateCertificate.
	    if (webkitRTCPeerConnection.generateCertificate) {
	      Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
	        get: function() {
	          return webkitRTCPeerConnection.generateCertificate;
	        }
	      });
	    }

	    // add promise support -- natively available in Chrome 51
	    if (browserDetails.version < 51) {
	      ['createOffer', 'createAnswer'].forEach(function(method) {
	        var nativeMethod = webkitRTCPeerConnection.prototype[method];
	        webkitRTCPeerConnection.prototype[method] = function() {
	          var self = this;
	          if (arguments.length < 1 || (arguments.length === 1 &&
	              typeof arguments[0] === 'object')) {
	            var opts = arguments.length === 1 ? arguments[0] : undefined;
	            return new Promise(function(resolve, reject) {
	              nativeMethod.apply(self, [resolve, reject, opts]);
	            });
	          }
	          return nativeMethod.apply(this, arguments);
	        };
	      });

	      ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
	          .forEach(function(method) {
	            var nativeMethod = webkitRTCPeerConnection.prototype[method];
	            webkitRTCPeerConnection.prototype[method] = function() {
	              var args = arguments;
	              var self = this;
	              var promise = new Promise(function(resolve, reject) {
	                nativeMethod.apply(self, [args[0], resolve, reject]);
	              });
	              if (args.length < 2) {
	                return promise;
	              }
	              return promise.then(function() {
	                args[1].apply(null, []);
	              },
	              function(err) {
	                if (args.length >= 3) {
	                  args[2].apply(null, [err]);
	                }
	              });
	            };
	          });
	    }

	    // shim implicit creation of RTCSessionDescription/RTCIceCandidate
	    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
	        .forEach(function(method) {
	          var nativeMethod = webkitRTCPeerConnection.prototype[method];
	          webkitRTCPeerConnection.prototype[method] = function() {
	            arguments[0] = new ((method === 'addIceCandidate') ?
	                RTCIceCandidate : RTCSessionDescription)(arguments[0]);
	            return nativeMethod.apply(this, arguments);
	          };
	        });
	  },

	  // Attach a media stream to an element.
	  attachMediaStream: function(element, stream) {
	    logging('DEPRECATED, attachMediaStream will soon be removed.');
	    if (browserDetails.version >= 43) {
	      element.srcObject = stream;
	    } else if (typeof element.src !== 'undefined') {
	      element.src = URL.createObjectURL(stream);
	    } else {
	      logging('Error attaching stream to element.');
	    }
	  },

	  reattachMediaStream: function(to, from) {
	    logging('DEPRECATED, reattachMediaStream will soon be removed.');
	    if (browserDetails.version >= 43) {
	      to.srcObject = from.srcObject;
	    } else {
	      to.src = from.src;
	    }
	  }
	};


	// Expose public methods.
	module.exports = {
	  shimMediaStream: chromeShim.shimMediaStream,
	  shimOnTrack: chromeShim.shimOnTrack,
	  shimSourceObject: chromeShim.shimSourceObject,
	  shimPeerConnection: chromeShim.shimPeerConnection,
	  shimGetUserMedia: require('./getusermedia'),
	  attachMediaStream: chromeShim.attachMediaStream,
	  reattachMediaStream: chromeShim.reattachMediaStream
	};

	},{"../utils.js":8,"./getusermedia":4}],4:[function(require,module,exports){
	/*
	 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
	 *
	 *  Use of this source code is governed by a BSD-style license
	 *  that can be found in the LICENSE file in the root of the source
	 *  tree.
	 */
	 /* eslint-env node */
	'use strict';
	var logging = require('../utils.js').log;

	// Expose public methods.
	module.exports = function() {
	  var constraintsToChrome_ = function(c) {
	    if (typeof c !== 'object' || c.mandatory || c.optional) {
	      return c;
	    }
	    var cc = {};
	    Object.keys(c).forEach(function(key) {
	      if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
	        return;
	      }
	      var r = (typeof c[key] === 'object') ? c[key] : {ideal: c[key]};
	      if (r.exact !== undefined && typeof r.exact === 'number') {
	        r.min = r.max = r.exact;
	      }
	      var oldname_ = function(prefix, name) {
	        if (prefix) {
	          return prefix + name.charAt(0).toUpperCase() + name.slice(1);
	        }
	        return (name === 'deviceId') ? 'sourceId' : name;
	      };
	      if (r.ideal !== undefined) {
	        cc.optional = cc.optional || [];
	        var oc = {};
	        if (typeof r.ideal === 'number') {
	          oc[oldname_('min', key)] = r.ideal;
	          cc.optional.push(oc);
	          oc = {};
	          oc[oldname_('max', key)] = r.ideal;
	          cc.optional.push(oc);
	        } else {
	          oc[oldname_('', key)] = r.ideal;
	          cc.optional.push(oc);
	        }
	      }
	      if (r.exact !== undefined && typeof r.exact !== 'number') {
	        cc.mandatory = cc.mandatory || {};
	        cc.mandatory[oldname_('', key)] = r.exact;
	      } else {
	        ['min', 'max'].forEach(function(mix) {
	          if (r[mix] !== undefined) {
	            cc.mandatory = cc.mandatory || {};
	            cc.mandatory[oldname_(mix, key)] = r[mix];
	          }
	        });
	      }
	    });
	    if (c.advanced) {
	      cc.optional = (cc.optional || []).concat(c.advanced);
	    }
	    return cc;
	  };

	  var shimConstraints_ = function(constraints, func) {
	    constraints = JSON.parse(JSON.stringify(constraints));
	    if (constraints && constraints.audio) {
	      constraints.audio = constraintsToChrome_(constraints.audio);
	    }
	    if (constraints && typeof constraints.video === 'object') {
	      // Shim facingMode for mobile, where it defaults to "user".
	      var face = constraints.video.facingMode;
	      face = face && ((typeof face === 'object') ? face : {ideal: face});

	      if ((face && (face.exact === 'user' || face.exact === 'environment' ||
	                    face.ideal === 'user' || face.ideal === 'environment')) &&
	          !(navigator.mediaDevices.getSupportedConstraints &&
	            navigator.mediaDevices.getSupportedConstraints().facingMode)) {
	        delete constraints.video.facingMode;
	        if (face.exact === 'environment' || face.ideal === 'environment') {
	          // Look for "back" in label, or use last cam (typically back cam).
	          return navigator.mediaDevices.enumerateDevices()
	          .then(function(devices) {
	            devices = devices.filter(function(d) {
	              return d.kind === 'videoinput';
	            });
	            var back = devices.find(function(d) {
	              return d.label.toLowerCase().indexOf('back') !== -1;
	            }) || (devices.length && devices[devices.length - 1]);
	            if (back) {
	              constraints.video.deviceId = face.exact ? {exact: back.deviceId} :
	                                                        {ideal: back.deviceId};
	            }
	            constraints.video = constraintsToChrome_(constraints.video);
	            logging('chrome: ' + JSON.stringify(constraints));
	            return func(constraints);
	          });
	        }
	      }
	      constraints.video = constraintsToChrome_(constraints.video);
	    }
	    logging('chrome: ' + JSON.stringify(constraints));
	    return func(constraints);
	  };

	  var shimError_ = function(e) {
	    return {
	      name: {
	        PermissionDeniedError: 'NotAllowedError',
	        ConstraintNotSatisfiedError: 'OverconstrainedError'
	      }[e.name] || e.name,
	      message: e.message,
	      constraint: e.constraintName,
	      toString: function() {
	        return this.name + (this.message && ': ') + this.message;
	      }
	    };
	  };

	  var getUserMedia_ = function(constraints, onSuccess, onError) {
	    shimConstraints_(constraints, function(c) {
	      navigator.webkitGetUserMedia(c, onSuccess, function(e) {
	        onError(shimError_(e));
	      });
	    });
	  };

	  navigator.getUserMedia = getUserMedia_;

	  // Returns the result of getUserMedia as a Promise.
	  var getUserMediaPromise_ = function(constraints) {
	    return new Promise(function(resolve, reject) {
	      navigator.getUserMedia(constraints, resolve, reject);
	    });
	  };

	  if (!navigator.mediaDevices) {
	    navigator.mediaDevices = {
	      getUserMedia: getUserMediaPromise_,
	      enumerateDevices: function() {
	        return new Promise(function(resolve) {
	          var kinds = {audio: 'audioinput', video: 'videoinput'};
	          return MediaStreamTrack.getSources(function(devices) {
	            resolve(devices.map(function(device) {
	              return {label: device.label,
	                      kind: kinds[device.kind],
	                      deviceId: device.id,
	                      groupId: ''};
	            }));
	          });
	        });
	      }
	    };
	  }

	  // A shim for getUserMedia method on the mediaDevices object.
	  // TODO(KaptenJansson) remove once implemented in Chrome stable.
	  if (!navigator.mediaDevices.getUserMedia) {
	    navigator.mediaDevices.getUserMedia = function(constraints) {
	      return getUserMediaPromise_(constraints);
	    };
	  } else {
	    // Even though Chrome 45 has navigator.mediaDevices and a getUserMedia
	    // function which returns a Promise, it does not accept spec-style
	    // constraints.
	    var origGetUserMedia = navigator.mediaDevices.getUserMedia.
	        bind(navigator.mediaDevices);
	    navigator.mediaDevices.getUserMedia = function(cs) {
	      return shimConstraints_(cs, function(c) {
	        return origGetUserMedia(c).catch(function(e) {
	          return Promise.reject(shimError_(e));
	        });
	      });
	    };
	  }

	  // Dummy devicechange event methods.
	  // TODO(KaptenJansson) remove once implemented in Chrome stable.
	  if (typeof navigator.mediaDevices.addEventListener === 'undefined') {
	    navigator.mediaDevices.addEventListener = function() {
	      logging('Dummy mediaDevices.addEventListener called.');
	    };
	  }
	  if (typeof navigator.mediaDevices.removeEventListener === 'undefined') {
	    navigator.mediaDevices.removeEventListener = function() {
	      logging('Dummy mediaDevices.removeEventListener called.');
	    };
	  }
	};

	},{"../utils.js":8}],5:[function(require,module,exports){
	/*
	 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
	 *
	 *  Use of this source code is governed by a BSD-style license
	 *  that can be found in the LICENSE file in the root of the source
	 *  tree.
	 */
	 /* eslint-env node */
	'use strict';

	var logging = require('../utils').log;
	var browserDetails = require('../utils').browserDetails;

	var firefoxShim = {
	  shimOnTrack: function() {
	    if (typeof window === 'object' && window.RTCPeerConnection && !('ontrack' in
	        window.RTCPeerConnection.prototype)) {
	      Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
	        get: function() {
	          return this._ontrack;
	        },
	        set: function(f) {
	          if (this._ontrack) {
	            this.removeEventListener('track', this._ontrack);
	            this.removeEventListener('addstream', this._ontrackpoly);
	          }
	          this.addEventListener('track', this._ontrack = f);
	          this.addEventListener('addstream', this._ontrackpoly = function(e) {
	            e.stream.getTracks().forEach(function(track) {
	              var event = new Event('track');
	              event.track = track;
	              event.receiver = {track: track};
	              event.streams = [e.stream];
	              this.dispatchEvent(event);
	            }.bind(this));
	          }.bind(this));
	        }
	      });
	    }
	  },

	  shimSourceObject: function() {
	    // Firefox has supported mozSrcObject since FF22, unprefixed in 42.
	    if (typeof window === 'object') {
	      if (window.HTMLMediaElement &&
	        !('srcObject' in window.HTMLMediaElement.prototype)) {
	        // Shim the srcObject property, once, when HTMLMediaElement is found.
	        Object.defineProperty(window.HTMLMediaElement.prototype, 'srcObject', {
	          get: function() {
	            return this.mozSrcObject;
	          },
	          set: function(stream) {
	            this.mozSrcObject = stream;
	          }
	        });
	      }
	    }
	  },

	  shimPeerConnection: function() {
	    if (typeof window !== 'object' || !(window.RTCPeerConnection ||
	        window.mozRTCPeerConnection)) {
	      return; // probably media.peerconnection.enabled=false in about:config
	    }
	    // The RTCPeerConnection object.
	    if (!window.RTCPeerConnection) {
	      window.RTCPeerConnection = function(pcConfig, pcConstraints) {
	        if (browserDetails.version < 38) {
	          // .urls is not supported in FF < 38.
	          // create RTCIceServers with a single url.
	          if (pcConfig && pcConfig.iceServers) {
	            var newIceServers = [];
	            for (var i = 0; i < pcConfig.iceServers.length; i++) {
	              var server = pcConfig.iceServers[i];
	              if (server.hasOwnProperty('urls')) {
	                for (var j = 0; j < server.urls.length; j++) {
	                  var newServer = {
	                    url: server.urls[j]
	                  };
	                  if (server.urls[j].indexOf('turn') === 0) {
	                    newServer.username = server.username;
	                    newServer.credential = server.credential;
	                  }
	                  newIceServers.push(newServer);
	                }
	              } else {
	                newIceServers.push(pcConfig.iceServers[i]);
	              }
	            }
	            pcConfig.iceServers = newIceServers;
	          }
	        }
	        return new mozRTCPeerConnection(pcConfig, pcConstraints);
	      };
	      window.RTCPeerConnection.prototype = mozRTCPeerConnection.prototype;

	      // wrap static methods. Currently just generateCertificate.
	      if (mozRTCPeerConnection.generateCertificate) {
	        Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
	          get: function() {
	            return mozRTCPeerConnection.generateCertificate;
	          }
	        });
	      }

	      window.RTCSessionDescription = mozRTCSessionDescription;
	      window.RTCIceCandidate = mozRTCIceCandidate;
	    }

	    // shim away need for obsolete RTCIceCandidate/RTCSessionDescription.
	    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
	        .forEach(function(method) {
	          var nativeMethod = RTCPeerConnection.prototype[method];
	          RTCPeerConnection.prototype[method] = function() {
	            arguments[0] = new ((method === 'addIceCandidate') ?
	                RTCIceCandidate : RTCSessionDescription)(arguments[0]);
	            return nativeMethod.apply(this, arguments);
	          };
	        });

	    // shim getStats with maplike support
	    var makeMapStats = function(stats) {
	      var map = new Map();
	      Object.keys(stats).forEach(function(key) {
	        map.set(key, stats[key]);
	        map[key] = stats[key];
	      });
	      return map;
	    };

	    var nativeGetStats = RTCPeerConnection.prototype.getStats;
	    RTCPeerConnection.prototype.getStats = function(selector, onSucc, onErr) {
	      return nativeGetStats.apply(this, [selector || null])
	        .then(function(stats) {
	          return makeMapStats(stats);
	        })
	        .then(onSucc, onErr);
	    };
	  },

	  shimGetUserMedia: function() {
	    // getUserMedia constraints shim.
	    var getUserMedia_ = function(constraints, onSuccess, onError) {
	      var constraintsToFF37_ = function(c) {
	        if (typeof c !== 'object' || c.require) {
	          return c;
	        }
	        var require = [];
	        Object.keys(c).forEach(function(key) {
	          if (key === 'require' || key === 'advanced' ||
	              key === 'mediaSource') {
	            return;
	          }
	          var r = c[key] = (typeof c[key] === 'object') ?
	              c[key] : {ideal: c[key]};
	          if (r.min !== undefined ||
	              r.max !== undefined || r.exact !== undefined) {
	            require.push(key);
	          }
	          if (r.exact !== undefined) {
	            if (typeof r.exact === 'number') {
	              r. min = r.max = r.exact;
	            } else {
	              c[key] = r.exact;
	            }
	            delete r.exact;
	          }
	          if (r.ideal !== undefined) {
	            c.advanced = c.advanced || [];
	            var oc = {};
	            if (typeof r.ideal === 'number') {
	              oc[key] = {min: r.ideal, max: r.ideal};
	            } else {
	              oc[key] = r.ideal;
	            }
	            c.advanced.push(oc);
	            delete r.ideal;
	            if (!Object.keys(r).length) {
	              delete c[key];
	            }
	          }
	        });
	        if (require.length) {
	          c.require = require;
	        }
	        return c;
	      };
	      constraints = JSON.parse(JSON.stringify(constraints));
	      if (browserDetails.version < 38) {
	        logging('spec: ' + JSON.stringify(constraints));
	        if (constraints.audio) {
	          constraints.audio = constraintsToFF37_(constraints.audio);
	        }
	        if (constraints.video) {
	          constraints.video = constraintsToFF37_(constraints.video);
	        }
	        logging('ff37: ' + JSON.stringify(constraints));
	      }
	      return navigator.mozGetUserMedia(constraints, onSuccess, onError);
	    };

	    navigator.getUserMedia = getUserMedia_;

	    // Returns the result of getUserMedia as a Promise.
	    var getUserMediaPromise_ = function(constraints) {
	      return new Promise(function(resolve, reject) {
	        navigator.getUserMedia(constraints, resolve, reject);
	      });
	    };

	    // Shim for mediaDevices on older versions.
	    if (!navigator.mediaDevices) {
	      navigator.mediaDevices = {getUserMedia: getUserMediaPromise_,
	        addEventListener: function() { },
	        removeEventListener: function() { }
	      };
	    }
	    navigator.mediaDevices.enumerateDevices =
	        navigator.mediaDevices.enumerateDevices || function() {
	          return new Promise(function(resolve) {
	            var infos = [
	              {kind: 'audioinput', deviceId: 'default', label: '', groupId: ''},
	              {kind: 'videoinput', deviceId: 'default', label: '', groupId: ''}
	            ];
	            resolve(infos);
	          });
	        };

	    if (browserDetails.version < 41) {
	      // Work around http://bugzil.la/1169665
	      var orgEnumerateDevices =
	          navigator.mediaDevices.enumerateDevices.bind(navigator.mediaDevices);
	      navigator.mediaDevices.enumerateDevices = function() {
	        return orgEnumerateDevices().then(undefined, function(e) {
	          if (e.name === 'NotFoundError') {
	            return [];
	          }
	          throw e;
	        });
	      };
	    }
	  },

	  // Attach a media stream to an element.
	  attachMediaStream: function(element, stream) {
	    logging('DEPRECATED, attachMediaStream will soon be removed.');
	    element.srcObject = stream;
	  },

	  reattachMediaStream: function(to, from) {
	    logging('DEPRECATED, reattachMediaStream will soon be removed.');
	    to.srcObject = from.srcObject;
	  }
	};

	// Expose public methods.
	module.exports = {
	  shimOnTrack: firefoxShim.shimOnTrack,
	  shimSourceObject: firefoxShim.shimSourceObject,
	  shimPeerConnection: firefoxShim.shimPeerConnection,
	  shimGetUserMedia: require('./getusermedia'),
	  attachMediaStream: firefoxShim.attachMediaStream,
	  reattachMediaStream: firefoxShim.reattachMediaStream
	};

	},{"../utils":8,"./getusermedia":6}],6:[function(require,module,exports){
	/*
	 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
	 *
	 *  Use of this source code is governed by a BSD-style license
	 *  that can be found in the LICENSE file in the root of the source
	 *  tree.
	 */
	 /* eslint-env node */
	'use strict';

	var logging = require('../utils').log;
	var browserDetails = require('../utils').browserDetails;

	// Expose public methods.
	module.exports = function() {
	  var shimError_ = e => ({
	    name: {
	      SecurityError: 'NotAllowedError',
	      PermissionDeniedError: 'NotAllowedError'
	    }[e.name] || e.name,
	    message: {
	      'The operation is insecure.': 'The request is not allowed by the user ' +
	      'agent or the platform in the current context.'
	    }[e.message] || e.message,
	    constraint: e.constraint,
	    toString: function() {
	      return this.name + (this.message && ': ') + this.message;
	    }
	  });


	  // getUserMedia constraints shim.
	  var getUserMedia_ = function(constraints, onSuccess, onError) {
	    var constraintsToFF37_ = function(c) {
	      if (typeof c !== 'object' || c.require) {
	        return c;
	      }
	      var require = [];
	      Object.keys(c).forEach(function(key) {
	        if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
	          return;
	        }
	        var r = c[key] = (typeof c[key] === 'object') ?
	            c[key] : {ideal: c[key]};
	        if (r.min !== undefined ||
	            r.max !== undefined || r.exact !== undefined) {
	          require.push(key);
	        }
	        if (r.exact !== undefined) {
	          if (typeof r.exact === 'number') {
	            r. min = r.max = r.exact;
	          } else {
	            c[key] = r.exact;
	          }
	          delete r.exact;
	        }
	        if (r.ideal !== undefined) {
	          c.advanced = c.advanced || [];
	          var oc = {};
	          if (typeof r.ideal === 'number') {
	            oc[key] = {min: r.ideal, max: r.ideal};
	          } else {
	            oc[key] = r.ideal;
	          }
	          c.advanced.push(oc);
	          delete r.ideal;
	          if (!Object.keys(r).length) {
	            delete c[key];
	          }
	        }
	      });
	      if (require.length) {
	        c.require = require;
	      }
	      return c;
	    };
	    constraints = JSON.parse(JSON.stringify(constraints));
	    if (browserDetails.version < 38) {
	      logging('spec: ' + JSON.stringify(constraints));
	      if (constraints.audio) {
	        constraints.audio = constraintsToFF37_(constraints.audio);
	      }
	      if (constraints.video) {
	        constraints.video = constraintsToFF37_(constraints.video);
	      }
	      logging('ff37: ' + JSON.stringify(constraints));
	    }
	    return navigator.mozGetUserMedia(constraints, onSuccess,
	                                     e => onError(shimError_(e)));
	  };

	  navigator.getUserMedia = getUserMedia_;

	  // Returns the result of getUserMedia as a Promise.
	  var getUserMediaPromise_ = function(constraints) {
	    return new Promise(function(resolve, reject) {
	      navigator.getUserMedia(constraints, resolve, reject);
	    });
	  };

	  // Shim for mediaDevices on older versions.
	  if (!navigator.mediaDevices) {
	    navigator.mediaDevices = {getUserMedia: getUserMediaPromise_,
	      addEventListener: function() { },
	      removeEventListener: function() { }
	    };
	  }
	  navigator.mediaDevices.enumerateDevices =
	      navigator.mediaDevices.enumerateDevices || function() {
	        return new Promise(function(resolve) {
	          var infos = [
	            {kind: 'audioinput', deviceId: 'default', label: '', groupId: ''},
	            {kind: 'videoinput', deviceId: 'default', label: '', groupId: ''}
	          ];
	          resolve(infos);
	        });
	      };

	  if (browserDetails.version < 41) {
	    // Work around http://bugzil.la/1169665
	    var orgEnumerateDevices =
	        navigator.mediaDevices.enumerateDevices.bind(navigator.mediaDevices);
	    navigator.mediaDevices.enumerateDevices = function() {
	      return orgEnumerateDevices().then(undefined, function(e) {
	        if (e.name === 'NotFoundError') {
	          return [];
	        }
	        throw e;
	      });
	    };
	  }
	  if (browserDetails.version < 49) {
	    var origGetUserMedia = navigator.mediaDevices.getUserMedia.
	        bind(navigator.mediaDevices);
	    navigator.mediaDevices.getUserMedia = c =>
	        origGetUserMedia(c).catch(e => Promise.reject(shimError_(e)));
	  }
	};

	},{"../utils":8}],7:[function(require,module,exports){
	/*
	 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
	 *
	 *  Use of this source code is governed by a BSD-style license
	 *  that can be found in the LICENSE file in the root of the source
	 *  tree.
	 */
	'use strict';
	var safariShim = {
	  // TODO: DrAlex, should be here, double check against LayoutTests
	  // shimOnTrack: function() { },

	  // TODO: DrAlex
	  // attachMediaStream: function(element, stream) { },
	  // reattachMediaStream: function(to, from) { },

	  // TODO: once the back-end for the mac port is done, add.
	  // TODO: check for webkitGTK+
	  // shimPeerConnection: function() { },

	  shimGetUserMedia: function() {
	    navigator.getUserMedia = navigator.webkitGetUserMedia;
	  }
	};

	// Expose public methods.
	module.exports = {
	  shimGetUserMedia: safariShim.shimGetUserMedia
	  // TODO
	  // shimOnTrack: safariShim.shimOnTrack,
	  // shimPeerConnection: safariShim.shimPeerConnection,
	  // attachMediaStream: safariShim.attachMediaStream,
	  // reattachMediaStream: safariShim.reattachMediaStream
	};

	},{}],8:[function(require,module,exports){
	/*
	 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
	 *
	 *  Use of this source code is governed by a BSD-style license
	 *  that can be found in the LICENSE file in the root of the source
	 *  tree.
	 */
	 /* eslint-env node */
	'use strict';

	var logDisabled_ = false;

	// Utility methods.
	var utils = {
	  disableLog: function(bool) {
	    if (typeof bool !== 'boolean') {
	      return new Error('Argument type: ' + typeof bool +
	          '. Please use a boolean.');
	    }
	    logDisabled_ = bool;
	    return (bool) ? 'adapter.js logging disabled' :
	        'adapter.js logging enabled';
	  },

	  log: function() {
	    if (typeof window === 'object') {
	      if (logDisabled_) {
	        return;
	      }
	      if (typeof console !== 'undefined' && typeof console.log === 'function') {
	        console.log.apply(console, arguments);
	      }
	    }
	  },

	  /**
	   * Extract browser version out of the provided user agent string.
	   *
	   * @param {!string} uastring userAgent string.
	   * @param {!string} expr Regular expression used as match criteria.
	   * @param {!number} pos position in the version string to be returned.
	   * @return {!number} browser version.
	   */
	  extractVersion: function(uastring, expr, pos) {
	    var match = uastring.match(expr);
	    return match && match.length >= pos && parseInt(match[pos], 10);
	  },

	  /**
	   * Browser detector.
	   *
	   * @return {object} result containing browser, version and minVersion
	   *     properties.
	   */
	  detectBrowser: function() {
	    // Returned result object.
	    var result = {};
	    result.browser = null;
	    result.version = null;
	    result.minVersion = null;

	    // Fail early if it's not a browser
	    if (typeof window === 'undefined' || !window.navigator) {
	      result.browser = 'Not a browser.';
	      return result;
	    }

	    // Firefox.
	    if (navigator.mozGetUserMedia) {
	      result.browser = 'firefox';
	      result.version = this.extractVersion(navigator.userAgent,
	          /Firefox\/([0-9]+)\./, 1);
	      result.minVersion = 31;

	    // all webkit-based browsers
	    } else if (navigator.webkitGetUserMedia) {
	      // Chrome, Chromium, Webview, Opera, all use the chrome shim for now
	      if (window.webkitRTCPeerConnection) {
	        result.browser = 'chrome';
	        result.version = this.extractVersion(navigator.userAgent,
	          /Chrom(e|ium)\/([0-9]+)\./, 2);
	        result.minVersion = 38;

	      // Safari or unknown webkit-based
	      // for the time being Safari has support for MediaStreams but not webRTC
	      } else {
	        // Safari UA substrings of interest for reference:
	        // - webkit version:           AppleWebKit/602.1.25 (also used in Op,Cr)
	        // - safari UI version:        Version/9.0.3 (unique to Safari)
	        // - safari UI webkit version: Safari/601.4.4 (also used in Op,Cr)
	        //
	        // if the webkit version and safari UI webkit versions are equals,
	        // ... this is a stable version.
	        //
	        // only the internal webkit version is important today to know if
	        // media streams are supported
	        //
	        if (navigator.userAgent.match(/Version\/(\d+).(\d+)/)) {
	          result.browser = 'safari';
	          result.version = this.extractVersion(navigator.userAgent,
	            /AppleWebKit\/([0-9]+)\./, 1);
	          result.minVersion = 602;

	        // unknown webkit-based browser
	        } else {
	          result.browser = 'Unsupported webkit-based browser ' +
	              'with GUM support but no WebRTC support.';
	          return result;
	        }
	      }

	    // Edge.
	    } else if (navigator.mediaDevices &&
	        navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) {
	      result.browser = 'edge';
	      result.version = this.extractVersion(navigator.userAgent,
	          /Edge\/(\d+).(\d+)$/, 2);
	      result.minVersion = 10547;

	    // Default fallthrough: not supported.
	    } else {
	      result.browser = 'Not a supported browser.';
	      return result;
	    }

	    // Warn if version is less than minVersion.
	    if (result.version < result.minVersion) {
	      utils.log('Browser: ' + result.browser + ' Version: ' + result.version +
	          ' < minimum supported version: ' + result.minVersion +
	          '\n some things might not work!');
	    }

	    return result;
	  }
	};

	// Export.
	module.exports = {
	  log: utils.log,
	  disableLog: utils.disableLog,
	  browserDetails: utils.detectBrowser(),
	  extractVersion: utils.extractVersion
	};

	},{}]},{},[2]);


/***/ }
/******/ ])
});
;