sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent"
], function (BaseController, JSONModel, formatter, History, MessageToast, UIComponent) {

    "use strict";

    return BaseController.extend("apontamento.apontamentodehoras.controller.Funcionarios", {

        formatter: formatter,

        onInit: function () {
            // Model used to manipulate control states. The chosen values make sure,
            // detail page shows busy indication immediately so there is no break in
            // between the busy indication for loading the view's meta data
            var oViewModel = new JSONModel({
                busy: true,
                delay: 0
            });
            this.getRouter().getRoute("funcionarios").attachPatternMatched(this._onFuncionarioMatched, this);
            this.setModel(oViewModel, "funcionariosView");


        },

        onAfterRendering: function () {
            // Model used to manipulate control states. The chosen values make sure,
            // detail page shows busy indication immediately so there is no break in
            // between the busy indication for loading the view's meta data
            var oViewModel = new JSONModel({
                busy: true,
                delay: 0
            });
            this.getRouter().getRoute("funcionarios").attachPatternMatched(this._onFuncionarioMatched, this);
            this.setModel(oViewModel, "funcionariosView");


        },


        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();
            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("object", {}, true);
            }
        },

        /**
         * Binds the view to the object path.
         * @function
         * @param {sap.ui.base.Event} oEvent pattern match event in route 'funcionarios'
         * @private
         */

         _onFuncionarioMatched: function (oEvent) {
            var sFuncionariostId = oEvent.getParameter("arguments").objectId;
            this._bindView("/FuncionarioSet" + sFuncionariostId);

            //filtra os funcionarios a partir do cliente
            var oView = this.getView();
            var oTable = oView.byId("idNoteTable");
            var oBinding = oTable.getBinding("items");

            // apply filters 
            var aFilters = [];
            var convertValue = sFuncionariostId.toString();
            var vValue1 = convertValue.split("'");
            var oFilter = new sap.ui.model.Filter("Funcid", sap.ui.model.FilterOperator.EQ, vValue1[1]);
            aFilters.push(oFilter);

            oBinding.filter(aFilters);
        },

        _bindView: function (sObjectPath) {
            var oViewModel = this.getModel("funcionariosView");

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
                oViewModel = this.getModel("funcionariosView"),
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
        }
    });

});
