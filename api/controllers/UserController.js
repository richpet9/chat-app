/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming user requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    createUser: function (req, res) {
        // TODO: Add username to database, send OK code with username back to frontend
        User.create({ username: req.body.username })
            .fetch()
            .then((user) => {
                res.status(201).send(user);
            });
    },
    updateUser: function (req, res) {
        User.updateOne({ username: req.params.username })
            .set({
                username: req.body.newUsername,
            })
            .then((user) => {
                res.status(200).send(user);
            });
    },
    getUser: function (req, res) {
        if (req.params.username) {
            User.findOne({ username: req.params.username }).then((user) => {
                if (!user) {
                    res.status(404).send("No user found.");
                } else {
                    res.status(200).send(user);
                }
            });
        } else {
            User.find().then((users) => {
                res.send(users);
            });
        }
    },
};
