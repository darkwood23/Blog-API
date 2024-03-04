const express = require("express")
const router = express.Router()

const postController = require("./controllers/postController")
const userController = require("./controllers/userController")
const commentController = require("./controllers/commentController")

function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization']
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ')
        // Get toekn from array
        const bearerToken = bearer[1]
        // Set the token 
        req.token = bearerToken
        // Next midleware
        next()
    } else {
        res.sendStatus(403)
    }
}

router.get("/", postController.get_allPosts)

router.post("/write-post", verifyToken, postController.write_Posts)
router.post("/edit-post/:id", verifyToken, postController.edit_posts)
router.post("/delete-post/:id", verifyToken, postController.delete_posts)

router.post("/create-user", userController.create_user)
router.post('/log-in', userController.log_in_post)

router.post("/write-comments/:id", commentController.write_comments)

module.exports = router