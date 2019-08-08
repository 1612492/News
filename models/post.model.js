var db = require('../utils/db');

module.exports = {
    increaseView: entity => {
        return db.update('post','postId', entity);
    },

    single: id => {
        return db.load(`select * from post,category,account where post.idCat = category.catId and post.idWriter = account.userId and postId = ${id}`);
    },

    checkPremium: id => {
        return db.load(`select * from post where postId = ${id} and type = 'premium'`);
    },

    getTopPosts: () =>{
        // return db.load(`select * from (select idCat,catName,title,datePost,postId,post.srcImage, max(viewCount) as countView from post inner join category on idCat = catId GROUP BY catId)maxView
        // ,(select postId, post.idCat, all_view from post inner join (select idCat, SUM(viewCount) as all_view from post INNER JOIN category on idCat=catId GROUP BY idCat ORDER BY all_view DESC LIMIT 10)topCat
        // on post.idCat = topCat.idCat) as allView
        // WHERE maxView.postId = allView.postId ORDER BY countView Desc`);
        return db.load(`select * from post join category on post.idCat = category.catId 
        where datePost between date_sub(now(),interval 90 day) and now()
        order by viewCount desc limit 10`);
    },

    getTags: id =>{
        return db.load(`SELECT t.tagId, tagName FROM  tag_post tp, tag t WHERE tp.tagId = t.tagId and tp.postId = ${id} `);
    },

    addComment: entity => {
        return db.add('comment', entity);
    },

    getComments: id => {
        return db.load(`SELECT * FROM comment, account WHERE idPost = ${id} and comment.idUser = account.userId ORDER BY dateComment DESC`);
    },
    
    getRelatedPost: (idCat, idPost) => {
        return db.load(`select * from post join category on post.idCat = category.catId where category.catId = ${idCat} and post.postId != ${idPost} and datePost <= now() order by datePost desc limit 5`);
    }
}