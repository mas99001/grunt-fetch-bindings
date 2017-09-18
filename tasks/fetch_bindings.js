/*
 * grunt-fetch-bindings
 * https://github.com/mas99001/grunt-fetch-bindings
 *
 * Copyright (c) 2017 Aditya Kumar
 * Licensed under the MIT license.
 */
'use strict';
var fs = require('fs');
module.exports = function(grunt) {
    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks
    grunt.registerMultiTask('fetch_bindings', 'fetch bindings from html files and create a json containing these values along with file name and path', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            src: "src/",
            wildcard: "*.html",
            dest: "dist/",
            bindname: "contentData"
        });
        var lastChar = options.dest.substr(-1);
        //add trailing forward slash in dest
        if (lastChar != '/') {
            options.dest = options.dest + '/';
        }
        //no trailing forward slash in src
        lastChar = options.src.substr(-1);
        if (lastChar == '/') {
            options.src = options.src.slice(0, -1);
        }
        console.log(); 
        console.log('\x1b[36m%s\x1b[0m', 'Source Folder:= ' + options.src);
        console.log('\x1b[36m%s\x1b[0m', 'Destination Folder:= ' + options.dest);
        console.log('\x1b[36m%s\x1b[0m', 'Files filter:= ' + options.wildcard);
        console.log('\x1b[36m%s\x1b[0m', 'Binding name:= ' + options.bindname);
        var wc = ".";
        var filelist = [];

        var walk = function(dir) {
            console.log("Begining WALK with : " + dir);
            var files = fs.readdirSync(dir);
            files.forEach(function(file) {
                if (fs.statSync(dir + '/' + file).isDirectory()) {}
                else { 
                  if (file.includes(wc)) 
                    filelist.push(dir+'/'+file); 
                }
            });
        };

        var walkRecursive = function(dir) {
          console.log('\x1b[34m%s\x1b[0m', "Begining WALKRecursive with : " + dir);
            var files = fs.readdirSync(dir);
            files.forEach(function(file) {
                if (fs.statSync(dir + '/' + file).isDirectory()) {
                    walkRecursive(dir + '/' + file);
                }
                else { 
                  if (file.includes(wc)) 
                    filelist.push(dir+'/'+file); 
                }
            });
        };

        var lCreateDirs = function(path){
            console.log(); 
            var pathArray = path.split('/');
            var pEle = '';
            pathArray.forEach(function(ele){
                pEle += ele + '/';
                console.log('\x1b[36m%s\x1b[0m', pEle);
                if(!fs.existsSync(pEle))
                    fs.mkdirSync(pEle);
            });
        }

        var collectBindnames = function() {
            if(!fs.existsSync(options.dest))
                lCreateDirs(options.dest.slice(0, -1));
            var bindings = {};
            filelist.forEach(function(element) {
                var filename = element.replace(/^.*[\\\/]/, '')
                var sourceHtml = fs.readFileSync(element, 'utf8');
                var sourceHtmlgArray = sourceHtml.split(options.bindname);
                var index = 0;
                bindings[filename.split(".")[0]]={
                    "keys": [],
                    "angularhtml": element
                }
                sourceHtmlgArray.forEach(function(ele){
                    if(index !== 0){
                        var tempBnd = sourceHtmlgArray[index].split("}}")[0].split(".")[1];
                        var tempBndVal = tempBnd.replace(/([A-Z])/g, " $1").charAt(0).toUpperCase() + tempBnd.replace(/([A-Z])/g, " $1").slice(1);
                        bindings[filename.split(".")[0]].keys.push(tempBnd + ": " + tempBndVal);
                    }
                    index += 1;
                })
            }, this);
            grunt.file.write(options.dest + options.bindname + ".json", JSON.stringify(bindings, null, 4));
        };

        console.log(); 
        switch(options.wildcard) {
            case '*.html':    wc = ".html"; walk(options.src);          break;
            case '*.*':       wc = ".html"; walk(options.src);          break;
            case '**/*':      wc = ".html"; walkRecursive(options.src); break;
            case '**/*.html': wc = ".html"; walkRecursive(options.src); break;
            default:          console.log('\x1b[31m%s\x1b[0m', "fetch_bindings: Only html files can be processed");     abort();
        }
        console.log(); 
        console.log('\x1b[35m%s', 'Following are the files, which are processed: '); 
        console.log(filelist);
        collectBindnames();
    });
};
