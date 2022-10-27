
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


        onLoginTap: function () {
            var oModel = this.getModel();
         
            var dados = {
                Email: this.getView().byId("email").getValue(),
                Senha: this.getView().byId("pasw").getValue(),
                
            };
            sap.m.MessageToast.show("User Id: " + email + " Password: " + pasw);

            oModel.read("/FuncionariosSet",dados,  {
                success: function (oDados, resposta) {
                    
                }.bind(this),

                error: function (oError) {
                    var erro;
                    erro = JSON.parse(oError.responseText);
                }.bind(this),
            });
        },







    });
},

);
