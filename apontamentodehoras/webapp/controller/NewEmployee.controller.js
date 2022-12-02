var sdata;
var sHinicial;
var sHfinal;
var sHtotal;

sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent",
    "sap/ui/core/Core",
    "sap/ui/core/library",
    "sap/ui/unified/library",
    "sap/ui/unified/DateTypeRange",
    "sap/ui/core/format/DateFormat"
], function (BaseController, JSONModel, formatter, History, MessageToast, UIComponent, Core, CoreLibrary, UnifiedLibrary, DateTypeRange, DateFormat) {
    "use strict";

    var CalendarDayType = UnifiedLibrary.CalendarDayType,
        ValueState = CoreLibrary.ValueState;

    return BaseController.extend("apontamento.apontamentodehoras.controller.NewEmployee", {

        formatter: formatter,

        onInit: function () {
            // apply content density mode to root view
            this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
            // create model

        },

        onCancelar: function (oEvent) {
            history.go(-1);
        },
        onGravar: function () {
            var oModel = this.getModel();


            var dados = {
                Clinid: this.byId("inpClinid").getValue(), 
                Nome: this.byId("inpNome").getValue(),
                Telefone: this.byId("inpNome").getValue(),
                Email: this.byId("inpEmail").getValue(),
                Senha: this.byId("inpSenha").getValue(),
                
            };

            oModel.create("/FuncionarioSet", dados, {
                success: function (oDados, resposta) {
                    MessageToast.show('/Funcionario criado com sucesso!!.');
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                        oRouter.navTo("home", {});
                }.bind(this),
                error: function (oError) {
                    debugger
                }.bind(this),
            });
        },


    });
},

);
