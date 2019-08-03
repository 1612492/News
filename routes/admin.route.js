var express = require('express');
var adminModel = require('../models/admin.model');
var moment = require('moment');

var router = express.Router();

router.get('/accepted', (req, res ,next) => {
    adminModel.getAcceptedPost().then(rows => {
        res.render('vmDashboard/accepted',{layout: 'dashboard.hbs', rows});
    })
});

router.post('/accepted', (req, res ,next) => {
    var entity = {
        postId: req.body.postId, 
        datePost: moment(new Date()).format('YYYY-MM-DD'), 
    };
    adminModel.update('post','postId',entity).then(() => {
        res.redirect('/admin/accepted');
    });
});

router.get('/published', (req, res ,next) => {
    adminModel.getPublishedPost().then(rows => {
        res.render('vmDashboard/published',{layout: 'dashboard.hbs', rows});
    })
});

router.get('/rejected', (req, res ,next) => {
    adminModel.allWithStatus('rejected').then(rows => {
        res.render('vmDashboard/rejected',{layout: 'dashboard.hbs', rows});
    })
});

router.get('/pending', (req, res ,next) => {
    adminModel.allWithStatus('pending').then(rows => {
        res.render('vmDashboard/pending',{layout: 'dashboard.hbs', rows});
    })
});

router.get('/categories', (req, res ,next) => {
    adminModel.allCat().then(rows => {
        res.render('vmAdmin/manage_cat',{layout: 'dashboard.hbs', rows});
    })
});

router.post('/categories/add', (req, res ,next) => {
    var entity = {
        catName: req.body.catName,
        parent: req.body.catParent
    }
    adminModel.add('category', entity);
    res.redirect('/admin/categories');
});

router.post('/categories/edit', (req, res ,next) => {
    var entity = {
        catId: req.body.catId,
        catName: req.body.catName,
        parent: req.body.catParent
    }
    adminModel.update('category', 'catId', entity);
    res.redirect('/admin/categories');
});

router.post('/categories/delete', (req, res ,next) => {
    var id = req.body.catId;
    adminModel.delete('category', 'catId', id);
    res.redirect('/admin/categories');
});

router.get('/tags', (req, res ,next) => {
    adminModel.all('tag').then(rows => {
        res.render('vmAdmin/manage_tag',{layout: 'dashboard.hbs', rows});
    })
});

router.post('/tags/add', (req, res ,next) => {
    var entity = {
        tagName: req.body.tagName
    }
    adminModel.add('tag', entity);
    res.redirect('/admin/tags');
});

router.post('/tags/edit', (req, res ,next) => {
    var entity = {
        tagId: req.body.tagId,
        tagName: req.body.tagName
    }
    adminModel.update('tag', 'tagId', entity);
    res.redirect('/admin/tags');
});

router.post('/tags/delete', (req, res ,next) => {
    var id = req.body.tagId;
    adminModel.delete('tag', 'tagId', id);
    res.redirect('/admin/tags');
});

router.get('/accounts', (req, res ,next) => {
    Promise.all([
        adminModel.getAllUser(),
        adminModel.allCat(),
    ]).then(([rows,cats]) => {
        res.render('vmAdmin/manage_acc',{layout: 'dashboard.hbs', rows, cats});
    }).catch(next);
});

router.post('/accounts/add', (req, res ,next) => {
    var entity = {
        userName: req.body.userName,
        email: req.body.email,
        role: req.body.role,
        birthday: req.body.birthday
    }
    adminModel.add('account', entity).then(() =>{
        res.redirect('/admin/accounts');
    });
});

router.post('/accounts/edit', (req, res ,next) => {
    var entity = {
        userId: req.body.userId,
        idCat: req.body.category
    }
    adminModel.update('account','userId', entity).then(() =>{
        res.redirect('/admin/accounts');
    });
});

router.post('/accounts/auth', (req, res ,next) => {
    var entity = {
        userId: req.body.userId,
        dateSubscribe: moment(new Date()).format('YYYY-MM-DD')
    }
    adminModel.update('account','userId', entity).then(() =>{
        res.redirect('/admin/accounts');
    });
});

router.post('/accounts/delete', (req, res ,next) => {
    var id = req.body.userId;
    adminModel.delete('account', 'userId', id).then(() => {
        res.redirect('/admin/accounts');
    });
});

module.exports = router;