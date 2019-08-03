var express = require('express');
var postModel = require('../models/post.model');
var accountModel = require('../models/account.model');

var router = express.Router();

router.get('/:id', (req, res, next) => {

    var id = req.params.id;

    Promise.all([
        postModel.checkPremium(id),
        postModel.single(id),
        postModel.getTopPosts(),
        postModel.getTags(id),
        postModel.getComments(id),
    ]).then(([rows, ps, topPosts, tags, comments]) => {

        if (rows.length > 0) {
            if (req.user && req.user.role == 'subscriber') {
                accountModel.checkValidDateSubscribe(req.user.userId).then(acc => {
                    if (acc.length > 0) {
                        postModel.increaseView({ postId: ps[0].postId, viewCount: ps[0].viewCount + 1 });
                        postModel.getRelatedPost(ps[0].catId, id).then(relatedPosts => {
                            res.render('post', { post: ps[0], topPosts, title: ps[0].catName, cat: ps[0].parent, tags, comments, relatedPosts });
                        });
                    }
                    else {
                        res.render('404', { layout: false, msg: 'Tài khoản premium hết hạn' });
                    }
                });
            }
            else {
                res.render('404', { layout: false, msg: 'Chỉ tài khoản premium mới xem được bài viết này' });
            }
        }
        else {
            postModel.increaseView({ postId: ps[0].postId, viewCount: ps[0].viewCount + 1 });
            postModel.getRelatedPost(ps[0].catId, id).then(relatedPosts => {
                res.render('post', { post: ps[0], topPosts, title: ps[0].catName, cat: ps[0].parent, tags, comments, relatedPosts });
            });
        }
    }).catch(next);

});

router.post('/:id', (req, res, next) => {
    var id = req.params.id;
    if (req.user) {

        var entity = {
            idUser: req.user.userId,
            idPost: id,
            dateComment: new Date(),
            content: req.body.content
        }

        postModel.addComment(entity);

        res.redirect(req.headers.referer);
    }
    else {
        res.redirect('/account/login');
    }
})

module.exports = router;