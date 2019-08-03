var express = require('express');
var tagModel = require('../models/tag.model');

var router = express.Router();

router.get('/:id', (req, res, next) => { 

    var id = req.params.id;

    Promise.all([
        tagModel.single(id),
        tagModel.getTopPosts(),
    ])
    .then(([posts,topPosts])=>{
        Promise.all(posts.map((post) => {
            return tagModel.getTags(post.postId).then(tags => {
                var arr = []; 
                arr.push(post);
                tags.forEach(tag =>{
                    arr.push(tag);
                })                       
                return arr;
            })
          })).then(arrs => {
            res.render('list', {rows:arrs, topPosts, title: 'tags'});
        });
        
    }).catch(next);
    
});

module.exports = router;