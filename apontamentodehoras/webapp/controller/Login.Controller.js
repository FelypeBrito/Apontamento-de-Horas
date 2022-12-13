
sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent",
], function (BaseController, JSONModel, formatter, History, MessageToast, UIComponent) {
    "use strict";


    return BaseController.extend("apontamento.apontamentodehoras.controller.Login", {

        formatter: formatter,

        onInit: function () {
            // apply content density mode to root view
            this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
            // create model

        },

        onLoginTap: function (oEvent) {
            var oModel = this.getModel();



            oModel.read("/FuncionarioSet", {
                //method: "GET",
                success: function (oDados, resposta) {

                    var dados = {
                        Funcid: this.getView().byId("id").getValue(),
                        Senha: this.getView().byId("pasw").getValue(),

                    };


                    for (var i = 0; i < oDados.results.length; i++) {
                        if (oDados.results[i].Funcid == dados.Funcid && oDados.results[i].Senha == dados.Senha && oDados.results[i].Permissao == "X") {

                            MessageToast.show("Login realizado com sucesso!");

                            this.getRouter().navTo("homeprime", { Funcid: oDados.results[i].Funcid });

                        } else if (oDados.results[i].Funcid == dados.Funcid && oDados.results[i].Senha == dados.Senha && oDados.results[i].Permissao == "") {

                            MessageToast.show("Login realizado com sucesso!");
                            this.getRouter().navTo("home", { Funcid: oDados.results[i].Funcid });
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



    });
},

);
