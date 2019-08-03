var express = require('express');
var morgan = require('morgan');

var app = express();

var role = require('./middlewares/role.mdw');

//app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

require('./middlewares/view-engine')(app);
require('./middlewares/session')(app);
require('./middlewares/passport')(app);


app.use(require('./middlewares/locals.mdw'));

app.use('/', role.isUser, require('./routes/home.route'));

app.use('/post', require('./routes/post.route'));

app.use('/tag', require('./routes/tag.route'));

app.use('/category', require('./routes/category.route'));

app.use('/account', require('./routes/account.route'));

app.use('/writer',role.isWriter, require('./routes/writer.route'));

app.use('/admin', role.isAdmin, require('./routes/admin.route'));

app.use('/editor', role.isEditor, require('./routes/editor.route'));

app.use('/search', require('./routes/search.route'));

app.use((req, res, next) => {
    res.render('404', { layout: false });
});

app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
})