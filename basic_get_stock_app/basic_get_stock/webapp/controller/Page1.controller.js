sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ndc/BarcodeScanner",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,
	Scanner,
	MessageToast) {
        "use strict";

        return Controller.extend("sapphir.basicgetstock.controller.Page1", {
            onInit: function () {
                
            },

            /**
             * @override
             */
            onAfterRendering: function () {
                this._focusElement("inputMaterial");
                this.getView().byId("btnPotrdi").setEnabled(false);
            },

            _elementValue: function (id) {
                return this.getView().byId(id).getValue();
            },

            _focusElement(id) {
                setTimeout(this.getView().byId(id).focus(), 350);
            },

            getStock: function (oEvent) {
                //material value
                var material = this._elementValue("inputMaterial");
                var zeros = '00000000000';
                var materialZeros = zeros + material;
                materialZeros = materialZeros.replace(/\s+/g, '');
                //werks value
                var obrat = this.getView().byId("selectObrat").getSelectedItem().getKey();
                //lgort value
                var lgort = this.getView().byId("selectLgort").getSelectedItem().getKey();
                //check if input paramterts are OK

                //fetech Data from SAP
                //material:  5007155
                //werks: 2902
                //lgort: 1006
                var that = this;

                //odata model
                const oStockModel = this.getOwnerComponent().getModel("oStockModel");
                var sUrl = "/GetStockSet(Matnr='" + materialZeros + "',Werks='" + obrat + "',Lgort='" +
                    lgort + "')";

                oStockModel.read(sUrl, {
                    success: function (oData, response) {
                        console.log(oData, response);
                        //check if message is initial from SAP
                        if(oData.Message){
                            MessageToast.show(oData.Message, {
                                duration: 4000,                  // default
                                width: "15em",                   // default
                                my: "center center",             // default
                                at: "center center",             // default
                                of: window,                      // default
                                offset: "0 0",                   // default
                                collision: "fit fit",            // default
                                onClose: null,                   // default
                                autoClose: true,                 // default
                                animationTimingFunction: "ease", // default
                                animationDuration: 1000,         // default
                                closeOnBrowserNavigation: true   // default
                            });

                            return;
                        };
                        //JSON model
                        const jStockModel = that.getOwnerComponent().getModel("jStockModel");
                        jStockModel.setData(oData);
                        // show resualts on next Page2
                        that.getOwnerComponent().getRouter().navTo("RoutePage2");
                    },
                    error: function (oError) {
                        

                        alert(oError);
                    }
                })
            },

            isInput: function (oEvent) {
                // Check if something is entered in material
                var data = oEvent.getParameters().value;
                (data) ? this.getView().byId("btnPotrdi").setEnabled(true) : this.getView().byId("btnPotrdi").setEnabled(false);
            },

            onScan: function (oEvent) {
                var that = this;
                Scanner.scan(function (mResult) {
                    that.byId("inputMaterial").setValue(mResult.text);

                }, function (Error) {
                    alert("Scanning failed: " + Error);
                });
            }

        });
    });
