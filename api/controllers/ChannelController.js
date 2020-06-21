/**
 * ChannelsController
 *
 * @description :: Server-side actions for handling incoming channel requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    createChannel: function (req, res) {
        Channel.create({
            url: req.body.url,
            name: req.body.name || req.params.channelURL,
        })
            .fetch()
            .then((channel) => res.statusCode(201).send(channel));
    },
    updateChannel: function (req, res) {
        Channel.findOne({
            url: req.params.channelURL,
        }).then((channel) => {
            if (!channel) {
                res.status(500).send(
                    "Could not match channel url: " + req.params.channelURL
                );
            } else {
                Channel.updateOne({ url: req.params.channelURL })
                    .set({
                        url: req.body.url || channel.url,
                        name: req.body.name || channel.name,
                    })
                    .then((channel) => res.send(channel));
            }
        });
    },
    postMessage: function (req, res) {
        // Create the message
        Message.create({
            from: req.body.from,
            message: req.body.message,
            channel: req.body.channelID,
        })
            .fetch()
            .then((message) => res.status(201).send(message));
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
