'use strict';

// 기존에서 제거된 요소ㅓ 'ngRoute'
angular.module('common', ['ngCookies', 'ngResource', 'ui.bootstrap', 'LocalStorageModule', 'ngTouch']);
angular.module('workspace', ['common']);