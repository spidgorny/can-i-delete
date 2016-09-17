import FileInFolder from "./FileInFolder";
const assign = require('object.assign').getPolyfill();

/**
 * http://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
 * @param bytes
 * @param decimals
 * @returns {any}
 */
function formatBytes(bytes: number, decimals?: number) {
	var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	if (bytes == 0) return '0 ' + sizes[0];
	var k = 1024; // or 1024 for binary
	var dm = decimals + 1 || 3;
	var i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export default class Folder {

	path: string;
	name: string;
	children: Array<Folder>;
	size: number;
	extension: string;
	files: Array<FileInFolder>;

	constructor(set: Object) {
		assign(this, set);
	}

	compare(candidate: Folder) {
		if (!this.files.length) return 0;
		if (!candidate.files.length) return 0;
		let same = 0;
		this.files.forEach((file) => {
			let fileIsIn = file.isIn(candidate.files);
			same += fileIsIn ? 1 : 0;
		});
		candidate.files.forEach((file) => {
			let fileIsIn = file.isIn(this.files);
			same += fileIsIn ? 1 : 0;
		});
		return same * 100 / (this.files.length + candidate.files.length);
	}

	toString() {
		return this.path + ' [' + formatBytes(this.size) + ']';
	}

}
