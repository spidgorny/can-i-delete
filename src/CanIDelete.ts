import FolderTree from "./FolderTree";
const _ = require('underscore');
const assign = require('object.assign').getPolyfill();
import Folder from './Folder';

export default class CanIDelete {

	pathFrom: FolderTree;

	pathTo: FolderTree;

	private threshold: number;

	constructor(from: FolderTree, to: FolderTree) {
		this.threshold = 60;
		this.pathFrom = from;
		this.pathTo = to;
	}

	setThreshold(t: number) {
		this.threshold = t;
		console.log('Threshold', this.threshold);
	}

	run() {
		let linearFrom = FolderTree.linearize(this.pathFrom.tree);
		let linearTo = FolderTree.linearize(this.pathTo.tree);
		//console.log(linearTo);

		let ProgressBar = require('progress');
		let bar = new ProgressBar(':percent [:bar] :elapsed/:eta', {
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

	compareOneToMany(linearTo: Array<Folder>, bar, folder: Folder, i: number) {
		// console.log(i, folder.toString());
		let similarityHistory = [];
		linearTo.forEach((candidate: Folder) => {
			let similarity = folder.compare(candidate);
			if (similarity > this.threshold) {
				console.log();	// <br /> after progress bar
				console.log(similarity.toFixed(3)+'%', '\t', folder.toString(), '\t', candidate.toString());
				console.log();
			}
			similarityHistory.push(similarity);
			bar.tick();
		});
		//let sum = similarityHistory.reduce(function(a, b) { return a + b; });
		//let avg = sum / similarityHistory.length;
		let max = similarityHistory.reduce(function(a, b) { return Math.max(a, b); });
		// console.log('compared', similarityHistory.length, 'times', 'max', max.toFixed(3)+'%');
	}

}
