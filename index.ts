/// <reference path="typings/index.d.ts" />

import FolderTree from "./src/FolderTree";
require('log-timestamp');
import CanIDelete from './src/CanIDelete';

function testProgress() {
	let ProgressBar = require('progress');

	let bar = new ProgressBar(':bar', {
		total: 100,
		width: 100,
	});
	let timer = setInterval(function () {
		bar.tick();
		if (bar.complete) {
			console.log('\ncomplete\n');
			clearInterval(timer);
		}
	}, 50);
}

// testProgress();

// let pathFrom = 'p:\\DCIM';
// let pathFrom = 'd:\\Pictures';
let pathFrom = 'p:\\';
let pathTo = 'p:\\Digital Photo';

let dirFrom = new FolderTree(pathFrom);
dirFrom.scanPath();
dirFrom.remove('Digital Photo');
let dirTo = new FolderTree(pathTo);
dirTo.scanPath();

let cid = new CanIDelete(dirFrom, dirTo);
cid.setThreshold(1);
cid.run();
