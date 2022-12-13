var sClinid;
var sID;

sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "../model/formatter",
    "sap/m/MessageToast"
], function (BaseController, JSONModel, History, formatter, MessageToast) {
    "use strict";

    return BaseController.extend("apontamento.apontamentodehoras.controller.ObjectPrime", {

        formatter: formatter,


        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the worklist controller is instantiated.
         * @public
         */
        onInit: function () {
            // Model used to manipulate control states. The chosen values make sure,
            // detail page shows busy indication immediately so there is no break in
            // between the busy indication for loading the view's meta data
            var oViewModel = new JSONModel({
                busy: true,
                delay: 0
            });
            this.getRouter().getRoute("objectprime").attachPatternMatched(this._onObjectPrimeMatched, this);
            this.setModel(oViewModel, "objectprimeView");

        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        onPress: function (oEvent) {
            // The source is the list item that got pressed
            this._showObject(oEvent.getSource());
        },

        /**
         * Event handler  for navigating back.
         * It there is a history entry we go one step back in the browser history
         * If not, it will replace the current entry of the browser history with the worklist route.
         * @public
         */
        onNavBack: function () {
            history.go(-1);
        },

        onProjetoDelete(oEvent) {
            var oItem = oEvent.getParameter("listItem");
            var sPath = oItem.getBindingContext().getPath();

            var oModel = this.getView().getModel();

            oModel.remove(sPath, {
                success: function () {
                    sap.m.MessageToast.show('Funcionário eliminado com sucesso.');
                }.bind(this),
                error: function (e) {
                    console.error(e);
                }.bind(this),

            });

        },


        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        /**
         * Binds the view to the object path.
         * @function
         * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
         * @private
         */
        _onObjectPrimeMatched: function (oEvent) {

            //sID = oEvent.getParameter("arguments").Funcid;
            // this._bindView("/ProjetoSet" + sID);
            var sNome = oEvent.getParameter("arguments").Nome;

            //filtra os funcionario refernte ao login a partir do cliente 
            var oView = this.getView();
            var oTable = oView.byId("idProductsTable");
            var oBinding = oTable.getBinding("items");

            // apply filters 
            var aFilters = [];
            var convertValue = sNome.toString();
            var vValue1 = convertValue.split("'");
            var oFilter = new sap.ui.model.Filter("Cliname", sap.ui.model.FilterOperator.EQ, vValue1[1]);

            aFilters.push(oFilter);
            oBinding.filter(aFilters);

        },

        _showObject: function (oItem) {
            var oModel = this.getModel();
            var convertValue = sID.toString();
            var vValue1 = convertValue.split("'");
            var path = oItem.getBindingContext().getPath();
            convertValue = path.toString();
            var vValue2 = convertValue.split("'");


            oModel.read("/ProjetoSet", {
                //method: "GET",
                success: function (oDados, resposta) {

                    for (var i = 0; i < oDados.results.length; i++) {

                        if (oDados.results[i].Projid == vValue2[1]) {
                            var dados = {
                                sID: vValue1[1],
                                Nome: oDados.results[i].Nome
                            }
                            this.getRouter().navTo("horas", {
                                Nome: "('" + dados.Nome + "')"
                            })

                        }
                    }

                }.bind(this),

                error: function (oError) {
                    var erro;
                    erro = JSON.parse(oError.responseText);
                    MessageToast.show("Dados incorreto ou projeto não cadastrado!");
                }.bind(this),
            })
        },

        /**
         * Binds the view to the object path.
         * @function
         * @param {string} sObjectPath path to the object to be bound
         * @private
         */
        _bindView: function (sObjectPath) {
            var oViewModel = this.getModel("objectView");

            this.getView().bindElement({
                path: sObjectPath,
                events: {
                    change: this._onBindingChange.bind(this),
                    dataRequested: function () {
                        oViewModel.setProperty("/busy", true);
                    },
                    dataReceived: function () {
                        oViewModel.setProperty("/busy", false);
                    }
                }
            });
        },

        _onBindingChange: function () {
            var oView = this.getView(),
                oViewModel = this.getModel("objectView"),
                oElementBinding = oView.getElementBinding();

            // No data for the binding
            if (!oElementBinding.getBoundContext()) {
                this.getRouter().getTargets().display("objectNotFound");
                return;
            }

            var oResourceBundle = this.getResourceBundle(),
                oObject = oView.getBindingContext().getObject(),
                sObjectId = oObject.ClienteID,
                sObjectName = oObject.Nome;

            oViewModel.setProperty("/busy", false);
            oViewModel.setProperty("/shareSendEmailSubject",
                oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
            oViewModel.setProperty("/shareSendEmailMessage",
                oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
        }
    });

});
