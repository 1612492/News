var express = require('express');
var homeModel = require('../models/home.model');

var router = express.Router();

router.get('/',(req, res, next) => { 
    Promise.all([
        homeModel.getFeaturePosts(),
        homeModel.getMostViewPosts(),
        homeModel.getLastestPosts(),
        homeModel.getTopPosts(),
      ]).then(([featurePosts, mostViewPosts, lastestPosts,topPosts]) => {
        res.render('home', {featurePosts, mostViewPosts, lastestPosts, topPosts, isActive: true, title: 'Trang chủ'});          
    }).catch(next);
    
});

module.exports = router;