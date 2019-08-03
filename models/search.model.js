var db = require('../utils/db');

module.exports = {
    FTS: (keywork) => {
        return db.load(`select * from post join category on post.idCat = category.catId where (post.title like '%`+keywork+`%' or post.content like '%`+keywork+`%') and datePost <= now()`);
    }
}