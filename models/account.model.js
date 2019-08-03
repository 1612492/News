var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load(`select * from account`);
    },

    single: (id) => {
        return db.load(`select * from account where userId = ${id}`);
    },

    singleByEmail: email => {
        return db.load(`select * from account where email = '${email}'`);
    },

    add: entity => {
        return db.add('account', entity);
    },

    update: entity => {
        return db.update('account','userId', entity);
    },
   
    checkValidDateSubscribe: id => {
        return db.load(`SELECT * FROM account WHERE userId = ${id} and DATEDIFF(NOW(), dateSubscribe) <= 7`)
    }

};