var express = require('express');
var writerModel = require('../models/writer.model');
var moment = require('moment');

var router = express.Router();

router.get('/upload', (req, res, next) => {
    writerModel.getAllTags().then(tags => {
        res.render('vmWriter/upload', { tags, layout: 'dashboard.hbs'});
    })
});

router.post('/upload', (req, res, next) => {
    var entity = {
        title: req.body.title,
        subTitle: req.body.abstract,
        viewCount: 0,
        postStatus: 'pending',
        content: req.body.content,
        idCat: req.body.category,
        type: req.body.type,
        dateUpload: moment(new Date()).format('YYYY-MM-DD'),
        srcImage: req.body.image,
        idWriter: req.user.userId
    };
    var tags = req.body.tags;

    writerModel.addPost(entity).then(id => {
        if (tags) {
            Promise.all(tags.map((tag) => {
                return writerModel.addTagIntoPost({ tagId: tag, postId: id });
            })).then(() => {
                res.redirect('./upload');
            });
        }
        else {
            res.redirect('./upload');
        }
    });

});

router.get('/accepted', (req, res, next) => {
    writerModel.allAccepted(req.user.userId).then(rows => {
        res.render('vmDashboard/accepted', { layout: 'dashboard.hbs', rows});
    })
});

router.get('/published', (req, res, next) => {
    writerModel.allPublished(req.user.userId).then(rows => {
        res.render('vmDashboard/published', { layout: 'dashboard.hbs', rows});
    })
});

router.get('/rejected', (req, res, next) => {
    writerModel.allWithStatus('rejected', req.user.userId).then(rows => {
        res.render('vmDashboard/rejected', { layout: 'dashboard.hbs', rows});
    })
});

router.get('/pending', (req, res, next) => {
    writerModel.allWithStatus('pending', req.user.userId).then(rows => {
        res.render('vmDashboard/pending', { layout: 'dashboard.hbs', rows});
    })
});

router.get('/edit/:id', (req, res, next) => {
    var id = req.params.id;
    Promise.all([
        writerModel.getAllTags(),
        writerModel.getPost(id),
        writerModel.getAllPostTags(id),
    ]).then(([tags, post, tagPost]) => {
        res.render('vmWriter/edit', { tagPost, post, tags, layout: 'dashboard.hbs'});
    }).catch(next);
});

router.post('/edit/:id', (req, res, next) => {
    var idP = req.params.id;
    var entity = {
        postId: idP,
        title: req.body.title,
        subTitle: req.body.abstract,
        viewCount: 0,
        postStatus: 'pending',
        content: req.body.content,
        idCat: req.body.category,
        type: req.body.type,
        dateUpload: moment(new Date()).format('YYYY-MM-DD'),
        srcImage: req.body.image,
        reasonReject: null
    };
    var tags = req.body.tags;

    writerModel.deleteTags(idP).then(() => {
        writerModel.updatePost(entity).then(() => {
            if (tags) {
                Promise.all(tags.map((tag) => {
                    return writerModel.addTagIntoPost({ tagId: tag, postId: idP });
                })).then(() => {
                    res.redirect('/writer/edit/' + idP);
                });
            }
            else {
                res.redirect('/writer/edit/' + idP);
            }
        });
    })
});

module.exports = router;