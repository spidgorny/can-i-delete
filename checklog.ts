const fs = require('fs');
const _ = require('underscore');
const s = require('underscore.string');
_.mixin(s.exports());
const getSize = require('get-folder-size');
const prettierBytes = require('prettier-bytes');

class Pair {

	similarity: number;
	from: string;
	to: string;

	constructor(attributes) {
		_.extend(this, attributes);
	}

	getFromPath() {
		return _.strLeft(this.from, ' [');
	}

	getToPath() {
		return _.strLeft(this.to, ' [');
	}

	checkSize() {
		getSize(this.getFromPath(), (err, size) => {
			if (size > 0) {
				getSize(this.getToPath(), (err, size2) => {
					if (size2 > 0) {
						console.log(this.similarity, prettierBytes(size), this.from);
						console.log(this.similarity, prettierBytes(size2), this.to);
						console.log();
					}
				});
			}
		});
	}

}

class CheckLog {

	logFile: string = 'p-vs-dp.txt';

	constructor() {
		console.log('Reading', this.logFile);
		let log = fs.readFileSync(this.logFile);
		console.log('Parsing');
		let lines = _.lines(log);

		let pairs: Pair[] = [];
		let pair: Pair;
		let nextOne = false;
		let nextTwo = false;
		lines.forEach((line) => {
			line = line.slice(27);
			if (_.contains(line, '%')) {
				pair = new Pair({
					similarity: parseFloat(line.replace('%', '')),
					from: null,
					to: null,
				});
				nextOne = true;
			} else if (nextOne) {
				pair.from = line;
				nextOne = false;
				nextTwo = true;
			} else if (nextTwo) {
				pair.to = line;
				nextTwo = false;
				pairs.push(pair);
			}
		});
		//console.log(pairs);

		console.log('Sorting');
		pairs = _.sortBy(pairs, 'similarity').reverse();
		//console.log(pairs);

		console.log('Checking size');
		pairs.forEach((pair: Pair) => {
			pair.checkSize();
		});
	}

}

new CheckLog();
