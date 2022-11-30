
sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent",
], function (BaseController, JSONModel, formatter, History, MessageToast) {
    "use strict";


    return BaseController.extend("apontamento.apontamentodehoras.controller.App", {

        formatter: formatter,

        onInit: function () {
            // apply content density mode to root view
            this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
            // create model

        },

        onLoginTap: function (oEvent) {
            var oModel = this.getModel();

            var dados = {
                Funcid: this.getView().byId("id").getValue(),
                Senha: this.getView().byId("pasw").getValue(),

            };


            oModel.read("/FuncionarioSet('" + dados.Funcid + "')", {
                //method: "GET",
                success: function (oDados, resposta) {

                    if (oDados.Funcid == dados.Funcid && oDados.Senha == dados.Senha) {

                        MessageToast.show("Nome: " + oDados.Nome);
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                        oRouter.navTo("home", {});
                    }

                }.bind(this),

                error: function (oError) {
                    var erro;
                    erro = JSON.parse(oError.responseText);
                }.bind(this),
            });
        },

        _showObject: function (oItem) {
            this.getRouter().navTo("app", {
                objectId: oItem.getBindingContext().getPath().substring("/Cliente1Set".length)
            });
        },

    });
},

);
