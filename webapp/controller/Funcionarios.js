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


    });
}); 
