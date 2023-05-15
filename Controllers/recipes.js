let db = require("../util/db");

const createRecipe = (req, res) => {
    const {label, url, image_url, source} = req.body
    const {userInfo} = req
    const sql=`
    INSERT INTO recipes
	    (user_id, label, url, image_url, source)
    VALUES 
        (?, ?, ?, ?, ?)
    `
    const body = [userInfo.userId, label, url, image_url, source]
    db.query(sql, body, (err, results) => {
        if (err) {
            console.log("There is an error ", err);
            return res.status(500).json({err});
          }
          return res.json(results)
    })
}
const getRecipesByUserId = (req, res) => {
    const {userId} = req.userInfo
    const sql =`
        SELECT * from recipes WHERE user_id = ?
    `
    db.query(sql, [userId], (err, rows) => {
        if (err) {
            console.log("There is an error ", err);
            return res.status(500).json({err});
        }
        return res.json(rows)
    })
}
const getAllRecipes = (req, res) => {
    const sql =`
        SELECT * from recipes
    `
    db.query(sql, (err, rows) => {
        if (err) {
            console.log("There is an error ", err);
            return res.status(500).json({err});
        }
        return res.json(rows)
    })
}
const deleteRecipe = (req, res) => {
    const {id} = req.params
    const sql =`
    DELETE from recipes WHERE id = ?
    `
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.log("There is an error ", err);
            return res.status(500).json({err});
        }
        return res.json(results)
    })
}

module.exports={createRecipe, getRecipesByUserId, getAllRecipes, deleteRecipe}