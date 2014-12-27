module.exports = function(grunt)
{
    var appConfig = grunt.file.readJSON('package.json') ||
    {};

    // Project configuration.
    grunt.initConfig(
    {
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.description %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',

        usebanner:
        {
            dist:
            {
                options:
                {
                    position: 'top',
                    banner: '<%= banner %>'
                },
                files:
                {
                    src: ['dist/js/*.js', 'dist/css/*.css', 'src/css/*.css', 'src/js/*.js']
                }
            }
        },

        connect:
        {
            server:
            {
                options:
                {
                    port: 8000,
                    hostname: '*',
                }
            }
        },

        watch:
        {
            files: ['css/*.css', 'js/*.js', '*.html'],
        },

        copy:
        {
            main:
            {
                files: [
                    {
                        src: 'img/*',
                        dest: 'dist/'
                    },
                    {
                        src: 'js/config.js',
                        dest: 'dist/'
                    }

                ]
            },

            src:
            {
                files: [
                    {
                        src: 'img/*',
                        dest: 'src/'
                    },
                    {
                        src: 'css/*.css',
                        dest: 'src/'
                    },
                    {
                        src: 'js/*.js',
                        dest: 'src/'
                    },


                ]
            },
        },

        uglify:
        {
            build:
            {
                files:
                {
                    'dist/js/emoji.min.js': ['js/app.js', 'js/emojiDirectives.js', 'js/emojiFilters.js', 'js/util.js', 'js/jquery.emojiarea.js', 'js/nanoscroller.js']
                }
            }
        },

        jshint:
        {
            options:
            {
                jshintrc: '.jshintrc',
                force: true,
                reporterOutput: 'jshint.log'
            },
            all: ['Gruntfile.js', 'js/*.js']
        },

        cssmin:
        {
            target:
            {
                files:
                {
                    'dist/css/emoji.min.css': ['css/nanoscroller.css', 'css/emoji.css']
                }
            }
        },

        compress:
        {
            main:
            {
                options:
                {
                    archive: 'emoji.zip'
                },
                files: [
                {
                    src: ['dist/**'],
                    dest: '/',
                }]
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-compress');


    // Default task(s).
    grunt.registerTask('default', ['uglify', 'jshint', 'cssmin', 'usebanner', 'copy:main']);
    grunt.registerTask('src', ['copy:src', 'usebanner']);
    grunt.registerTask('serve', ['connect', 'watch']);


};
