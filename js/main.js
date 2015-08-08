$(document).ready(function() {
    TRAFFICSIM_APP.utils.logger.log(TRAFFICSIM_APP.utils.logger.LogType.DEBUG, "Starting app!");
    try {
        new TRAFFICSIM_APP.SimulationApp();
    } catch (e) {
        console.log("Unfortunately the app has crashed due to an unknown error.");
        console.log("Error name: " + e.name);
        console.log("Error message: " + e.message);
    }
});