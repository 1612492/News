var express = require('express');
var searchModel = require('../models/search.model');
var catModel = require('../models/category.model');

var router = express.Router();

router.post('/',(req,res,next)=> {
    var keyword = req.body.search;
    Promise.all([searchModel.FTS(keyword),catModel.getTopPosts()])
    .then(([posts,topPosts]) => {
            Promise.all(posts.map((post) => {
                return catModel.getTags(post.postId).then(tags => {
                    var arr = []; 
                    arr.push(post);
                    tags.forEach(tag =>{
                        arr.push(tag);
                    })
                    return arr;
                })
            })).then(arrs => {         
                res.render('list',{rows:arrs, topPosts, idActive:-1, title:"Search: "+keyword});
            });
       }).catch(next);
    });

module.exports = router;