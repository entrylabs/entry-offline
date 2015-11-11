//var context = {};


$(function () {
	var workspace = document.getElementById("workspace");
	var initOptions = {
		type: 'workspace',
		libDir : './bower_components'
	};
	Entry.init(workspace, initOptions);
	Entry.playground.setBlockMenu();
	Entry.loadProject();
});



var app = angular.module('workspace', ['ngCookies']);


