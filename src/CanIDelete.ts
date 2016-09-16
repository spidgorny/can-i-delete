const _ = require('underscore');
const assign = require('object.assign').getPolyfill();
import FileInFolder from './FileInFolder';
import Folder from './Folder';

export default class CanIDelete {

	pathFrom: string;

	pathTo: string;

	private threshold: number;

	constructor(from: string, to: string) {
		this.threshold = 90;
		this.pathFrom = from;
		this.pathTo = to;
	}

	scanPath(path: string) {
		const fs = require('fs');
		console.log('Reading files from ' + path);
		let cacheFile = path.replace(':', '').replace('\\', '-').replace(' ', '-').toLowerCase() + '.json';

		let tree;
		if (!fs.existsSync(cacheFile)) {
			let dirTree = require('directory-tree');
			tree = dirTree(path);
			console.log('Done');
			fs.writeFileSync(cacheFile, JSON.stringify(tree));
			console.log('Cached');
		} else {
			let json = fs.readFileSync(cacheFile);
			tree = JSON.parse(json);
		}
		console.log('tree', tree.children.length);
		return tree;
	}

	linearize(tree: Folder) {
		let folderList = [];
		if (tree.children) {
			let files = [];
			tree.children.forEach((folder: Folder) => {
				//console.log(folder.path);
				if (folder.children) {
					let subFolder = this.linearize(folder);
					folderList = folderList.concat(subFolder);
				} else {
					files.push(new FileInFolder(folder));
				}
			});
			folderList.push(new Folder({
				path: tree.path,
				name: tree.name,
				size: tree.size,
				extension: tree.extension,
				files: files,
			}));
		} else {
			throw new Error('this should never happen');
		}
		return folderList;
	}

	run() {
		let dirFrom = this.scanPath(this.pathFrom);
		let dirTo = this.scanPath(this.pathTo);

		let linearFrom = this.linearize(dirFrom);
		let linearTo = this.linearize(dirTo);
		//console.log(linearTo);

		var ProgressBar = require('progress');
		var bar = new ProgressBar(':percent [:bar] :elapsed/:eta', {
			total: linearFrom.length * linearTo.length,
			//stream: process.stdout,
			width: 100,
		});

		// single thread 51 sec
		linearFrom.map(this.compareOneToMany.bind(this, linearTo, bar));

		// multi-core
		// var Pool = require('multiprocessing').Pool;
		// var pool = new Pool();
		// pool.map(linearFrom, this.compareOneToMany.bind(this, linearTo, bar)).then(function (result) {
		// 	console.log(result);
		// });

		// const Parallel = require('paralleljs');
		// var p = new Parallel(linearFrom);
		// p.map(this.compareOneToMany.bind(this, linearTo, bar)).then(function (result) {
		// 	console.log(result);
		// });

		console.log('Done');
	}

	compareOneToMany(linearTo: Array<Folder>, bar, folder: Folder) {
		linearTo.forEach((candidate: Folder) => {
			let similarity = folder.compare(candidate);
			if (similarity > this.threshold) {
				console.log();	// <br /> after progress bar
				console.log(folder.toString(), candidate.toString(), similarity);
			}
			bar.tick();
		});
	}

}
