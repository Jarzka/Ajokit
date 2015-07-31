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
            worldController.getCamera().aspect = window.innerWidth / window.innerHeight; // FIXME Does not work
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