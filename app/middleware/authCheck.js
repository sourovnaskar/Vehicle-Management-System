const jwt = require("jsonwebtoken");

const authCheck = (req, res, next) => {
  const accessToken = req.cookies?.accessToken;
  const refreshToken = req.cookies?.refreshToken;

  if (accessToken) {
    try {
      const decodedAccess = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    req.user = decodedAccess;
    return next();
    } catch (error) {
      console.log("Access token expired , creating new access token")
    }
    
  }
  if (!refreshToken) {
    req.flash("error", "Token is expired or invalid . Please login again");
    return res.redirect("/login");
  }
  try {
    const decodedRefresh = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_KEY,
    );
    const newAcesstoken = jwt.sign(
      {
        id: decodedRefresh.id,
        name: decodedRefresh.name,
        role: decodedRefresh.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15m" },
    );
    res.cookie("accessToken", newAcesstoken, {
      httpOnly: true,
    });
    req.user = decodedRefresh;
    return next();
  } catch (error) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    req.flash("error", "Token is expired or invalid . Please login again");
    return res.redirect("/login");
  }
};
module.exports = authCheck;
