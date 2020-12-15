const List = require("../../database/models/list");
const Task = require("../../database/models/task");

exports.getAllList = (req, res) => {
  List.find({})
    .then((lists) => res.send(lists))
    .catch((err) => console.log(err));
};

exports.postList = (req, res) => {
  new List({ title: req.body.title })
    .save()
    .then((list) => res.send(list))
    .catch((err) => {
      res.send(err);
      console.log(err);
    });
};

exports.getList = (req, res) => {
  List.find({ _id: req.params.listId })
    .then((list) => res.send(list))
    .catch((err) => console.log(err));
};

exports.updateList = (req, res) => {
  List.findOneAndUpdate({ _id: req.params.listId }, { $set: req.body })
    .then((list) => res.send(list))
    .catch((err) => console.log(err));
};

exports.deleteList = (req, res) => {
  const deleteTasks = (list) => {
    Task.deleteMany({ _listId: list._id })
      .then(() => list)
      .catch((err) => console.log(err));
  };
  const list = List.findByIdAndDelete(req.params.listId)
    .then((list) => deleteTasks(list))
    .catch((err) => console.log(err));
  res.status(200).send(list);
};
