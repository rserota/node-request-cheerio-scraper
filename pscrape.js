var phantom=require('node-phantom');
var fs = require('fs');
var writeStream = fs.createWriteStream("file.csv");

phantom.create(function(err,ph) {
    return ph.createPage(function(err,page) {
        return page.open("https://angel.co/public", function(err,status) {
            console.log("opened site? ", status);
            page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', function(err) {
              //jQuery Loaded.
              //Wait for a bit for AJAX content to load on the page. Here, we are waiting 5 seconds.
                setTimeout(function() {
                    return page.evaluate(function() {
                        //Get what you want from the page using jQuery. A good way is to populate an object with all the jQuery commands that you need and then return the object.
                        var links = []
                        $('.name').each(function() {
                            var name = $(this).text().replace(/\n/g,'')
                            links.push({name : name, searchURL : ('https://www.hnsearch.com/search#request/submissions&q=' + $(this).text() + '&sortby=create_ts+desc&start=0').replace(/\n/g,'')});
                        });
                        return links

                    }, function(err,result) {
                        console.log('result: ',result);
                        var data = result
                        gotLinks(data, 0)
                        ph.exit();
                    });
                }, 3000);
            });
        });
    });
});

var gotLinks = function(data, i){
    phantom.create(function(err,ph) {
        return ph.createPage(function(err,page) {
          console.log(data[i])
            return page.open(data[i].searchURL, function(err,status) {
                console.log("opened site? ", status);
                page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', function(err) {
              //jQuery Loaded.
              //Wait for a bit for AJAX content to load on the page. Here, we are waiting 5 seconds.
                    setTimeout(function() {
                        return page.evaluate(function() {
                        //Get what you want from the page using jQuery. A good way is to populate an object with all the jQuery commands that you need and then return the object.
                            
                            var storyTitle = $('a.content-story-title').first().text()
                            var storyLink = $('a.content-story-title').first().attr("href")
                               
                            return [storyTitle, storyLink]
                        }, function(err,result) {
                            console.log('result: ',result);
                            if(result){
                                data[i].storyTitle = result[0]
                                data[i].storyLink = result[1]
                                console.log(data)
                            }
                            else {
                              data[i].storyTitle = ' '
                              data[i].storyLink = ' '
                            }

                            i++
                            if (i < data.length){
                              gotLinks(data, i)
                            }
                            else {
                              csvWrite(data, 0)
                            }
                            ph.exit();
                        });
                    }, 3000);
                });
            });
        });
    });
}

var csvWrite = function(data){
    writeStream.write('Startup~' + 'Latest Story~' + 'URL' + '\n');
    for(var i = 0; i < data.length; i++){
        writeStream.write(data[i].name + '~' + data[i].storyTitle + '~' + data[i].storyLink + '\n')
    }
}