const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleRefreshToken = async (req, res) => {
  console.log("handleRefreshToken");

  const cookies = req.cookies;
  if (!cookies?.refreshToken) return res.sendStatus(401);
  const refreshToken = cookies.refreshToken;
  console.log("refreshToken");
  console.log(refreshToken);

  //זמני
  let foundUser = { UserId: "123456789", RoleName: "Patient" };
  //יש פה בדיקה האם קיים אדם שזה הרפרש טוקן שלו
  //צריך במידה והאתר פתוח יותר זמן משהות הרפרש טוקן ואז כבר לא קיים משתמש מחובר
  // const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
  // if (!foundUser) return res.sendStatus(403); //Forbidden
  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    // if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
    if (err) return res.sendStatus(403);
    const accessToken = jwt.sign(
      { id: foundUser.UserId, role: foundUser.RoleName },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 30 * 1000,
    });
    res.json(foundUser);
  });
};

module.exports = { handleRefreshToken };