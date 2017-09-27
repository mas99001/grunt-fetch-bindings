/*
 * grunt-fetch-bindings
 * https://github.com/mas99001/grunt-fetch-bindings
 *
 * Copyright (c) 2017 Aditya Kumar
 * Licensed under the MIT license.
 */
'use strict';
var fs = require('fs');
var path = require('path');
module.exports = function(grunt) {
    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks
    grunt.registerMultiTask('fetch_bindings', 'fetch bindings from ts files and create a json containing these values along with html-file-name and path', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            src: "src/",
            wildcard: "**/*.component.ts",
            dest: "dist/",
            baseURL: "ui/idp/",
            outputfile: "config/selectorList.json",
            bindname: "{'cmsKey':{"
        });
        var lastChar = options.dest.substr(-1);
        //add trailing forward slash in dest
        if (lastChar != '/') {
            options.dest = options.dest + '/';
        }
        lastChar = options.baseURL.substr(-1);
        //add trailing forward slash in dest
        if (lastChar != '/') {
            options.baseURL = options.baseURL + '/';
        }
        options.dest = options.dest + options.baseURL;
        //no trailing forward slash in src
        lastChar = options.src.substr(-1);
        if (lastChar == '/') {
            options.src = options.src.slice(0, -1);
        }
        console.log(); 
        console.log('\x1b[36m%s\x1b[0m', 'Source Folder:= ' + options.src);
        console.log('\x1b[36m%s\x1b[0m', 'Files filter:= ' + options.wildcard);
        console.log('\x1b[36m%s\x1b[0m', 'Destination Folder:= ' + options.dest);
        console.log('\x1b[36m%s\x1b[0m', 'Base URL:= ' + options.baseURL);
        console.log('\x1b[36m%s\x1b[0m', 'Output file name:= ' + options.outputfile);
        console.log('\x1b[36m%s\x1b[0m', 'Binding name:= ' + options.bindname);
        var wc = ".";
        var filelist = [];

        var walk = function(dir) {
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
        
        var getTemplateURL = function(filepath) {
            var dir = path.dirname(filepath);
            var files = fs.readdirSync(dir);
            var fileR = "";
            files.forEach(function(file) {
                if (fs.statSync(dir + '/' + file).isDirectory()) {
                }
                else { 
                  if (file.includes(".html")){
                        console.log('\x1b[31m%s\x1b[0m', file);
                        fileR = file;
                    }
                }
            });
            return fileR;
        };

        var collectBindnames = function() {
            if(!fs.existsSync(options.dest))
                lCreateDirs(options.dest.slice(0, -1));
            var bindings = {};
            filelist.forEach(function(element) {
                var filename = element.replace(/^.*[\\\/]/, '');
                var copyCWD = element.split(filename)[0];
                var copyFileName;
                var sourceHtml = fs.readFileSync(element, 'utf8');
                var compName = sourceHtml;               
                var templateURL;
                var sourceHtmlgArray; 
                sourceHtml = sourceHtml.replace(/\s/g, "");
                if (sourceHtml.includes(options.bindname)){
                    try {
                        compName = compName.split("export class ")[1];
                        compName = compName.split(" extends")[0];
                        compName = compName.replace("Component","").replace("component","");
                        compName = compName.charAt(0).toLowerCase() + compName.slice(1);
                    } catch (error) {
                        compName = "ERROR";
                    }

                    try {
                        templateURL = sourceHtml.split("@Component({")[1];
                        templateURL = templateURL.split(")}")[0];
                        templateURL = templateURL.split("templateUrl:")[1];
                        templateURL = templateURL.split(",")[0].replace(/'/g,'');;
                        templateURL = path.basename(templateURL);
                        copyFileName = templateURL;
                        templateURL = options.baseURL + 'template/' + templateURL;                           
                    } catch (error) {
                        templateURL = "";;
                    }
                    sourceHtmlgArray = sourceHtml.split(options.bindname)[1].split("}}")[0].split(",");
                }
                else{
                    return;
                }
                bindings[compName]={
                    "keys": [],
                    "angularhtml": templateURL
                }
                if(templateURL !== ""){
                    if(!fs.existsSync(options.dest + 'template/'))                  
                        lCreateDirs(options.dest + 'template/');                        
                    fs.writeFileSync(options.dest + 'template/' + copyFileName, fs.readFileSync(copyCWD+copyFileName));
                }
                sourceHtmlgArray.forEach(function(ele){
                    var elearray = ele.split(":");
                    var constructedkey = "";
                    elearray.forEach(function(element){
                        if(constructedkey !== ""){
                                constructedkey += ": ";
                        }
                        constructedkey += element.trim().replace(/'/g, '');
                    });
                    bindings[compName].keys.push(constructedkey);
                })
            }, this);
            grunt.file.write(options.dest + options.outputfile, JSON.stringify(bindings, null, 4));
        };

        console.log(); 
        switch(options.wildcard) {
            case '*.html':    wc = ".html"; walk(options.src);          break;
            case '*.*':       wc = ".html"; walk(options.src);          break;
            case '**/*':      wc = ".html"; walkRecursive(options.src); break;
            case '**/*.html': wc = ".html"; walkRecursive(options.src); break;
            case '**/*.component.ts': wc = ".component.ts"; walkRecursive(options.src); break;
            default:          console.log('\x1b[31m%s\x1b[0m', "fetch_bindings: Only html files can be processed");     abort();
        }
        console.log(); 
        console.log('\x1b[35m%s', 'Following are the files, which are processed: '); 
        console.log(filelist);
        collectBindnames();
    });
};
