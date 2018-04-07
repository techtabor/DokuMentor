var config = {
    default: {
        port: 3000,
        google: {
            clientID: '<censored>',
            clientSecret: '<censored>'
        },
        databaseconnection: {
            host: "localhost",
            user: "nodeaccess",
            password: "<censored>",
            database: "dokumentor"
        },
        session: {
            cookieKey: '<censored>'
        }

    }
}

exports.get = function get(env) {
    return config[env] || config.default;
}