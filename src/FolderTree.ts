

import Folder from "./Folder";
import FileInFolder from "./FileInFolder";

export default class FolderTree {

	path: string;

	tree: Folder;

	constructor(path: string) {
		this.path = path;
	}

	scanPath() {
		if (this.tree) return this.tree;

		const fs = require('fs');
		console.log('Reading files from ' + this.path);
		let cacheFile = this.path.replace(':', '').replace('\\', '-').replace(' ', '-').toLowerCase() + '.json';

		let tree;
		if (!fs.existsSync(cacheFile)) {
			let dirTree = require('directory-tree');
			tree = dirTree(this.path);
			console.log('Done');
			fs.writeFileSync(cacheFile, JSON.stringify(tree));
			console.log('Cached');
		} else {
			let json = fs.readFileSync(cacheFile);
			tree = JSON.parse(json);
		}
		console.log('tree', tree.children.length);

		this.tree = tree;
		return tree;
	}

	static linearize(tree: Folder) {
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

}
