const course = require('../models/Course');
const {multipleMongooseToObject} = require('../../util/mongoose');

class SiteController {
    //get /Site/
    index(req, res, next) {
        course.find({})
            .then(courses=>{
                res.render('home', {
                    courses: multipleMongooseToObject(courses)
                });
            })
            .catch(error=>next(error));
        // res.render('home');
    }
    //get /Site/:slug
    search(req, res) {
        res.render('search');
    }
  }
  
  module.exports = new SiteController();
  