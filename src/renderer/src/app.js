'use strict';

// 기존에서 제거된 요소 'ngRoute'
angular.module('common', ['ngCookies', 'ngResource', 'ngRoute', 'ui.bootstrap', 'LocalStorageModule', 'ngTouch'])
	.config(['$compileProvider', function ($compileProvider) {
		//  Default imgSrcSanitizationWhitelist: /^\s*((https?|ftp|file|blob):|data:image\/)/
        //  chrome-extension: will be added to the end of the expression
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*((https?|ftp|file|blob|app):|data:image\/)/);
 
	}]);
angular.module('workspace', ['common']);

// 다국어 변경 적용
{
	if(!localStorage.getItem('lang')) {
		localStorage.setItem('lang', 'ko');
	}
	var user_lang = localStorage.getItem('lang');
	window.Lang = require(`./lang/${user_lang}.js`).Lang;
	window.Lang.Offline = require(`./lang/offline/${user_lang}.js`).Lang;
	// $('head').append('<script src="./lang/' + user_lang + '.js">' + '</script>')
}
