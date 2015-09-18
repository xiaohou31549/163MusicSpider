/**
 * Created by mac136 on 15/9/14.
 */
var XmlWriter = require('xml-writer');
var fs = require('fs');
var kglFile = require('./file');
var config = require('../Util/config');

var xmlFile;
var writer = new XmlWriter(false, function(string, encoding){
    xmlFile.write(string, encoding)
});

function startPlayList(){
  var path = kglFile.createKglFile();
  xmlFile = fs.createWriteStream(path);
  writer.startDocument();
  writer.startElement('List').writeAttribute('ListName', config.config.playlistName);
}

function addItem(author, name){
  var song = author + ' - ' + name + '.mp3';
  writer.startElement('File').writeElement('MediaFileType', 0).writeElement('FileName', song).writeElement('MandatoryBitrate', 0);
  writer.endElement()
}

function finishPlayList(){
  writer.endElement();
  console.log("dfdjsfjdslfjadlsf");
  writer.endDocument();
}

exports.xmlWriter = {
  startPlayList: startPlayList,
  addItem: addItem,
  finishPlayList: finishPlayList
};

