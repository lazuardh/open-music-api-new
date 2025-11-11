const AuthenticationsHandler = require("./handler");
const routes = require("./router");


module.exports = {
    name: 'authentications',
    version: '1.0.0',
    register: async (server, {
        authenticationsQueryService,
        usersQueryService,
        tokenManager,
        validator
    }) => {
        const authenticationHandler = new AuthenticationsHandler(
            authenticationsQueryService,
            usersQueryService,
            tokenManager, 
            validator,
        );

        server.route(routes(authenticationHandler));
    },
};