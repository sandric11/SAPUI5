sap.ui.define([], function() {
    "use strict";
 
    return {
       fetchOdata: function(oModel, sUrl) {
         oModel.read(sUrl, {
            succes: function(odata,oresponse) {return odata, oresponse},
            error: function(oerror) {return oerror}
         })
       }
    };
 });