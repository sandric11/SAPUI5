sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(
	Controller
) {
	"use strict";

	return Controller.extend("sapphir.basicgetstock.controller.Page2", {

        /**
         * @override
         */
        onInit: function() {
          const jStockModel = this.getOwnerComponent().getModel("jStockModel");  
		  this.getView().setModel(jStockModel, "jStockModel");
            
        },
		/**
		 * @override
		 */
		onBeforeRendering: function() {
			
			
		},
		onBack: function(oEvent) {
			this.getOwnerComponent().getRouter().navTo("RoutePage1");
		},

		labstMeinsFormatter: function(labst, meins){
			if(meins === 'ST') {meins = 'KOS'};
			var formmater = `${labst} - ${meins}`;
			return formmater;
		}

	});
});