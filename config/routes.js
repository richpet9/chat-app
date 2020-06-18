/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
    /***************************************************************************
     *                                                                          *
     * Make the view located at `views/homepage.ejs` your home page.            *
     *                                                                          *
     * (Alternatively, remove this and add an `index.html` file in your         *
     * `assets` directory)                                                      *
     *                                                                          *
     ***************************************************************************/

    "GET /": { view: "pages/homepage" },

    /***************************************************************************
     *                      USER CONTROLLER ENDPOINTS                          *
     ***************************************************************************/
    "POST /api/user/:username": "UserController.createUsername",
    "POST /api/user/:username/update": "UserController.updateUser",
    "GET /api/user/:username?": "UserController.getUsername",

    /***************************************************************************
     *                    CHANNEL CONTROLLER ENDPOINTS                         *
     ***************************************************************************/
    "POST /api/channel/:channelURL": "ChannelController.createChannel",
    "POST /api/channel/:channelURL/post": "ChannelController.postMessage",
    "GET /api/channel/:channelURL?": "ChannelController.getChannel",
    "GET /api/channel/:channelURL/messages": "ChannelController.getMessages",

    /**************************************************************************
     *                    MESSAGE CONTROLLER ENDPOINTS                         *
     ***************************************************************************/

    /***************************************************************************
     *                                                                          *
     * More custom routes here...                                               *
     * (See https://sailsjs.com/config/routes for examples.)                    *
     *                                                                          *
     * If a request to a URL doesn't match any of the routes in this file, it   *
     * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
     * not match any of those, it is matched against static assets.             *
     *                                                                          *
     ***************************************************************************/
};
