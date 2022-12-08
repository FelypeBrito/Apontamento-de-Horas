String.prototype.pad = function (size) {
	var s = this;
	while (s.length < (size || 2)) { s = "0" + s; }
	return s;
}

/*
 * Triggered when date needs to be added
*/
Date.prototype.addDays = function (days) {
	var date = new Date(this.valueOf());
	date.setDate(date.getDate() + days);
	return date;
}

/*
 * Triggered when a date needs to be subtracted
*/
Date.prototype.removeDays = function (days) {
	var date = new Date(this.valueOf());
	date.setDate(date.getDate() - days);
	return date;
}

Date.prototype.removeHoras = function () {
	var date = new Date(this.valueOf());
	var dateBR = date.formatDataBR();
	return new Date().parseDataBR(dateBR);
}

/*
 * BR date formatter
*/
Date.prototype.formatDataBR = function () {
	var date = new Date(this.valueOf());
	return ("00" + date.getDate()).slice(-2) + '.' + ("00" + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear();
}

Date.prototype.parseDataBR = function (dataBR) {
	var dia = parseInt(dataBR.substring(0, 2));
	var mes = parseInt(dataBR.substring(3, 5));
	var ano = parseInt(dataBR.substring(6, 10));
	return new Date(ano, mes - 1, dia);
}

Date.prototype.formatData = function () {
	var date = new Date(this.valueOf() + this.getTimezoneOffset() * 60000);

	var ano = date.getFullYear();
	var mes = date.getMonth() + 1;
	mes = ("00" + mes).slice(-2);
	var dia = date.getDate();
	dia = ("00" + dia).slice(-2);

	return dia + '.' + mes + '.' + ano;
}

Date.prototype.menorHoje = function () {
	var hoje = new Date();
	var dataHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

	var timeDiff = this.valueOf() - dataHoje.getTime();
	var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
	return (diffDays < 0);
}

Date.prototype.maiorHoje = function () {
	var hoje = new Date();
	var dataHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

	var timeDiff = this.valueOf() - dataHoje.getTime();
	var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
	return (diffDays > 0);
}

Date.prototype.menorDataLimite = function (days) {
	var limite = new Date().addDays(days);
	var dataLimite = new Date(limite.getFullYear(), limite.getMonth(), limite.getDate());

	var timeDiff = this.valueOf() - dataLimite.getTime();
	var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
	return (diffDays < 0);
}

Date.prototype.dataValida = function (date) {
	var matches = /(\d{2})[-.\/](\d{2})[-.\/](\d{4})/.exec(date);
	if (matches == null) {
		return false;
	}
	var dia = matches[1];
	var mes = matches[2] - 1;
	var ano = matches[3];
	var data = new Date(ano, mes, dia);
	return data.getDate() == dia && data.getMonth() == mes && data.getFullYear() == ano;
}


sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/library",
    "sap/ui/core/format/DateFormat"
], function (Controller, UIComponent, mobileLibrary, DateFormat) {
    "use strict";

    // shortcut for sap.m.URLHelper
    var URLHelper = mobileLibrary.URLHelper;

    return Controller.extend("apontamento.apontamentodehoras.controller.BaseController", {
        /**
         * Convenience method for accessing the router.
         * @public
         * @returns {sap.ui.core.routing.Router} the router for this component
         */
        getRouter : function () {
            return UIComponent.getRouterFor(this);
        },

        formatDate: (date)=> (date  != undefined && date !== "") ? date.formatData(): '',

		formatHour: function (date) {
			if (date != undefined) {
				var timeFormat = DateFormat.getTimeInstance({ pattern: "HH:mm:ss " });
				var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
				return timeFormat.format(new Date(date.ms + TZOffsetMs));  //11:00 AM
			} else {
				return '';
			}
		},

        /**
         * Convenience method for getting the view model by name.
         * @public
         * @param {string} [sName] the model name
         * @returns {sap.ui.model.Model} the model instance
         */
        getModel : function (sName) {
            return this.getView().getModel(sName);
        },

        /**
         * Convenience method for setting the view model.
         * @public
         * @param {sap.ui.model.Model} oModel the model instance
         * @param {string} sName the model name
         * @returns {sap.ui.mvc.View} the view instance
         */
        setModel : function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

        /**
         * Getter for the resource bundle.
         * @public
         * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
         */
        getResourceBundle : function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        /**
         * Event handler when the share by E-Mail button has been clicked
         * @public
         */
        onShareEmailPress : function () {
            var oViewModel = (this.getModel("objectView") || this.getModel("homeView") || this.getModel("horasView") || this.getModel("homeprimeView"));
            URLHelper.triggerEmail(
                null,
                oViewModel.getProperty("/shareSendEmailSubject"),
                oViewModel.getProperty("/shareSendEmailMessage")
            );
        }
    });

});