const Course = require('../models/Course');
const {multipleMongooseToObject} = require('../../util/mongoose');

class MeController {
    //get /me/:slug
    storedCourses(req, res, next) {
        Promise.all([
            Course.find({}).sortable(req), 
            Course.countDocumentsDeleted()])
            .then(([courses, deletedCount])=>
                res.render('me/stored-courses', {
                    courses: multipleMongooseToObject(courses),
                    deletedCount,
                })
            )
            .catch(next)
            
    }
    //get me/trash/courses
    trashCourses(req, res, next) {
        Course.findDeleted({})
            .then(courses=>res.render('me/trash-courses', {
                courses: multipleMongooseToObject(courses)
            }))
            .catch(next)
    }

  }
  
  module.exports = new MeController();
  