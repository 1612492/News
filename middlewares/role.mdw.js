module.exports.isUser = (req, res, next) =>  {
    if(req.user){       
        res.locals.idUser = req.user.userId;
        res.locals.name = req.user.userName;
        res.locals.role = req.user.role;
        res.locals.email = req.user.email;
        res.locals.nickname = req.user.nickname;
        res.locals.birthday = req.user.birthday;
        next();
    }
    else
        next();
}

module.exports.isAdmin = (req, res, next) =>  {
    if(req.user && req.user.role == 'admin'){       
        res.locals.idUser = req.user.userId;
        res.locals.name = req.user.userName;
        res.locals.role = req.user.role;
        res.locals.email = req.user.email;
        res.locals.nickname = req.user.nickname;
        res.locals.birthday = req.user.birthday;
        next();
    }
    else
        res.render('404', {layout:false, msg: 'Permission denied'});
}

module.exports.isWriter = (req, res, next) =>  {
    if(req.user && req.user.role == 'writer'){       
        res.locals.idUser = req.user.userId;
        res.locals.name = req.user.userName;
        res.locals.role = req.user.role;
        res.locals.email = req.user.email;
        res.locals.nickname = req.user.nickname;
        res.locals.birthday = req.user.birthday;
        next();
    }
    else
        res.render('404',{layout:false, msg: 'Permission denied'});
}

module.exports.isEditor = (req, res, next) =>  {
    if(req.user && req.user.role == 'editor'){       
        res.locals.idUser = req.user.userId;
        res.locals.name = req.user.userName;
        res.locals.role = req.user.role;
        res.locals.email = req.user.email;
        res.locals.nickname = req.user.nickname;
        res.locals.birthday = req.user.birthday;
        res.locals.idCat = req.user.idCat;
        next();
    }
    else
        res.render('404',{layout:false, msg: 'Permission denied'});
}