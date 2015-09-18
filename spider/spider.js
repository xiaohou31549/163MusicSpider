/**
 * Created by mac136 on 15/9/14.
 */
var request = require('request');
var config = require('../Util/config');
var stringUtil = require('../Util/string+Util');
var cheerio = require('cheerio');
var xmlWriter = require('./xmlWriter');
var moment = require('moment');
var songCount = 0;
var startDate;



function fetchSongComment(songId){
  if (songCount == config.config.songMaxCount) {
    completeSpider(songId);
    return
  }
  var playUrl = config.config.baseUrl + songId;
  var commentUrl = config.config.commentUrl + songId;
  var headers = {'content-type' : 'application/x-www-form-urlencoded',
                 'Referer': playUrl
    };
  request.post({
     headers: headers,
     url: commentUrl,
     body: 'params=NACsKFZXeiNBrdYMSQw3rynIi%2B3uhpEBXpVG42SVgAud0BypgSDspU1tugWtZl4Xgk6vKf5vk%2BAaVx8Y6N8TYE1zDozx%2BfBN32TMSW7eSnTWuTBgpQM7Io2dAc09ZuAAIk02UU6Nu92Sf9R5McbYIIHX%2BE65PUX7V4rFpKw2NZXLEaC5j2JsnlFqX5k8tV5K&encSecKey=13350d07486890396b10619188a4d8643bd6c9133619a45ffecf99653656998d32255031f99b335caeff1eea5f7cce553f39f04325ed435cec79b6f09f4f5587c2247b3003380e8f365bbbcf0037664fbef63a58e6cc341e54e071fd2b95cd4ef8bc48219e6530d390e81dc57d434a4c1eee609e9e93bf3e1eac6d257a9706e1'
  },function(error, response, body){
    if (!error && response.statusCode == 200) {
      var commentsCount = JSON.parse(body).total;
      if (commentsCount > config.config.minComments) {
        fetchSongDetail(songId)
      }
    }
    console.log('songId:' + songId + '~~~~~~~~comment:' + commentsCount + '---评论过千歌曲为:' + songCount);
    fetchSongComment(songId + 1);
  })
}

function completeSpider(songId){
  var endDate = moment();
  var spiderTime = endDate.diff(startDate, 'minute') + '分钟';
  xmlWriter.xmlWriter.finishPlayList();
  console.log('第四波爬虫任务结束...');
  console.log('开始歌曲Id:' + config.config.startSongId + '---结束歌曲Id:' + songId);
  var sum = songId - config.config.startSongId;
  console.log("总共爬取" + sum + '首歌曲, 评论过千歌曲有' + config.config.songMaxCount + '首');
  console.log('爬虫运行时间为:' + spiderTime);
}

function fetchSongDetail(songId){
  if (songCount == config.config.songMaxCount) {
    return
  }
  var url = config.config.baseUrl + songId;
  console.log('songUrl:' + url);
  var options = {
    headers:{
      'Host': 'music.163.com',
      'Referer': url,
      'Cookie': 'usertrack=c+5+hVSTmEUQO0d2GBc4Ag==; _ntes_nnid=1b7a0f72a6a42c89bdd8336a203a443b,1418958918407; _ntes_nuid=1b7a0f72a6a42c89bdd8336a203a443b; __utma=94650624.1685971822.1429165224.1429165224.1442223517.2; __utmz=94650624.1442223517.2.2.utmcsr=baidu|utmccn=(organic)|utmcmd=organic|utmctr=%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90; JSESSIONID-WYYY=391840e182e09f328cbba7d08f3226ab837ac19188c44ed0d7f77a74ae86941c86b72fcb8c78a01c89eec874d3b72d75acb75745176b4ba50d078f75b03e0ecbfdb739011341e9ec471a4b61f3ef70ea1bb4f6e4bae441fa97e16022d8b70806f6fc778c37a86a286c8823d587bcf01f32bc0bd44f44d1586cb5ec6270e659ac5b8933e1%3A1442225316335; _iuqxldmzr_=25; __utmb=94650624.8.10.1442223517; __utmc=94650624; visited=true'
    },
    url: url
  };
  request(options, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(body);
        var songInfo = $('title').text().split('-');
        console.log(songInfo[1] + '---' + songInfo[0]);
        if (songInfo[0] && songInfo[1]){
          xmlWriter.xmlWriter.addItem(songInfo[1].trimAlias(), songInfo[0].trimAlias());
          songCount += 1;
          console.log('爬到评论过千数据:' + songCount);
        }
      }
    }
  );
}

function main(){
  xmlWriter.xmlWriter.startPlayList();
  startDate = moment();
  fetchSongComment(config.config.startSongId)

}

main();