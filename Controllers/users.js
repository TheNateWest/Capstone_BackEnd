let db = require("../util/db");
let argon2 = require("argon2");
let jwt = require("jsonwebtoken");

let register = async (req, res) => {
  // {"userName": "nwest", "password": "bob12345": "Nate West"}
  console.log('inside /POST register route')
  let username = req.body.username;
  let password = req.body.password;
  let fullName = req.body.fullName;
let email = req.body.email;
  let passwordHash;

  try {
    // hash the password
    passwordHash = await argon2.hash(password);
  } catch (err) {
    console.log(err);
    //if err code = 'ER_DUPE_ENTRY' {
    //  console.log('user name already taken. please choose another ', err)

    res.sendStatus(500);
    return;
  }

  let params = [username, passwordHash, fullName, email];
  let sql =
    "insert into regUser (username, password_hash, full_name, email) values (?, ?, ?, ?)";

  try {
    let results = await db.query(sql, params);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    if (err.code == "ER_DUP_ENTRY") {
      res.status(400).send("That username is taken. Please try again.");
    } else {
      res.sendStatus(500);
    }
    return;
  }
};

let login = (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  let sql =
    "select id, full_name, password_hash from regUser where username = ?";
  let params = [username];

  db.query(sql, params, async (err, rows) => {
    if (err) {
      console.log("Could not get user ", err);
      res.sendStatus(500);
    } else {
      // we found someone
      if (rows.length > 1) {
        console.log("Returned too many rows for username ", username);
        res.sendStatus(500);
      } else if (rows.length == 0) {
        console.log("Username does not exist");
        res
          .status(400)
          .send("That username does not exist. Please sign up for an account.");
      } else {
        // we have one row
        // [{"id": 234, "username": "nwest", "password_hash": "....", full_name": "Nate West"} ]

        let pwHash = rows[0].password_hash;
        let fnName = rows[0].full_name;
        let userId = rows[0].id;

        let goodPass = false;

        try {
          goodPass = await argon2.verify(pwHash, password); // rerturns a boolean, so at this point if the hash verified, goodPass = true
        } catch (err) {
          console.log("Failed to verify password ", err);
          res.status(400).send("Invalid password");
        }

        if (goodPass) {
          let token = {
            fullName: fnName,
            userId: userId, // usually want the bare minimum of key/value
          };

          // res.json(token); // unsigned token

          // now we need to sign the token

          let signedToken = jwt.sign(token, process.env.JWT_SECRET);

          // res.json(signedToken);
          res.status(200).json({token: signedToken});

          // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6Ik5hdGUgV2VzdCIsInVzZXJJZCI6MSwiaWF0IjoxNjgwMTkxMjM3fQ.u8oSD8M9Au1NJoVM_ZLlYOmcQwpG1L6CFiAMED_WgPI
        } else {
          res.sendStatus(400);
        }
      } // end else
    }
  });
}; // end of the function

const getAllUsers = (req, res) => {
    console.log('Inside GET users route')
    db.query("SELECT * FROM regUser", (err, rows) => {
        if(err){
            return res.json(err)
        }
        res.json(rows)
    })
}

const getUserById = (req, res) => {
    console.log('Inside GET userById route')
    const userId = req.params.id
    const sql = "SELECT * FROM regUser WHERE id = ?"
    db.query(sql, [userId], (err, rows) => {
        if(err){
            return res.status(500).json(err)
        }
        res.status(200).json(rows)
    })
}



const updateUser = (req, res) => {
    console.log('Inside PUT updateUser route')
    const id = req.params.id
    const {full_name, email, username} = req.body
    const body = [full_name, email, username, id]
    const sql = "UPDATE regUser SET full_name = ?, email = ?, username = ?, WHERE id = ?"
    db.query(sql, body, (err, results) => {
        if(err){
            return res.status(500).json(err)
        }
        res.status(200).json({status: 'success', message: `User updated`, results})
    })
}

const deleteUser = (req, res) => {
    console.log('Inside DELETE userRoute')
    const id = req.params.id
    const sql = "DELETE FROM regUser WHERE id = ?"
    db.query(sql, [id], (err,results) => {
        if(err){
            return res.status(500).json(err)
        }
        res.status(200).json({status: 'success', message: `User deleted`, results})
    })

}

module.exports = { register, login, getAllUsers, getUserById, updateUser, deleteUser };
