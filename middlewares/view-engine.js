var exphbs = require('express-handlebars');
var moment = require('moment');
var hbs_section = require('express-handlebars-sections');

module.exports = function (app) {
    app.engine('hbs', exphbs({
        layoutsDir: 'views/_layouts',
        defaultLayout: 'main.hbs',
        helpers: {
          formatDate: time =>{
            return moment(time).format('DD/MM/YYYY');
          },
          formatISODate: time =>{
            return moment(time).format('YYYY-MM-DD');
          },
          section: hbs_section(),
          ifEquals: (val1, val2, options) => {
            if(val1 == val2){
              return options.fn(this);
            }
            else{
              return options.inverse(this);
            }
          },
        }
      }));
      app.set('view engine', 'hbs');
}