/**
 * ChannelsController
 *
 * @description :: Server-side actions for handling incoming channel requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    createChannel: function (req, res) {
        Channel.create({
            url: req.params.channelURL,
            name: req.body.name || req.params.channelURL,
        })
            .fetch()
            .then((channel) => res.send(channel));
    },
    updateChannel: function (req, res) {
        // TODO
    },
    postMessage: function (req, res) {
        // Create the message
        Message.create({
            from: req.body.from,
            message: req.body.message,
            channel: req.body.channelID,
        })
            .fetch()
            .then((message) => res.send(message));
    },
    getChannel: function (req, res) {
        if (req.params.channelID) {
            Channel.findOne({
                url: req.params.channelURL,
            }).then((channel) => res.send(channel));
        } else {
            Channel.find().then((channels) => res.send(channels));
        }
    },
    getMessages: function (req, res) {
        Channel.findOne({ url: req.params.channelURL })
            .populate("messages")
            .then((channel) => res.send(channel.messages));
    },
};
