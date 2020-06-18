/**
 * MessageController
 *
 * @description :: Server-side actions for handling incoming message requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    getMessage: function (req, res) {
        if (req.params.id) {
            Message.find({ id: req.params.id }).then((message) => {
                res.send(message);
            });
        } else {
            Message.find().then((messages) => {
                res.send(messages);
            });
        }
    },
};
