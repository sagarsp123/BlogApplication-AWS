const { db } = require("../db");
const jwt = require("jsonwebtoken");

const getPosts = (req,res) => {
    const q = req.query.cat ? "SELECT * FROM posts WHERE cat=?" : "SELECT * FROM posts";

    db.query(q, [req.query.cat], (err,data) => {
        if(err) return res.status(500).send(err);

        return res.status(200).json(data);
    });
}

const getPost = (req,res) => {
    const q = "SELECT p.id, `username`,`title`,`descr`,p.img, u.img AS userImg,`cat`,`date` FROM users u JOIN posts p ON u.id=p.uid WHERE p.id = ?"

    db.query(q, [req.params.id], (err,data) => {
        if(err) return res.status(500).json(err)

        return res.status(200).json(data[0])
    })
}

const addPost = (req,res) => {
    const q = "INSERT INTO posts(`title`, `descr`, `img`, `cat`, `date`, `uid`) VALUES (?)"
    const values = [
        req.body.title,
        req.body.descr,
        req.body.img,
        req.body.cat,
        req.body.date,
        req.body.userId
    ]

    db.query(q,[values], (err,data) => {
        if(err) return res.status(500).json(err);
        return res.json("Post has been created")
    })

}

const deletePost = (req,res) => {

    const postId = req.params.id
    const userId = req.body.userId
    const q = "DELETE FROM posts WHERE `id` = ?"

    db.query(q, [postId, userId], (err,data) => {
        if(err) return res.status(403).json("You cant delete a post that isnt yours!")

        return res.json("Post has been deleted!")
    })
}

const updatePost = (req,res) => {

    const postId = req.params.id
    const userId = req.body.userId
    const q = "UPDATE posts SET `title`=?, `descr`=?, `cat`=?, `img`=? WHERE `id`= ? AND `uid`= ?"

    const values = [
        req.body.title,
        req.body.descr,
        req.body.cat,
        req.body.img,
    ]

    db.query(q,[...values, postId, userId], (err,data) => {
        if(err) return res.status(500).json(err);
        return res.json("Post has been updated")
    })
}

module.exports = {getPosts, getPost, addPost, deletePost, updatePost}