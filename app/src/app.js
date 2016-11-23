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
	var user_lang = localStorage.getItem('lang');
	if(user_lang === null) {
		var systemLang = navigator.language;
		if(systemLang != 'ko') {
			systemLang = 'en';
		}
		localStorage.setItem('lang', systemLang);
	}
	$('head').append('<script src="./lang/' + user_lang + '.js">' + '</script>')
}
