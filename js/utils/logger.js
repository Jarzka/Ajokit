(function() {
    TRAFFICSIM_APP.utils = TRAFFICSIM_APP.utils || {};
    TRAFFICSIM_APP.utils.logger = TRAFFICSIM_APP.utils.logger || {};

    TRAFFICSIM_APP.utils.logger.LogType = {
        "ERROR": 3,
        "WARNING": 2,
        "INFO": 1,
        "DEBUG": 0
    };

    TRAFFICSIM_APP.utils.logger.currentLogginglevel = {
        "ERROR": true,
        "WARNING": true,
        "INFO": true,
        "DEBUG": true
    };

    TRAFFICSIM_APP.utils.logger.log = function (logType, message) {
        if (TRAFFICSIM_APP.utils.logger.currentLogginglevel[TRAFFICSIM_APP.utils.logger.logTypeAsText(logType)] === true) {
            if (logType == this.LogType.ERROR) {
                console.error("[" + TRAFFICSIM_APP.utils.logger.logTypeAsText(logType) + "] " + message);
            } else if (logType == this.LogType.WARNING) {
                console.warn("[" + TRAFFICSIM_APP.utils.logger.logTypeAsText(logType) + "] " + message);
            } else {
                console.log("[" + TRAFFICSIM_APP.utils.logger.logTypeAsText(logType) + "] " + message);
            }
        }
    };

    TRAFFICSIM_APP.utils.logger.logTypeAsText = function (logType) {
        switch (logType) {
            case TRAFFICSIM_APP.utils.logger.LogType.ERROR:
                return "ERROR";
            case TRAFFICSIM_APP.utils.logger.LogType.WARNING:
                return "WARNING";
            case TRAFFICSIM_APP.utils.logger.LogType.INFO:
                return "INFO";
            case TRAFFICSIM_APP.utils.logger.LogType.DEBUG:
                return "DEBUG";
        }
    };
})();