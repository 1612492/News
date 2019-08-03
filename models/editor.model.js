var db = require('../utils/db');

module.exports = {   
    all: id =>{
        return db.load(`select * from post join category on post.idCat = category.catId where idCat = ${id} and postStatus = 'pending' order by dateUpload desc`);
    },
 
    allNoParent: id =>{
        return db.load(`select * from post join category on post.idCat = category.catId where (parent = ${id} or catId = ${id}) and postStatus = 'pending' order by  dateUpload desc`);
    },

    checkParent: id =>{
        return db.load(`select * from category where catId = ${id} and parent = 0`);
    },

    getPost: id => {
        return db.load(`select * from post, category, account where post.idCat = catId and idWriter = userId and postId = ${id}`);
    },

    getAllPostTags: id => {
        return db.load(`select * from tag, tag_post where tag.tagId = tag_post.tagId  and postId = ${id}`);
    },

    getPendedPost: id => {
        return db.load(`select * from post join category on post.idCat = category.catId where idEditor = ${id} and (datePost > now() or postStatus = 'rejected') order by dateUpload desc`)
    },

    update: (tableName, idField, entity) => {
        return db.update(tableName, idField, entity);
    }
}