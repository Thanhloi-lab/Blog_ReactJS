const Course = require('../models/Course');
const {mongooseToObject} = require('../../util/mongoose');

class CourseController {
    //get /Course/:slug
    show(req, res, next) {
        Course.findOne({ slug: req.params.slug })
            .then(course=>
                // res.render('courses/show', {course:mongooseToObject(course)})
                res.json({
                            errCode:0,
                            data:mongooseToObject(course),
                            count:1
                        })
            )
            .catch(next);
    }
    //get courses/create
    create(req, res, next) {
        res.render('courses/create')
    }
    //post courses/store
    store(req, res, next) {
        req.body.image = `https://img.youtube.com/vi/${req.body.videoId}/sddefault.jpg`;
        const course = new Course(req.body);
        course.save()
            .then(()=>res.redirect('/me/stored/courses'))
            .catch(next)
    }
    //get /courses/:id/edit
    edit(req, res, next) {
        Course.findById(req.params.id)
            .then(course => res.render('courses/edit',{
                course : mongooseToObject(course)
            }))
            .catch(next)
        
    }

    //put /courses/:id
    update(req, res, next) {
        Course.updateOne({_id: req.params.id}, req.body)
            .then(()=>res.redirect('/me/stored/courses'))
            .catch(next)
    }

    //delete /courses/:id
    delete(req, res, next) {
        Course.delete({_id: req.params.id})
            .then(()=>res.redirect('back'))
            .catch(next)
    }

    //patch /courses/:id/restore
    restore(req, res, next) {
        Course.restore({_id: req.params.id})
            .then(()=>res.redirect('back'))
            .catch(next)
    }

    //delete /courses/:id/force
    forceDelete(req, res, next) {
        Course.deleteOne({_id: req.params.id})
            .then(()=>res.redirect('back'))
            .catch(next)
    }

    //post /courses/handle-form-action
    handleFormAction(req, res, next) {
        switch(req.body.action){
            case 'Delete':
                Course.delete({_id: {$in: req.body.courseIds}})
                    .then(()=>res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.json({message: req.body.courseIds});
        }
    }
  }
  
  module.exports = new CourseController();
  