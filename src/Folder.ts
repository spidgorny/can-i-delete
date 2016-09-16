import FileInFolder from "./FileInFolder";
const assign = require('object.assign').getPolyfill();

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
		return this.path + ' [' + this.size + ']';
	}

}
