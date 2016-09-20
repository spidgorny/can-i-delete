var fs = require('fs');
var _ = require('underscore');
var s = require('underscore.string');
_.mixin(s.exports());
var getSize = require('get-folder-size');
var prettierBytes = require('prettier-bytes');
var Pair = (function () {
    function Pair(attributes) {
        _.extend(this, attributes);
    }
    Pair.prototype.getFromPath = function () {
        return _.strLeft(this.from, ' [');
    };
    Pair.prototype.getToPath = function () {
        return _.strLeft(this.to, ' [');
    };
    Pair.prototype.checkSize = function () {
        var _this = this;
        getSize(this.getFromPath(), function (err, size) {
            if (size > 0) {
                getSize(_this.getToPath(), function (err, size2) {
                    if (size2 > 0) {
                        console.log(_this.similarity, prettierBytes(size), _this.from);
                        console.log(_this.similarity, prettierBytes(size2), _this.to);
                        console.log();
                    }
                });
            }
        });
    };
    return Pair;
}());
var CheckLog = (function () {
    function CheckLog() {
        this.logFile = 'p-vs-dp.txt';
        console.log('Reading', this.logFile);
        var log = fs.readFileSync(this.logFile);
        console.log('Parsing');
        var lines = _.lines(log);
        var pairs = [];
        var pair;
        var nextOne = false;
        var nextTwo = false;
        lines.forEach(function (line) {
            line = line.slice(27);
            if (_.contains(line, '%')) {
                pair = new Pair({
                    similarity: parseFloat(line.replace('%', '')),
                    from: null,
                    to: null
                });
                nextOne = true;
            }
            else if (nextOne) {
                pair.from = line;
                nextOne = false;
                nextTwo = true;
            }
            else if (nextTwo) {
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
        pairs.forEach(function (pair) {
            pair.checkSize();
        });
    }
    return CheckLog;
}());
new CheckLog();
