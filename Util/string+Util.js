/**
 * Created by mac136 on 15/9/14.
 */
String.prototype.trim=function(){
  return this.replace(/(^\s*)|(\s*$)/g, "");
};

String.prototype.trimAlias=function(){
  var name = this.replace(/（.*?）/g, '');
  return name.trim()
};
