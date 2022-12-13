sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment"


], function (BaseController, JSONModel, formatter, MessageToast, Fragment) {
    "use strict";


    return BaseController.extend("apontamento.apontamentodehoras.controller.NewProject", {

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

                Nome: this.byId("inpNome").getValue(),
                Cliname: this.byId("inpCliname").getValue(),
                Funcid: this.byId("inpFuncid").getValue(),

            };



            oModel.create("/ProjetoSet", dados, {
                success: function (oDados, resposta) {
                    MessageToast.show('Funcionário criado com sucesso!!');
                    history.go(-1);
                }.bind(this),
                error: function (oError) {
                    debugger
                }.bind(this),
            });
        },


        /*valueHelpRequest: function (oEvent) {
            var oValueHelpDialog = new sap.ui.ux3.ToolPopup({
                modal: true,
                inverted: false,                          // disable color inversion
                title: "Select Material Number",
                opener: "idMatnrInput",             // locate dialog next to this field
                closed: function (oEvent) {
                }
            });
            var oOkButton = new sap.ui.commons.Button({
                text: "OK",
                press: function (oEvent) {
                    oEvent.getSource().getParent().close();
                }
            });

            oValueHelpDialog.addButton(oOkButton);

            oValueHelpDialog.open();
        },*/



        /* onValueHelpRequest: function () {
             if (!this._oValueHelpDialog) {
                 Fragment.load({
                     name: "apontamento.apontamentodehoras.ValueHelpDialog",
                     controller: this
                 }).then(function (oValueHelpDialog){
                     this._oValueHelpDialog = oValueHelpDialog;
                     this.getView().addDependent(this._oValueHelpDialog);
                     this._configValueHelpDialog();
                     this._oValueHelpDialog.open();
                 }.bind(this));
             } else {
                 this._configValueHelpDialog();
                 this._oValueHelpDialog.open();
             }
         },
 
         _configValueHelpDialog: function () {
             var sInputValue = this.byId("productInput").getValue(),
                 oModel = this.getView().getModel();
     	
 
                 oModel.read("/Cliente1Set", {
                     //method: "GET",
                     success: function (oDados, resposta) {
                         var aProducts = oModel.getProperty("/Cliente1Set");
                         oModel.setData(oData.results);
                           oView.setModel(oModel, "info");
     
                     }.bind(this),
     
                     error: function (oError) {
                         var erro;
                         erro = JSON.parse(oError.responseText);
                         MessageToast.show("Dados incorreto ou usuário não cadastrado!");
                     }.bind(this),
                 });
 
             aProducts.forEach(function (oProduct) {
                 oProduct.selected = (oProduct.Nome === sInputValue);
             });
             oModel.setProperty("/Cliente1Set", aProducts);
         },
 
         onValueHelpDialogClose: function (oEvent) {
             var oSelectedItem = oEvent.getParameter("selectedItem"),
                 oInput = this.byId("productInput");
 
             if (!oSelectedItem) {
                 oInput.resetProperty("value");
                 return;
             }
 
             oInput.setValue(oSelectedItem.getTitle());
         }*/

    });



},

);
