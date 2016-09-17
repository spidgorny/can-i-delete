## What is it?

This script can help you identify duplicate folders (!, not files). It was made to check whether specific folders with pictures were archived already. 

## How it works?

It works like this:

```javascript
let pathFrom = 'p:\\';
let pathTo = 'p:\\Digital Photo';

let dirFrom = new FolderTree(pathFrom);
dirFrom.scanPath();
let dirTo = new FolderTree(pathTo);
dirTo.scanPath();

let cid = new CanIDelete(dirFrom, dirTo);
cid.setThreshold(1);
cid.run();
```

* You give it two folders. One with files you want to check (left) and the other with the archive.
* It will scan the folders and cache the folder structure to JSON files to avoid scanning folders again.
* It will try to match every folder from the source (left) with every folder from the archive (right). 
* If the amount of files, their file names and file sizes in two folders are similar up to specific threshold (1% in the example above) - it will print both folders and their similarity score.
* After this it's up to you to compare these two folders manually and delete duplicates.

## How to use?

1. Make sure you have [node.js](nodejs.org) installed.
2. Download this script with:
```bash
git clone https://github.com/spidgorny/can-i-delete.git
```
3. Install dependencies:
```bash
npm install
```
4. Open ```index.ts``` and change paths to match your "dump-all-photos-here" and "nicely-organized-photo-archive" folders.
5. Compile with ```tsc index.ts```.
6. Run with ```node index.js```

## How does the results look like?

```text
[2016-09-17T17:02:03.526Z] 99.746%
[2016-09-17T17:02:03.526Z] p:\OnePlusOne\2016-05 [598.916 MB]
[2016-09-17T17:02:03.526Z] p:\Digital Photo\123. OnePlusOne11\2016-05 [598.918 MB]
```

That means that these two folders have almost identical files in them. Similarity 99.7%. It's likely that ```p:\OnePlusOne\2016-05``` is already archived.

Enjoy.
