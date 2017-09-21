# grunt-fetch-bindings

> fetch bindings from ts files and create a json containing these values along with html-file-name and path

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-fetch-bindings --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-fetch-bindings');
```

## The "fetch_bindings" task

### Overview
In your project's Gruntfile, add a section named `fetch_bindings` to the data object passed into `grunt.initConfig()`.

```js
    grunt.initConfig({
      fetch_bindings: {
          options: {
            src: "src/app/components/",
            dest: "dist/confiles",
            wildcard: "**/*.component.ts",
            bindname: "{'cmsKey':{"
          },
          files: {
            'dest/default_options': ['src/srcfile', 'src/123'],
          }
        },
      });
```

### Assumption - ts files
assuming the following occurence in *.component.ts files
```js
    super.initCms({'cmsKey': {
                'savecartheading': 'Save Cart(default)',
                'deviceLabel': 'Device(default)',
                'pricingplanLabel': 'Pricing(default)',
                'protectionLabel': 'Protection(default)',
                'continueButton': 'Continue(default)',
                'editSelectionsButton': 'Edit(default)'
            }});
```

### Package.json

```js
{
  "name": "my-fetch-bindings-test",
  "version": "0.0.0",
  "dependencies": {},
  "devDependencies": {
    "grunt": "~0.4.2",
    "grunt-fetch-bindings": "^0.1.0"
  },
  "engines": {
    "node": ">=0.8.0"
  }
}
```

### Options

#### options.src
Type: `String`
Default value: `'src'`

Directory where html files are avaiable.

#### options.dest
Type: `String`
Default value: `'dist'`

Directory where json file is created.

#### options.bindname
Type: `String`
Default value: `'contentData'`

Binding name which is to be searched through and the name of json file.

### Usage Examples

#### Default Options
In this example, the default options are used.

```js
    grunt.initConfig({
      fetch_bindings: {
          options: {
            src: "src/",
            wildcard: "**/*.component.ts",
            dest: "dist/",
            bindname: "{'cmsKey':{"
          },
          files: {
            'dest/default_options': ['src/srcfile', 'src/123'],
          }
        },
      });
```

#### Custom Options
In this example, custom options are used.

```js
    grunt.initConfig({
      fetch_bindings: {
          options: {
            src: "src/app/components/",
            dest: "dist/confiles",
            wildcard: "**/*.component.ts",
            bindname: "{'cmsKey':{"
          },
          files: {
            'dest/default_options': ['src/srcfile', 'src/123'],
          }
        },
      });
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
