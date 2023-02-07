module.exports = function(grunt) {

    var config = require('./.screeps.json')
    var branch = grunt.option('branch') || config.branch;
    var email = grunt.option('email') || config.email;
    var token = grunt.option('token') || config.token;
    var ptr = grunt.option('ptr') ? true : config.ptr

    grunt.loadNpmTasks('grunt-screeps')
    grunt.loadNpmTasks('grunt-contrib-clean')
    grunt.loadNpmTasks('grunt-contrib-copy')

    grunt.initConfig({
        screeps: {
            options: {
                email: email,
                token: token,
                branch: branch,
                ptr: ptr
            },
            dist: {
                src: ['dist/*.js']
            }
        },

        // Remove all files from the dist folder.
        clean: {
          'dist': ['dist']
        },

        // Copy all source files into the dist folder, flattening the folder structure by converting path delimiters to underscores
        copy: {
          // Pushes the game code to the dist folder so it can be modified before being send to the screeps server.
          screeps: {
            files: [{
              expand: true,
              cwd: 'bin/',
              src: '**',
              dest: 'dist/',
              filter: 'isFile',
              flatten: true,
            }],
            options: {
              process: function (content, srcpath) {
                let reqs = content.matchAll(/require\(\"(.*?)\"\);?/g);
                for (let req of reqs)
                {
                  let names = req[0].split('/');
                  let fanme = names[names.length-1];
                  content = content.replace(req[0], `require("${fanme}`);
                }

                return content;
              }
            }
          }
        },
    })

    grunt.registerTask('default',  ['clean', 'copy:screeps', 'screeps']);
}