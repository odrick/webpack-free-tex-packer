const fs = require('fs');
const texturePacker = require("free-tex-packer-core");

class WebpackFreeTexPacker {
	constructor(src, dest, options=null) {
		if(!Array.isArray(src)) src = [src];
		
		this.src = src;
		this.dest = dest;
		this.options = options;
	}
	
	apply(compiler) {
		compiler.hooks.emit.tapAsync('WebpackFreeTexPacker', (compilation, callback) => {
			/*
			console.log(this.src);
			console.log(this.dest);
			console.log(this.options);
			
			for(let path of this.src) {
				compilation.fileDependencies.add(path);
			}
			
			console.log(compilation.fileDependencies);
			console.log(compilation.contextDependencies);
			*/

			/*
			compilation.assets['filelist.md'] = {
				source: function() {
					return filelist;
				},
				size: function() {
					return filelist.length;
				}
			};
			*/

			callback();
		});
	}
}

module.exports = WebpackFreeTexPacker;