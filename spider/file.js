/**
 * Created by mac136 on 15/9/17.
 */
var fs = require('fs');
var date = require('../Util/Date+Util');
var path = require('path');

var pathPrefix = '../Product/';


function createKglFile(){
  var path = getFilePath();
  fs.closeSync(fs.openSync(path, 'w'));
  return path;
}

function getFilePath(){
  var now = new Date().Format("yyyyMMddhhmmss");
  var filePath = pathPrefix + 'playlist_' + now + '.kgl';
  return filePath;
}

exports.createKglFile = createKglFile;