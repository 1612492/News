var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load(`select * from category`);
    },

    single: id =>{
        return db.load(`select * from post join category on post.idCat = category.catId where idCat = ${id} and datePost <= now() order by field(type,'premium') desc, datePost desc`);
    },
 
    singleParent: id =>{
        return db.load(`select * from post join category on post.idCat = category.catId where (parent = ${id} or catId = ${id}) and datePost <= now() order by field(type,'premium') desc, datePost desc`);
    },

    getParent: id =>{
        return db.load(`select parent from category where catId = ${id}`);
    },

    getTopPosts: () =>{
        // return db.load(`select * from (select idCat,catName,title,datePost,postId,srcImage, max(viewCount) as countView from post inner join category on idCat = catId GROUP BY catId)maxView
        // ,(select postId, post.idCat, all_view from post inner join (select idCat, SUM(viewCount) as all_view from post INNER JOIN category on idCat=catId GROUP BY idCat ORDER BY all_view DESC LIMIT 10)topCat
        // on post.idCat = topCat.idCat) as allView
        // WHERE maxView.postId = allView.postId ORDER BY countView Desc`);
        return db.load(`select * from post join category on post.idCat = category.catId 
        where datePost between date_sub(now(),interval 90 day) and now()
        order by viewCount desc limit 10`);
    },

    getTags: id =>{
        return db.load(`SELECT t.tagId, tagName FROM  tag_post tp, tag t WHERE tp.tagId = t.tagId and tp.postId = ${id} `);
    }
};