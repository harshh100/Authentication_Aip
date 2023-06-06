app.post(
  "/login",
  function (req, res, next) {
    passport.authenticate("local", function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).json({ msg: 'Invalid email or password' });
      }
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        if (req.body.remember) {
          req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
        }
        // console.log("body" + req.body);
        // console.log("role = " + req.user.role);
        return res.json({ role: req.user.role });
      });
    })(req, res, next);
  }
);
