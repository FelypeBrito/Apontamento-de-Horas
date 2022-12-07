var sID;
var dados;
sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (BaseController, JSONModel, formatter, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("apontamento.apontamentodehoras.controller.Home", {

        formatter: formatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the worklist controller is instantiated.
         * @public
         */
        onInit : function () {
            var oViewModel;

            // keeps the search state
            this._aTableSearchState = [];

            // Model used to manipulate control states
            oViewModel = new JSONModel({
                busy: true,
                delay: 0
            });
            
            
            this.getRouter().getRoute("home").attachPatternMatched(this._onHomeMatched, this);
            this.setModel(oViewModel, "homeView");
        },


        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        /**
         * Triggered by the table's 'updateFinished' event: after new table
         * data is available, this handler method updates the table counter.
         * This should only happen if the update was successful, which is
         * why this handler is attached to 'updateFinished' and not to the
         * table's list binding's 'dataReceived' method.
         * @param {sap.ui.base.Event} oEvent the update finished event
         * @public
         */
        onUpdateFinished : function (oEvent) {
            // update the worklist's object counter after the table update
            var sTitle,
                oTable = oEvent.getSource(),
                iTotalItems = oEvent.getParameter("total");
            // only update the counter if the length is final and
            // the table is not empty
            if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
                sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
            } else {
                sTitle = this.getResourceBundle().getText("worklistTableTitle");
            }
            this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
        },

        /**
         * Event handler when a table item gets pressed
         * @param {sap.ui.base.Event} oEvent the table selectionChange event
         * @public
         */
        onPress : function (oEvent) {
            // The source is the list item that got pressed
            this._showObject(oEvent.getSource());
        },

        onApontar: function(oEvent){
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this)
            oRouter.navTo("apontamento", {Funcid: sID})
            
        },

        onCliente: function(oEvent){
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this)
            oRouter.navTo("newclient", {Funcid: sID})
            
        },

        onFuncionario: function(oEvent){
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this)
            oRouter.navTo("newemployee", {Funcid: sID})
            
        },


        /**
         * Event handler for navigating back.
         * Navigate back in the browser history
         * @public
         */
        onNavBack : function() {
            // eslint-disable-next-line sap-no-history-manipulation
            history.go(-1);
        },


        onSearch : function (oEvent) {
            if (oEvent.getParameters().refreshButtonPressed) {
                // Search field's 'refresh' button has been pressed.
                // This is visible if you select any main list item.
                // In this case no new search is triggered, we only
                // refresh the list binding.
                this.onRefresh();
            } else {
                var aTableSearchState = [];
                var sQuery = oEvent.getParameter("query");

                if (sQuery && sQuery.length > 0) {
                    aTableSearchState = [new Filter("Nome", FilterOperator.Contains, sQuery)];
                }
                this._applySearch(aTableSearchState);
            }

        },

        /**
         * Event handler for refresh event. Keeps filter, sort
         * and group settings and refreshes the list binding.
         * @public
         */
        onRefresh : function () {
            var oTable = this.byId("table");
            oTable.getBinding("items").refresh();
        },


        onClienteDelete(oEvent){
            var oItem = oEvent.getParameter("listItem");
            var sPath = oItem.getBindingContext().getPath();

            var oModel = this.getView().getModel();

            oModel.remove(sPath,  {
                success: function(){
                    sap.m.MessageToast.show('Cliente eliminado com sucesso.');               
                }.bind(this),
                error: function(e){
                    console.error(e);
                }.bind(this),

            });

        },



        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        /**
         * Shows the selected item on the object page
         * @param {sap.m.ObjectListItem} oItem selected Item
         * @private
         */
        _onHomeMatched: function (oEvent) {

             sID = "('" + oEvent.getParameter("arguments").Funcid + "')";

            //filtra os funcionarios a partir do cliente
            var oView = this.getView();
            var oTable = oView.byId("table");
            
            var oBinding = oTable.getBinding("items");

            // apply filters 
            var aFilters = [];
            var convertValue = sID.toString();
            var vValue1 = convertValue.split("'");
            var oFilter = new sap.ui.model.Filter("Funcid", sap.ui.model.FilterOperator.EQ, vValue1[1]);
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


            oModel.read("/Cliente1Set", {
                //method: "GET",
                success: function (oDados, resposta) {

                    for (var i = 0; i < oDados.results.length; i++) {

                        if (oDados.results[i].Funcid == vValue1[1] && oDados.results[i].Clinid == vValue2[1]) {
                            dados = {
                                sID: oDados.results[i].Funcid,
                                Nome: oDados.results[i].Nome,
                                Clinid: oDados.results[i].Clinid
                            }
                            this.getRouter().navTo("object", {
                                Funcid: "('" + dados.sID + "')",
                                Nome: "('" + dados.Nome + "')",
                                Clinid: "('" + dados.Clinid + "')"

                            })
                        }
                    }

                }.bind(this),

                error: function (oError) {
                    var erro;
                    erro = JSON.parse(oError.responseText);
                    MessageToast.show("Dados incorreto ou usuário não cadastrado!");
                }.bind(this),
            });



        },

        _bindView: function (sObjectPath) {
            var oViewModel = this.getModel("homeView");

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
                oViewModel = this.getModel("homeView"),
                oElementBinding = oView.getElementBinding();

            // No data for the binding
            if (!oElementBinding.getBoundContext()) {
                this.getRouter().getTargets().display("objectNotFound");
                return;
            }

            var oResourceBundle = this.getResourceBundle(),
                oObject = oView.getBindingContext().getObject(),
                sObjectId = oObject.Funcid,
                sObjectName = oObject.Nome;

            oViewModel.setProperty("/busy", false);
            oViewModel.setProperty("/shareSendEmailSubject",
                oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
            oViewModel.setProperty("/shareSendEmailMessage",
                oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
        },

        /**
         * Internal helper method to apply both filter and search state together on the list binding
         * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
         * @private
         */
        _applySearch: function(aTableSearchState) {
            var oTable = this.byId("table"),
                oViewModel = this.getModel("worklistView");
            oTable.getBinding("items").filter(aTableSearchState, "Application");
            // changes the noDataText of the list in case there are no filter results
            if (aTableSearchState.length !== 0) {
                oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
            }
        }

    });
});




