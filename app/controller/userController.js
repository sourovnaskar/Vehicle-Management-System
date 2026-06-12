const User = require("../models/userModel");

class UserController {
  registerView(req, res) {
    res.render("Register");
  }

  async Register(req,res){
    
  }
}

module.exports = new UserController();
