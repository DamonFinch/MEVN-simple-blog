const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

const mongodb_conn_module = require('./mongodbConnModule');
var db = mongodb_conn_module.connect();

var Post = require("../models/post");

app.get('/posts', (req, res) => {
  Post.find({}, 'title description', ).sort({_id:-1})
	.then(posts=>{
		res.send({
			posts: posts
		})
	})
	.catch(error=>{
		console.log(error)
	})
})

app.post('/add_post', (req, res) => {
	var db = req.db;
	var title = req.body.title;
	var description = req.body.description;
	var new_post = new Post({
		title: title,
		description: description
	})

	new_post.save()
		.then(d=>{
			res.send({
				success: true
			})
		})
		.catch(error=>{
			console.log(error)
		})
})

app.put('/posts/:id', (req, res) => {
	var db = req.db;
	Post.findById(req.params.id, 'title description')
	.then(post=>{
		post.title = req.body.title
		post.description = req.body.description
		post.save()
		  .then(d=>{
			  res.send({
				  success: true
			  })
		  })
		  .catch(error=>{
			  console.log(error)
		  })
	})
	.catch(error=>{
		console.log(error)
	})
})

app.delete('/posts/:id', (req, res) => {
	var db = req.db;
	Post.deleteOne({
		_id: req.params.id
	}).then( post=>{
		res.send({
			success: true
		})
	})
	.catch(error=>{
		console.log(error)
	})
})

app.get('/post/:id', (req, res) => {
	var db = req.db;
	Post.findById(req.params.id, 'title description')
	.then( post=>{
	  res.send(post)
	})
	.catch(error=>{
		console.log(error)
	})
})

app.listen(process.env.PORT || 8081)
