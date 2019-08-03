var express = require('express');
var bcrypt = require('bcrypt');
var passport = require('passport');
var accountModel = require('../models/account.model');

var router = express.Router();

router.get('/is-available', (req, res, next) => {
  if (req.user && req.user.email == req.query.email) {
    return res.json(true);
  }
  var email = req.query.email;
  accountModel.singleByEmail(email).then(rows => {
    if (rows.length > 0) {
      return res.json(false);
    }
    return res.json(true);
  })
});

router.get('/register', (req, res, next) => {
  res.render('vwAccount/register', { layout: false });
});

router.post('/register', (req, res, next) => {
  var saltRounds = 10;
  var hash = bcrypt.hashSync(req.body.password, saltRounds);

  var entity = {
    userName: req.body.username,
    email: req.body.email,
    pass: hash,
    role: 'guest'
  }

  accountModel.add(entity).then(() => {
    res.redirect('/account/login');
  })
});

router.get('/login', (req, res, next) => {
  preUrl = req.headers.referer;
  res.render('vwAccount/login', { layout: false, preUrl });
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);

    if (!user) {
      return res.render('vwAccount/login', {
        layout: false,
        err_message: info.message
      })
    }

    req.logIn(user, err => {
      if (err)
        return next(err);

      if (user.role == 'writer') {
        return res.redirect('/writer/upload')
      }

      if (user.role == 'editor') {
        return res.redirect('/editor/pending')
      }

      if (user.role == 'admin') {
        return res.redirect('/admin/accepted')
      }
      
      preUrl = req.body.previousUrl;
      return res.redirect(preUrl);
    });
  })(req, res, next);
});

router.get('/logout', (req, res, next) => {
  req.logOut();
  res.redirect('/');
});

router.get('/info', (req, res, next) => {
  res.render('vwAccount/info', { layout: false });
});

router.post('/info', (req, res, next) => {
  var entity = {
    userId: req.user.userId,
    userName: req.body.username,
    email: req.body.email,
    birthday: req.body.dob,
    nickname: req.body.nickname,
  }

  accountModel.update(entity).then(() => {
    req.logOut();
    res.redirect('/');
  })
});


module.exports = router;