var express = require('express');
var catModel = require('../models/category.model');

var router = express.Router();

router.get('/:id', (req, res, next) => { 
    var id = req.params.id;

    Promise.all([catModel.all(),catModel.getTopPosts()])
    .then(([allCat, topPosts]) =>{

        var isParent = false;

        allCat.forEach(cat => {
            if(cat.catId == id){
                if(cat.parent == 0){
                    isParent = true;
                }
            }           
        });

        if(isParent){
            catModel.singleParent(id).then(posts =>{
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
                    var catId = Number(id);
                    res.render('list', {rows:arrs, topPosts, idActive:catId, title:allCat[catId-1].catName});
                });
            })
        }
        else{
            Promise.all([
                catModel.single(id),
                catModel.getParent(id),
            ]).then(([posts, pa]) =>{
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
                var catId = Number(id);
                    res.render('list', {rows: arrs, topPosts, idActive:pa[0].parent, title:allCat[catId-1].catName});
                });
            }).catch(next);
        }
    });
});

module.exports = router;