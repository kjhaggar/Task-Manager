const List = require("../../database/models/list");
const Task = require("../../database/models/task");
const User = require("../../database/models/user");

exports.getAllTask = (req, res) => {
  Task.find({ _listId: req.params.listId })
    .then((tasks) => res.send(tasks))
    .catch((err) => console.log(err));
};

exports.postTask = (req, res) => {
  new Task({
    title: req.body.title,
    _listId: req.params.listId,
  })
    .save()
    .then((task) => res.send(task))
    .catch((err) => {
      res.send(err);
      console.log(err);
    });
};

exports.getTask = (req, res) => {
  Task.findOne({ _listId: req.params.listId, _id: req.params.taskId })
    .then((task) => res.send(task))
    .catch((err) => console.log(err));
};

exports.updateTask = (req, res) => {
  const obj = {};
  if (req.body.title) {
    obj.title = req.body.title;
  }
  if (req.body.status) {
    obj.status = req.body.status;
  }
  Task.findOneAndUpdate(
    { _listId: req.params.listId, _id: req.params.taskId },
    {
      $set: obj,
    }
  )
    .then((task) => res.send(task))
    .catch((err) => console.log(err));
};

exports.addUserToTask = (req, res) => {
  Task.findOneAndUpdate(
    { _listId: req.body.listId, _id: req.body.taskId },
    {
      $push: {
        assignedTo: {
          name: req.body.name,
          _userId: req.body._userId,
          email: req.body.email,
        },
      },
    }
  )
    .then((task) => {
      List.findById(req.body.listId)
        .then((list) => {
          User.findByIdAndUpdate(req.body._userId, {
            $push: {
              projectIds: {
                pid: req.body.listId,
                title: list.title,
              },
            },
          })
            .then(() => {})
            .catch((error) => console.log(error));
        })
        .catch((e) => console.log(e));

      res.send(task);
    })
    .catch((err) => console.log(err));
};

exports.removeUserFromTask = (req, res) => {
  Task.findOneAndUpdate(
    { _listId: req.body.listId, _id: req.body.taskId },
    {
      $pull: {
        assignedTo: {
          _userId: req.body._userId,
        },
      },
    }
  )
    .then((task) => {
      User.findByIdAndUpdate(req.body._userId, {
        $pull: {
          projectIds: {
            pid: req.body.listId,
          },
        },
      })
        .then(() => {})
        .catch((error) => console.log(error));
      res.send(task);
    })
    .catch((err) => console.log(err));
};

exports.deleteTask = (req, res) => {
  Task.findByIdAndDelete({ _listId: req.params.listId, _id: req.params.taskId })
    .then((task) => res.send(task))
    .catch((err) => console.log(err));
};
