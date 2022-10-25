var sdata;
var sHinicial;
var sHfinal;
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
	"sap/ui/unified/DateTypeRange"
], function (BaseController,JSONModel,formatter,History,  MessageToast, UIComponent, Core,CoreLibrary, UnifiedLibrary, DateTypeRange) {
    "use strict";

    var CalendarDayType = UnifiedLibrary.CalendarDayType,
		ValueState = CoreLibrary.ValueState;


    return BaseController.extend("apontamento.apontamentodehoras.controller.App", {

    formatter: formatter,

        onInit: function () {
            // apply content density mode to root view
            this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
                // create model
              
        },

        onCancelar: function (oEvent) {
            this.onNavBack();
        },
        onGravar: function () {
            var oModel = this.getModel();
            var dados = {
                Funcid: this.byId("inpFuncid").getValue(),
                Data: sdata,
                Atividade: this.byId("inpAtividade").getValue(),
                Hentrada: sHinicial,
                Hsaida: sHfinal,
                Descricao: this.byId("inpDescricao").getValue()  
            };
            
            oModel.create("/HorasTrabalhadasSet", dados, {
                success: function (oDados, resposta) {
                    MessageToast.show('Horas apontadas com sucesso!!.');
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("funcionarios", {});
                    
                }.bind(this),
                error: function (oError) {
                console.log(e)
                    debugger
                }.bind(this),
            });
        },

        handleChange: function (oEvent) {
            var oDP = oEvent.getSource(),
                sValue = oEvent.getParameter("value");
            sdata = sValue;
        },

        handleChange2: function (oEvent) {
            var oTP = oEvent.getSource(),
                sValue = oEvent.getParameter("value");
            sHinicial = sValue;
        },

        handleChange3: function (oEvent) {
            var oTP = oEvent.getSource(),
                sValue = oEvent.getParameter("value");
            sHfinal = sValue;
        },

        
        

    });
},

);



