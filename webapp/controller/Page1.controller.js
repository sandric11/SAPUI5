sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ndc/BarcodeScanner",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"./odata_api"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller,
		Scanner,
		MessageBox,
		MessageToast
	) {
		"use strict";

		return Controller.extend("sapphir.createreservation.controller.Page1", {
			onInit: function () {
				// if you are not at controller of your 'rootView' of the UIComponent,
				// this.getOwnerComponent().getModel("countrySet") // 'this' being the controller of the view
				// else
				// this.getView().getModel("countrySet") would suffice
				this.jModel = this.getOwnerComponent().getModel("jModelWerksLgort");
				this.oModel = this.getOwnerComponent().getModel("oModelReservation");

				this.byId("buttonPotrdi").setEnabled(false);


			},

			isProstorEntered: function (oEvent) {
				var inputValue = oEvent.getSource().getValue();
				(inputValue !== '') ? this.byId("buttonPotrdi").setEnabled(true) : this.byId("buttonPotrdi").setEnabled(false);
			},

			onSkeniraj: function (oEvent) {
				var that = this;
				Scanner.scan(function (mResult) {
					that.byId("inputProstor").setValue(mResult.text);

				}, function (Error) {
					alert("Scanning failed: " + Error);
				});
			},
			onSubmit: function () {

				// Preveri vnos v inputProstor (v primeru da so ga ročno vnesli npr. 2902_1000)
				var input = this.getView().byId("inputProstor").getValue();
				//check da je kar koli kontri
				if (input === '' || input === undefined || input === null) {
					MessageToast.show("Poskeniraj ali vnesi prostor!", {
						duration: 3500, // default
						width: "15em", // default
						my: "center center", // default
						at: "center center", // default
						of: window, // default
						offset: "0 0", // default
						collision: "fit fit", // default
						onClose: null, // default
						autoClose: true, // default
						animationTimingFunction: "ease", // default
						animationDuration: 1000, // default
						closeOnBrowserNavigation: true // default
					});

					return;
				}

				//Split stringa Sebastjan
				var werksLgort = input.split('_');
				// set data to jModel
				var jData = {};
				jData.Werks = werksLgort[0];
				jData.Lgort = werksLgort[1];
				this.jModel.setData(jData);
				var sUrl = `/WerksToLgortSet(Werks=\'${jData.Werks}\',LgortFrom=\'${jData.Lgort}\')`;
				this.oPage = this.byId("page1");
				this.oPage.setBusy(true);
				var that = this;

				this.oModel.read(sUrl, {
					success: function (oData, oResponse) {
						that.oPage.setBusy(false);
						var resData = {};
						resData = oData;

						//Preverimo ali kombinacija obstaja
						if (resData.Lgortactive === 'X') {
							//pojdi na naslednji page2
							that.getOwnerComponent().getRouter().navTo("RoutePage2", {});
						} else {
							that.oPage.setBusy(false);
							sap.m.MessageBox.show("Navedeni prostor ne obstaja v sistemu SAP!", {
								icon: sap.m.MessageBox.Icon.ERROR,
								title: "Obvestilo",
								actions: [sap.m.MessageBox.Action.OK],
								onClose: function (oAction) {
									if (oAction === "OK") {
										// to Do pobrišemo podatke iz inputa
										that.getView().byId("inputProstor").setValue(null);
										//refrest jModel
										that.jModel.setData({});
									}
								}
							});

						}

					},
					error: function (oError) {

					}
				});
			}
		});
	});
