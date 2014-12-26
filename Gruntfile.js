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
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build:
            {
                files:
                {
                    'build/emoji.min.js': ['js/app.js', 'js/config.js', 'js/emojiDirectives.js', 'js/emojiFilters.js']
                }
            }
        },

        jshint:
        {
            options:
            {
                jshintrc: '.jshintrc'
            },
            all: ['Gruntfile.js', 'js/*.js']
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Default task(s).
    grunt.registerTask('default', ['uglify']);

};
