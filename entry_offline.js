//var context = {};


$(function () {
	var workspace = document.getElementById("workspace");
	var initOptions = {
		type: 'workspace'
	};
	Entry.init(workspace, initOptions);
	Entry.playground.setBlockMenu();
	Entry.loadProject();
});



var app = angular.module('workspace', ['ngCookies']);


