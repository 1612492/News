var db = require('../utils/db');

module.exports = {
    addPost: entity => {
        return db.add('post',entity);
    },

    allAccepted: id => {
        return db.load(`select * from post join category on post.idCat = category.catId where postStatus = 'accepted' and idWriter = ${id} and datePost > now() order by dateUpload desc`);
    },

    allPublished: id => {
        return db.load(`select * from post join category on post.idCat = category.catId where postStatus = 'accepted' and idWriter = ${id} and datePost <= now() order by dateUpload desc`);
    },

    allWithStatus: (status, id) => {
        return db.load(`select * from post join category on post.idCat = category.catId where postStatus = '${status}' and idWriter = ${id} order by dateUpload desc`);
    },

    getAllTags: () => {
        return db.load(`select * from tag`);
    },
    
    getAllPostTags: id => {
        return db.load(`select * from tag, tag_post where tag.tagId = tag_post.tagId  and postId = ${id}`);
    },

    addTagIntoPost: entity => {
        return db.add('tag_post',entity);
    },

    getPost: id => {
        return db.load(`select * from post, category where post.idCat = catId and postId = ${id}`);
    },

    deleteTags: id => {
        return db.delete('tag_post','postId',id);
    },

    updatePost: entity => {
        return db.update('post','postId',entity);
    }
}