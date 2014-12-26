module.exports = function(grunt)
{

    // Project configuration.
    grunt.initConfig(
    {
        pkg: grunt.file.readJSON('package.json'),
        uglify:
        {
            options:
            {
                banner: '/*! <%= pkg.description %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build:
            {
                files:
                {
                    'dist/emoji.min.js': ['js/app.js', 'js/emojiDirectives.js', 'js/emojiFilters.js', 'js/util.js', 'js/jquery.emojiarea.js', 'js/nanoscroller.js']
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
                options:
                {
                    banner: '/*! <%= pkg.description %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                files:
                {
                    'dist/emoji.min.css': ['css/nanoscroller.css','css/style.css']
                }
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

    // Default task(s).
    grunt.registerTask('default', ['uglify', 'jshint', 'cssmin']);

};
