const SessionService = require("./session-service");

const SessionController = {
  login: async (req, res) => {
    return res.json(SessionService.login())
  },
};

module.exports = SessionController;
