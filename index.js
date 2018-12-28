const fs = require('fs');
const pathModule = require('path');
const texturePacker = require("free-tex-packer-core");

const SUPPORTED_EXT = ["png", "jpg", "jpeg"];

function isFolder(path) {
    if(isExists(path)) {
        return fs.statSync(path).isDirectory();
    }
    else {
        path = fixPath(path);
        let name = getNameFromPath(path);
        let parts = name.split(".");
        return parts.length === 1;
    }
}

function isExists(path) {
    return fs.existsSync(path);
}

function fixPath(path) {
    return path.trim().split("\\").join("/");
}

function getNameFromPath(path) {
    return path.trim().split("/").pop();
}

function getExtFromPath(path) {
    return path.trim().split(".").pop().toLowerCase();
}

function getFolderFilesList(dir, base="", list=[]) {
    let files = fs.readdirSync(dir);
    for(let file of files) {
        let path = pathModule.resolve(dir,  file);
        if (isFolder(path) && path.toUpperCase().indexOf('__MACOSX') < 0) {
            list = getFolderFilesList(path, base + file + "/", list);
        }
        else {
            list.push({
                name: (base ? base : "") + file,
                path: path
            });
        }
    }

    return list;
}

function getSubFoldersList(dir, list=[]) {
    let files = fs.readdirSync(dir);
    for(let file of files) {
        let path = pathModule.resolve(dir,  file);
        if (isFolder(path) && path.toUpperCase().indexOf('__MACOSX') < 0) {
            list.push(path);
            list = getSubFoldersList(path, list);
        }
    }

    return list;
}

class WebpackFreeTexPacker {
	constructor(src, dest, options=null) {
		if(!Array.isArray(src)) src = [src];
		
		this.src = src;
		this.dest = dest;
		this.options = options;
	}
	
	apply(compiler) {
		compiler.hooks.emit.tapAsync('WebpackFreeTexPacker', (compilation, callback) => {
			
		    let files = {};
		    
		    for(let srcPath of this.src) {
                let path = fixPath(srcPath);
                
                let name = getNameFromPath(path);
                
                if(!name || name === '.' || name === '*' || name === '*.*') {
                    srcPath = srcPath.substr(0, srcPath.length - name.length - 1);
                    path = fixPath(srcPath);
                    name = '';
                }

                if(isFolder(path)) {
                    if(isExists(srcPath)) {
                        let list = getFolderFilesList(path, (name ? name + '/' : ''));
                        for(let file of list) {
                            let ext = getExtFromPath(file.path);
							if(SUPPORTED_EXT.indexOf(ext) >= 0) files[file.name] = file.path;
                        }
                    }

                    compilation.contextDependencies.add(srcPath);
                    
                    let subFolders = getSubFoldersList(srcPath);
                    for(let folder of subFolders) {
                        compilation.contextDependencies.add(folder);
                    }
                }
                else {
                    if(isExists(srcPath)) {
                        files[getNameFromPath(path)] = path;
                    }

                    compilation.fileDependencies.add(srcPath);
                }
            }
    		    
            let images = [];
            let names = Object.keys(files);
		    for(let name of names) {
                images.push({path: name, contents: fs.readFileSync(files[name])});
            }

            texturePacker(images, this.options, (files) => {
                for(let item of files) {
                    (function(item, dest) {
                        compilation.assets[dest + '/' + item.name] = {
                            source: function() {
                                return item.buffer;
                            },
                            size: function() {
                                return item.buffer.length;
                            }
                        };
                    })(item, this.dest);
                }
                callback();
            });
		});
	}
}

module.exports = WebpackFreeTexPacker;