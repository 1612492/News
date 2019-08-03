var express = require('express');
var editorModel = require('../models/editor.model');
var moment = require('moment');

var router = express.Router();

router.get('/pending', (req, res, next) => {
    if(req.user.idCat){
        editorModel.checkParent(req.user.idCat).then(ret =>{
            if(ret.length > 0){
                editorModel.allNoParent(req.user.idCat).then(rows => {
                    res.render('vmDashboard/pending',{rows, layout: 'dashboard.hbs'});
                });
            }
            else{
                editorModel.all(req.user.idCat).then(rows => {
                    res.render('vmDashboard/pending',{rows, layout: 'dashboard.hbs'});
                });
            }
        })
    }
    else{
        res.render('404',{layout:false, msg: 'You do not manage any category' });
    }
});

router.get('/pending/:id', (req, res, next) => {
    id = req.params.id;
    Promise.all([
        editorModel.getPost(id),
        editorModel.getAllPostTags(id)
    ]).then(([post,tags]) => {
        res.render('vmEditor/detail',{post, tags, layout: 'dashboard.hbs'})
    })
});

router.post('/pending/accept', (req, res, next) => {
    var entity = {
        postId: req.body.postId,
        datePost: req.body.datePost,
        postStatus: 'accepted',
        idEditor: req.user.userId,
        dateProcess: moment(new Date()).format('YYYY-MM-DD')
    }

    editorModel.update('post','postId',entity).then(() => {
        res.redirect('/editor/pending');
    });
});

router.post('/pending/reject', (req, res, next) => {
    var entity = {
        postId: req.body.postId,
        postStatus: 'rejected',
        idEditor: req.user.userId,
        dateProcess: moment(new Date()).format('YYYY-MM-DD'),
        reasonReject: req.body.reasonReject
    }

    editorModel.update('post','postId',entity).then(() => {
        res.redirect('/editor/pending');
    });
});

router.get('/pended', (req, res, next) => {
    if(req.user.idCat){
        editorModel.getPendedPost(req.user.userId).then(rows => {
            res.render('vmEditor/list',{rows, layout: 'dashboard.hbs'})
        })
    }
    else{
        res.render('404',{layout:false, msg: 'You do not manage any category' });
    }
});

module.exports = router;