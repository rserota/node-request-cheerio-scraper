var phantom=require('node-phantom');
var data = {}
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
                        var links = [],
                        pArr = [];
                        $('.name').each(function() {
                            var name = $(this).text()
                            console.log('name: ',name)
                            links.push(('https://www.hnsearch.com/search#request/submissions&q=' + $(this).text() + '&sortby=create_ts+desc&start=0').replace(/\n/g,''));
                        });
                        $('p').each(function() {
                            pArr.push($(this).html());
                        });

                        return {
                            links: links,
                            p: pArr
                        };
                    }, function(err,result) {
                        console.log('result: ',result);
                        data.links = result.links
                        gotLinks(data)
                        // ph.exit();
                    });
                }, 3000);
            });
        });
    });
});

var gotLinks = function(data){
    phantom.create(function(err,ph) {
        return ph.createPage(function(err,page) {
          console.log(data.links[1])
            return page.open(data.links[1], function(err,status) {
                console.log("opened site? ", status);
                page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', function(err) {
              //jQuery Loaded.
              //Wait for a bit for AJAX content to load on the page. Here, we are waiting 5 seconds.
                    setTimeout(function() {
                        return page.evaluate(function() {
                        //Get what you want from the page using jQuery. A good way is to populate an object with all the jQuery commands that you need and then return the object.
                            var titles = []
                            $('a.content-story-title').each(function() {
                                titles.push($(this).text());
                            });
              
                            return {
                                titles: titles
                            };
                        }, function(err,result) {
                            console.log('result: ',result);
                            // ph.exit();
                        });
                    }, 3000);
                });
            });
        });
    });
}