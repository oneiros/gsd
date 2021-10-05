const express = require('express');
const router = express.Router();
const Task = require("./task");

router.get('/', function(req, res, next) {
  let notification = req.session.notification;
  if (notification) delete req.session.notification;
  let error = req.session.error;
  if (error) delete req.session.error;

  Task.all( (tasks) => res.render('index', { tasks: tasks, notification: notification, error: error }));
});

router.post('/', function(req, res, next) {
  const task = new Task(req.body.task);

  if (req.xhr) {
    if (task.save) {
      res.render('task', {layout: false, task: task});
    } else {
      res.status(422).end();
    }
  } else {
    if (task.save()) {
      req.session.notification = "Task was added successfully!";
    } else {
      req.session.error = "Missing data. Task could not be added.";
    }
    res.redirect("/tasks");
  }
});

router.patch("/:id/done", function(req, res, next) {
  console.log("Looking for task#" + req.params.id);
  Task.find(req.params.id, (task) => {
    console.log(task)
    task.markDone();

    if (req.xhr) {
      res.status(200).end();
    } else {
      req.session.notification = "Task is now done! Congrats!"
      res.redirect("/tasks");
    }
  });
});

router.delete("/:id", function(req, res, next) {
  Task.find(req.params.id, (task) => {
    if (req.xhr) {
      if (task.done) {
        task.destroy();
        res.status(200).end();
      } else {
        res.status(422).end();
      }
    } else {
      if (task.done) {
        task.destroy();
        req.session.notification = "Task was deleted"
      } else {
        req.session.error = "Unfinished tasks cannot be deleted"
      }
      res.redirect("/tasks");
    }
  });
});

module.exports = router;
