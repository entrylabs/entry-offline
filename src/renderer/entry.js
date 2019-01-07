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

// 
root.BigNumber = require('bignumber.js');