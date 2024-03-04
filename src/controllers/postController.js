const Post = require("../models/post")
const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")

module.exports.get_allPosts = asyncHandler( async (req, res, next ) => {
    const [
        numPosts,
        allPosts
    ] = await Promise.all([
        Post.countDocuments({}).exec(),
        Post.find().exec()
    ])

    res.json({ title: 'Post Index', number_posts: numPosts, posts_array: allPosts })
})

module.exports.write_Posts = asyncHandler( async (req, res, next) => {
    let post
    let noErrors
    jwt.verify(req.token, "secretkey", (err, authData) => {
        if (err) {
            res.sendStatus(403)
            return
        } else {
            post = new Post({
                title: req.headers['title'],
                text: req.headers['text'],
                user: req.headers['user'],
            })
            res.json({
                message: 'Post Created ...',
                authData,
                post,
                status: 200
            })
            noErrors = true
        }
    })
    if(noErrors) {
        await post.save()
    }
})

module.exports.delete_posts = asyncHandler( async (req, res, next) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403)
            return
        }
    })
    const postExists = await Post.findById(req.params.id)
    
    if (postExists) {

        await Post.findByIdAndDelete(req.params.id).exec()
        
        res.json({
            message: 'Message successfully deleted',
            status: 200
        })
    } else {
        res.sendStatus(404)
    }
})

module.exports.edit_posts = asyncHandler( async (req, res, next) => {
    const exists = await Post.findById(req.params.id)
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403)
            return
        }
    })
    if(exists) {
        let post = new Post({
            _id: exists._id,
            title: req.headers['title'],
            text: req.headers['text'],
            user: req.headers['user'],
        })

        await Post.findByIdAndUpdate(req.params.id, post, {}).exec()

        res.json({
            message: 'Post Updated Successfuly',
            status: 200
        })
    } else {
        res.sendStatus(404)
    }
})