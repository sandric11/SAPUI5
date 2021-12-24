/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"sapphir/basic_get_stock/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
