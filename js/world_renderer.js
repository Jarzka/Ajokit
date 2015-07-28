TRAFFICSIM_APP.WorldRenderer = function (worldController) {
    var renderer;
    var worldController = worldController;

    function constructor() {
        initialize();
        addEventListeners();
    }

    function addEventListeners() {
        $(window).resize(function() {
            renderer.setSize(window.innerWidth, window.innerHeight);
            worldController.getCamera().width(window.innerWidth);
            worldController.getCamera().height(window.innerHeight);
        });
    }

    function initialize() {
        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMapEnabled = true;
        renderer.shadowMapSoft = true;
        document.body.appendChild(renderer.domElement);
    }

    this.render = function () {
        renderer.render(worldController.getThreeJSScene(), worldController.getCamera());
    };

    constructor();
};