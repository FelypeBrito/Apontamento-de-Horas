var sdata;
var sHinicial;
var sHfinal;
var sHtotal;
var sID;
var consultorNome;

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

    return BaseController.extend("apontamento.apontamentodehoras.controller.Apontamento", {

        formatter: formatter,

        onInit: function () {
            // apply content density mode to root view
            this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
            this.getRouter().getRoute("apontamento").attachPatternMatched(this._onApontamentoMatched, this);
            // create model

        },

        onCancelar: function (oEvent) {
            history.go(-1);
        },
        onGravar: function () {
            var oModel = this.getModel();

            sHtotal = this.duracao(sHinicial, '00:00', '00:00', sHfinal);
            var convertValue = sID.toString();
            var vValue1 = convertValue.split("'");




            var dados = {
                Projname: this.byId("inpProjname").getValue(),
                Funcid: vValue1[1],
                Nome: consultorNome,
                Data: sdata,
                Atividade: this.byId("inpAtividade").getValue(),
                Hentrada: sHinicial,
                Hsaida: sHfinal,
                Descricao: this.byId("inpDescricao").getValue(),
                Htotal: sHtotal,
            };

            oModel.create("/HorasTrabalhadasSet", dados, {
                success: function (oDados, resposta) {
                    MessageToast.show('Horas apontadas com sucesso!!');
                    history.go(-1);
                }.bind(this),
                error: function (oError) {
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

        parse: function (horario) {
            // divide a string em duas partes, separado por dois-pontos, e transforma em número
            let [hora, minuto] = horario.split(':').map(v => parseInt(v));
            if (!minuto) { // para o caso de não ter os minutos
                minuto = 0;
            }
            return minuto + (hora * 60);
        },

        // calcula a duração total em minutos
        duracao: function (entrada1, saida1, entrada2, saida2) {
            let periodo = (this.parse(saida1) - this.parse(entrada1)) + (this.parse(saida2) - this.parse(entrada2));
            let horas = Math.trunc(periodo / 60).toString()
            let minutos = (periodo % 60).toString();
            horas = ("00" + horas).slice(-2);
            minutos = ("00" + minutos).slice(-2);
            return (horas + ":" + minutos);
        },

        _onApontamentoMatched: function (oEvent) {

            sID = oEvent.getParameter("arguments").Funcid
            var convertValue = sID.toString();
            var vValue1 = convertValue.split("'");
            var oModel = this.getModel();


            oModel.read("/FuncionarioSet", {


                //method: "GET",
                success: function (oDados, resposta) {

                    for (var i = 0; i < oDados.results.length; i++) {

                        if (oDados.results[i].Funcid == vValue1[1]) {

                            consultorNome = oDados.results[i].Nome;
                        }

                    }

                }.bind(this),

                error: function (oError) {
                    var erro;
                    erro = JSON.parse(oError.responseText);
                    MessageToast.show("Dados incorreto ou usuário não cadastrado!");
                }.bind(this),
            });



            ;
        },
    });
},

);

