/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"apontamento/apontamentodehoras/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});