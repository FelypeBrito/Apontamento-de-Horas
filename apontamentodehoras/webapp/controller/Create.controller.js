sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent"
], function (BaseController, JSONModel, formatter, History, MessageToast, UIComponent) {
    "use strict";
    return BaseController.extend("apontamento.apontamentodehoras.controller.Create", {
        formatter: formatter,
        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();
            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("worklist", {}, true);
            }
        },

        onCancelar: function (oEvent) {
            this.onNavBack();
        },
        onGravar: function () {
            var oModel = this.getModel();
            var dados = {
                Funcid: this.byId("inpFuncid").getValue(),

                Data: this.byId("inpData").getValue(),
                Atividade: this.byId("inpAtividade").getValue(),
                Hentrada: this.byId("inpHentrada").getValue(),
                Hsaida: this.byId("inpHsaida").getValue(),
                Descricao: this.byId("inpDescricao").getValue(),
                
            };
            oModel.create("/HorasTrabalhadasSet", dados, {
                success: function (oDados, resposta) {
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("object", {});
                    sap.m.MessageToast.show('Horas apontadas.');
                }.bind(this),
                error: function (oError) {
                console.log(e)
                    debugger
                }.bind(this),
            });
        }


    });
}); 
