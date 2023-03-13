module.exports = (app) => {
  app.use("/session", require(`../entities/session/session-route`));
  app.get("/", function (req, res) {
    return res.json({});
  });
};
