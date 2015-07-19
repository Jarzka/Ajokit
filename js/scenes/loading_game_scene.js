"use strict";

TRAFFICSIM_APP.scenes.LoadingGameScene = function (application) {
    var application = application;

    this.update = function () {
        console.log("Loading done!");
        application.changeScene(new GamePlayScene(application));
    };
};