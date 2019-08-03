var categoryModel = require('../models/category.model');

module.exports = (req, res, next) => {
    categoryModel.all().then(rows => {
        var group = [];
        rows.forEach(element => {
            if(element.parent == 0){
                var subGroup = [];
                subGroup.push(element);
                rows.forEach(subRow => {
                    if(subRow.parent == element.catId){
                        subGroup.push(subRow);
                    }
                });
                group.push(subGroup);
            }
        });
        res.locals.lcCategory = group;
        next();
    })
}