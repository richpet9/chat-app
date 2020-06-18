/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming user requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    createUser: function (req, res) {
        // TODO: Add username to database, send OK code with username back to frontend
        User.create({ username: req.params.username })
            .fetch()
            .then((thing) => {
                res.status(200).send(thing);
            });
    },
    updateUser: function (req, res) {
        User.updateOne({ username: req.params.username })
            .set({
                username: req.body.username,
            })
            .fetch()
            .then((user) => {
                res.status(200).send(user);
            });
    },
    getUsername: function (req, res) {
        if (req.params.username) {
            User.findOne({ username: req.params.username }).then((user) => {
                res.send(user);
            });
        } else {
            User.find().then((users) => {
                res.send(users);
            });
        }
    },
};
