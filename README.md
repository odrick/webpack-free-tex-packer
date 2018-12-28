# webpack-free-tex-packer
> Webpack Free texture packer plugin

> Based on https://github.com/odrick/free-tex-packer

# Install
   
$ npm install webpack-free-tex-packer
   
# Basic usage

**webpack.config.js**

```js
const path = require('path');
const WebpackFreeTexPacker = require('webpack-free-tex-packer');

module.exports = {
    entry: [
        './src/index',
        'webpack-dev-server/client?http://localhost:8080'
    ],
    output: {filename: 'index.js'},
    mode: 'development',
    plugins: [
        new WebpackFreeTexPacker(path.resolve(__dirname, 'atlases'))
    ]
};
```

**Output:**

http://localhost:8080/pack-result.png \
http://localhost:8080/pack-result.json 

# Advanced usage

Use packer options object, multiple sources, custom output folder

**webpack.config.js**

```js
const path = require('path');
const WebpackFreeTexPacker = require('webpack-free-tex-packer');

let sources = [];
sources.push(path.resolve(__dirname, 'atlases/10.png'));
sources.push(path.resolve(__dirname, 'atlases/11.png'));
sources.push(path.resolve(__dirname, 'atlases/12.png'));
sources.push(path.resolve(__dirname, 'atlases/dir1'));
sources.push(path.resolve(__dirname, 'atlases/dir2/.'));

let packOptions = {
    textureName: 'atlas',
    width: 512,
    height: 512,
    fixedSize: false,
    padding: 2,
    allowRotation: true,
    detectIdentical: true,
    allowTrim: true,
    exporter: "Pixi",
    removeFileExtension: false,
    prependFolderName: true
};

module.exports = {
    entry: [
        './src/index',
        'webpack-dev-server/client?http://localhost:8080'
    ],
    output: {filename: 'index.js'},
    mode: 'development',
    plugins: [
        new WebpackFreeTexPacker(sources, 'assets', packOptions)
    ]
};
```

**Output:**

http://localhost:8080/assets/atlas.png \
http://localhost:8080/assets/atlas.json 

---

**Plugin arguments**

| prop             | type            | description                                                                                      |
| ---              | ---             | ---                                                                                              |
| sources          | String or Array | Images or folders path. Folder path, ended by ('.', '\*' or '\*.\*') includes images to atlas root. |
| output           | String          | Output folder                                                                                    |
| packOptions      | Object          | Pack options                                                                                     |

---

**Full example**

https://github.com/odrick/webpack-free-tex-packer/tree/master/example

 * download
 * npm install
 * npm start
 * open http://localhost:8080

---

**Pack options description**: https://github.com/odrick/free-tex-packer-core#available-options

**Custom exporters description**: https://github.com/odrick/free-tex-packer-core#custom-exporter

# Used libs

* **Free texture packer core** - https://github.com/odrick/free-tex-packer-core

---
License: MIT
