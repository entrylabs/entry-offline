/* eslint-disable */
const root = require('window-or-global');

// EntryStatic
const { EntryStatic } = require('./resources/static.js');
root.EntryStatic = EntryStatic;

// lodash
root._ = require('lodash');

// lang
if (!localStorage.getItem('lang')) {
    localStorage.setItem('lang', 'ko');
}
let user_lang = localStorage.getItem('lang');
root.Lang = require(`./lang/${user_lang}.js`).Lang;

// jquery
root.$ = root.jQuery = require('jquery');

// bigNumber
root.BigNumber = require('bignumber.js');

// entry-lms dummy
root.entrylms = {
	alert: (text) => { alert(text); },
	confirm: (text) => {
		const isConfirm = confirm(text);
		const defer = new root.$.Deferred();
		return defer.resolve(isConfirm);
	}
}

// render workspace
import './render.jsx';