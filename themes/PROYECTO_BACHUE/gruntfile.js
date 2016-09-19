module.exports = function ( grunt ) {

	// Configure tasks
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		uglify: {
			dev: {
				beautify: true,
				preserveComments: "all",
				src: "assets/js/*.js",
				dest: "js/scripts.min.js"
			}
		},
		watch: {
			js: {
				files: ["assets/js/*.js"],
				tasks: ["uglify:dev"]
			},
			grunt: { files: ['gruntfile.js'] },
			css: { 
				files: ['assets/css/*.css'], 
				tasks: [ "cssmin:dist", "usebanner:taskName" ]
			}
		},
		imagemin: {                          
			static: {                          
				options: {                      
					optimizationLevel: 3,
					svgoPlugins: [{ removeViewBox: false }]
				},
				files: {                         
				}
			},
			dynamic: {                        
				files: [{
					expand: true,               
					cwd: 'assets/img/',                  
					src: ['**/*.{png,jpg,gif}'],  
					dest: 'img/'                  
				}]
			}
		},
		cssmin: {
			dist: {
				files: {
					'style.min.css': ['assets/css/*.css']
				}
			}
		},
		usebanner: {
			taskName: {
				options: {
					position: 'top',
					banner: '/* ' + 
							'	Theme Name: PROYECTO BACHUE \n ' +
							'	Author: Fred Cave \n ' +
							'	Version: <%= grunt.template.today("dd-mm-yyyy") %> \n' +
							'*/',
					linebreak: true
				},
				files: {
					src: [ 'style.min.css' ]
				}
			}
		}
	});

	// Load the plugins
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-banner");
	grunt.loadNpmTasks('grunt-contrib-imagemin');

	// Register tasks
	grunt.registerTask("default", ["uglify:dev"]);

}