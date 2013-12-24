// dependencies
var fs = require('fs');
var request=require("request");
var cheerio=require("cheerio");
var writeStream = fs.createWriteStream("file.csv");

// write headers to csv
writeStream.write('Title,' + 'URL,' + 'Username,' + 'Comments' + '\n');

var hnQueries = []
hnPosts = []
// perfrom request
request('https://angel.co/featured', function (error, response, html) {
  if (!error && response.statusCode == 200) {
    // console.log(html)
    // pass DOM to cheerio
    var $ = cheerio.load(html);
    $('.name').each(function(i,element){
      var query = ('https://www.hnsearch.com/search#request/submissions&q=' + $(this).text() + '&sortby=create_ts+desc&start=0').replace(/\n/g,'')
      console.log(query)
      hnQueries.push(query)
    })

for (var i = 0; i < hnQueries.length; i++){
  var newQuery = hnQueries[i]
  console.log('newquery: ',newQuery)
  request(newQuery, function (error, response, html){
    if (!error && response.statusCode == 200){
      var $ = cheerio.load(html)
      console.log(html)
      console.log('story title: ', $('a.content-story-title'))
    }
  })
}


      // write data to csv
      // writeStream.write(title + ',' + url + ',' + username + ',' + comments + '\n');
      
      // data store in an object (for dumping to mongo)
      // var scrapedData = {
      //   title: title,
      //   url: url
      // };
      //console.log(scrapedData);
    
    console.log("\nDONE!\n")
  }
});
