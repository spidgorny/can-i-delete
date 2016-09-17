const assign = require('object.assign').getPolyfill();
const _ = require('underscore');

export default class FileInFolder {
	path: string;
	name: string;
	size: number;
	extension: string;

	constructor(set: Object) {
		assign(this, set);
	}

	isIn(files: Array<FileInFolder>) {
		// empty folder is not comparable with other empty folder
		if (!files.length) return false;
		return files.some((file) => {
			if (_.isMatch(file, {
					name: this.name,
					size: this.size,
				})) {
				return true;
			}
		});
	}

}
