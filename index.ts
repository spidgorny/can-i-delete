/// <reference path="typings/index.d.ts" />

require('log-timestamp');
import CanIDelete from './src/CanIDelete';

function testProgress() {
	var ProgressBar = require('progress');

	var bar = new ProgressBar(':bar', {
		total: 100,
		width: 100,
	});
	var timer = setInterval(function () {
		bar.tick();
		if (bar.complete) {
			console.log('\ncomplete\n');
			clearInterval(timer);
		}
	}, 50);
}

// testProgress();

//let pathFrom = 'p:\\DCIM';
let pathFrom = 'd:\\Pictures';
let pathTo = 'p:\\Digital Photo';
let cid = new CanIDelete(pathFrom, pathTo);
cid.setThreshold(40);
cid.run();
