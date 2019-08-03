var db = require('../utils/db');

module.exports = {
    all: name => {
        return db.load(`select * from ${name}`);
    },

    allCat: () => {
        return db.load(`select * from category order by parent`);
    },

    getAcceptedPost: () =>{
        return db.load(`select * from post join category on post.idCat = category.catId where postStatus = 'accepted' and datePost > now() order by datePost desc`);
    },

    getPublishedPost: () =>{
        return db.load(`select * from post join category on post.idCat = category.catId where postStatus = 'accepted' and datePost <= now() order by datePost desc`);
    },

    allWithStatus: status => {
        return db.load(`select * from post join category on post.idCat = category.catId where postStatus = '${status}' order by datePost desc`);
    },

    getPostToEdit: (status1, status2) => {
        return db.load(`select * from post join category on post.idCat = category.catId where postStatus = '${status1}' or postStatus = '${status2}'`);
    },

    add: (table,entity) => {
        return db.add(table, entity);
    },

    update: (table ,idField, entity) => {
        return db.update(table,idField,entity);
    },

    delete: (table ,idField, id) => {
        return db.delete(table,idField,id);
    },

    getAllUser: () =>{
        return db.load(`select * from account left join category on idCat = catId`);
    },
}