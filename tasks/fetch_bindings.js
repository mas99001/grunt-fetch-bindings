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
        console.log(); 
        console.log('\x1b[36m%s\x1b[0m', 'dest:= ' + options.dest);
        console.log('\x1b[36m%s\x1b[0m', 'src:= ' + options.src);
        console.log('\x1b[36m%s\x1b[0m', 'wildcard:= ' + options.wildcard);
        console.log('\x1b[36m%s\x1b[0m', 'bindname:= ' + options.bindname);
        var lastChar = options.dest.substr(-1);
        if (lastChar != '/') {
            options.dest = options.dest + '/';
        }
        lastChar = options.src.substr(-1);
        if (lastChar == '/') {
            options.src = options.src.slice(0, -1);
        }
        console.log(); 
        console.log('\x1b[36m%s\x1b[0m', 'dest:= ' + options.dest);
        console.log('\x1b[36m%s\x1b[0m', 'src:= ' + options.src);
        console.log('\x1b[36m%s\x1b[0m', 'wildcard:= ' + options.wildcard);
        console.log('\x1b[36m%s\x1b[0m', 'bindname:= ' + options.bindname);
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

        var isEven = function(n) {
            var nin = Number(n);
            return nin === 0 || !!(nin && !(nin%2));
        }
        var isOdd = function(n) {
            return isEven(Number(n) + 1);
        }
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
            console.log(); 
            console.log('\x1b[32m%s\x1b[0m', "Begining collectBindnames");
            if(!fs.existsSync(options.dest))
                lCreateDirs(options.dest.slice(0, -1));
            console.log('\x1b[36m%s\x1b[0m', '{');
            filelist.forEach(function(element) {
                var filename = element.replace(/^.*[\\\/]/, '')
                console.log('"' + filename.split(".")[0] + '":');
                var sourceHtml = fs.readFileSync(element, 'utf8');
                var sourceHtmlgArray = sourceHtml.split(options.bindname);
                var index = 0;
                // var splitIndex = 0;
                console.log('\x1b[36m\t%s\x1b[0m', '"keys":[');
                sourceHtmlgArray.forEach(function(ele){
                    if(index !== 0){
                        // splitIndex += 1;
                        console.log("\t\t" + options.bindname + ": " + sourceHtmlgArray[index].split("}}")[0].split(".")[1]);
                        // console.log("splitIndex: " + splitIndex);
                        //fs.writeFileSync(options.dest+filename.replace(".html", "_" + splitIndex + ".html"), sourceHtmlgArray[index], 'utf-8');
                    }
                    index += 1;
                })
                console.log('\x1b[36m\t%s\x1b[0m', ']');
                console.log('\x1b[36m\t%s\x1b[0m', '"angularhtml": ' + element);                
            }, this);
            console.log('\x1b[36m%s\x1b[0m', '}');
            
        };

        console.log(); 
        switch(options.wildcard) {
            case '*.*':       wc = ".";     walk(options.src);          break;
            case '*.html':    wc = ".html"; walk(options.src);          break;
            case '*.js':      wc = ".js";   walk(options.src);          break;
            case '**':        wc = ".";     walkRecursive(options.src); break;
            case '**/*':      wc = ".";     walkRecursive(options.src); break;
            case '**/*.html': wc = ".html"; walkRecursive(options.src); break;
            case '**/*.js':   wc = ".js";   walkRecursive(options.src); break;
            default:          wc = ".";     walk(options.src);
        }
        console.log(); 
        console.log('\x1b[35m%s', 'Following are the files: '); 
        console.log(filelist);
        collectBindnames();
    });
};
