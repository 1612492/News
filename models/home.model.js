var db = require('../utils/db');

module.exports = {
    getMostViewPosts: () =>{
        return db.load(`select * from post join category on post.idCat = category.catId where datePost <= now() order by field(type, 'premium') desc, viewCount desc limit 10`);
    },

    getLastestPosts: () =>{
        return db.load(`select * from post join category on post.idCat = category.catId where datePost <= now() order by field(type, 'premium') desc, datePost desc limit 10`);
    },

    getFeaturePosts: () =>{
        return db.load(`select * from post join category on post.idCat = category.catId 
        where datePost between date_sub(now(),interval 7 day) and now()
        order by viewCount desc limit 3`);
    },

    getTopPosts: () =>{
        return db.load(`select * from (select idCat,catName,title,datePost,postId,srcImage, max(viewCount) as countView from post inner join category on idCat = catId GROUP BY catId)maxView
        ,(select postId, post.idCat, all_view from post inner join (select idCat, SUM(viewCount) as all_view from post INNER JOIN category on idCat=catId GROUP BY idCat ORDER BY all_view DESC LIMIT 10)topCat
        on post.idCat = topCat.idCat) as allView
        WHERE maxView.postId = allView.postId ORDER BY countView Desc`);
    }
}