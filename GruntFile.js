module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			sass: {
				files: ['sass/**/*.{scss,sass}'],
				tasks: ['sass:dist']
			},
            scripts: {
                files: ['js/**/*.js'],
                tasks: ['concat:app'],
                options: {
                    spawn: false
                }
            },
            libraries: {
                files: ['bower_components/*.js'],
                tasks: ['concat:infrastructure'],
                options: {
                    spawn: false
                }
            },
            index: {
                files: ['index.html'],
                tasks: ['copy:missingFiles'],
                options: {
                    spawn: false
                }
            }
        },
		sass: {
			options: {
				outputStyle: 'compressed'
			},
			dist: {
				files: {
                    // Destination  Source
					'dist/css/main.css': 'sass/main.scss'
				}
			}
		},
        concat: {
            options: {
                separator: ';'
            },
            app: {
                /* NOTE: include order is somewhat important. config.js is not included so that it can be modified easily without re-building the app. */
                src: ['js/app.js',
                    'js/utils/logger.js',
                    'js/utils/math.js',
                    'js/exceptions.js',
                    'js/game/gameplay_object.js',
                    'js/game/vehicle.js',
                    'js/game/road.js',
                    'js/game/road_node.js',
                    'js/game/road_route.js',
                    'js/game/traffic_light.js',
                    'js/game/traffic_lights_controller.js',
                    'js/game/map.js',
                    'js/texture_container.js',
                    'js/model_container.js',
                    'js/world_renderer.js',
                    'js/world_controller.js',
                    'js/game/road_controller.js',
                    'js/game/vehicle_controller.js',
                    'js/scenes/gameplay_scene.js',
                    'js/scenes/loading_game_scene.js',
                    'js/simulation_app.js',
                    'js/main.js'
                ],
                dest: 'dist/js/production.js'
            },
            infrastructure: {
                src: ['bower_components/jquery/dist/jquery.js',
                    'bower_components/threejs/build/three.js'],
                dest: 'dist/js/infrastructure.js'
            }
        },
        copy: {
            missingFiles: {
                files: [
                    {
                        // Copy index.html to dist
                        src: 'index.html',
                        dest: 'dist/index.html'
                    },
                    {
                        // Copy JS libraries that are not part of the automatic infrastructure.js build
                        expand: true,
                        src: 'js/lib/**',
                        dest: 'dist/'
                    },
                    {
                        // Copy CSS libraries that are not part of the automatic SCSS build
                        expand: true,
                        src: 'css/**',
                        dest: 'dist/'
                    },
                    {
                        // Copy images
                        expand: true,
                        src: 'img/**',
                        dest: 'dist/'
                    },
                    {
                        // Copy 3D models
                        expand: true,
                        src: 'models/**',
                        dest: 'dist/'
                    },
                    {
                        // Copy config.js which is not part of the automatic production.js build
                        src: 'js/config.js',
                        dest: 'dist/'
                    }
                ]
            }
        },
        uglify: {
            app: {
                src: 'dist/js/production.js',
                dest: 'dist/js/production.js'
            },
            infrastructure: {
                src: 'dist/js/infrastructure.js',
                dest: 'dist/js/infrastructure.js'
            }
        },
        simplemocha: {
            options: {
                globals: ['should'],
                timeout: 3000,
                ignoreLeaks: false,
                ui: 'bdd',
                reporter: 'tap'
            },

            all: { src: 'test/**/*.js' }
        }
	});

	grunt.registerTask('default', [
        'sass:dist',
        'concat:app',
        'concat:infrastructure',
        'copy:missingFiles',
        'watch'
    ]);

    grunt.registerTask('build', [
        'sass:dist',
        'concat:app',
        'concat:infrastructure',
        'copy:missingFiles'
    ]);
    grunt.registerTask('build-min', [
        'sass:dist',
        'concat:app',
        'concat:infrastructure',
        'uglify:app',
        'uglify:infrastructure',
        'copy:missingFiles'
    ]);


    grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-simple-mocha');
};