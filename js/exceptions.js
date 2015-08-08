TRAFFICSIM_APP.exceptions = TRAFFICSIM_APP.exceptions || {};

TRAFFICSIM_APP.exceptions.GeneralException = function(message) {
    this.message = message;
    this.name = "GeneralException";
};