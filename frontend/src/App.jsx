import React, { useState, useEffect } from 'react';
import './App.css';

function App() {

	const [post, setPost] = useState("");
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		getPostsFromMongoDb();
	}, []);

	const getPostsFromMongoDb = () => {
		console.log('Getting books...')
		fetch('http://localhost:3001/posts')
			.then(res => res.json())
			.then(data => {
				setPosts(data.data);
			});
	};

	function parseDateTime(dateTimeString) {
		const dateTimeObject = new Date(dateTimeString);
		
		let time = dateTimeObject.toLocaleTimeString().split(":");
		let unit = time[2].slice(3).toLocaleUpperCase();
		
		let date = dateTimeObject.toDateString().split(" ").slice(1);

		let formattedString = `${date[0]} ${date[1]} ${date[2]} - ${time[0]}:${time[1]} ${unit}`;

		return formattedString;
	}

	const addPost = () => {
		const newPost = { postMessage: post };

		fetch('http://localhost:3001/post', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newPost)
		}).then(res => res.json()).then(body => {
			console.log("Status of adding a post: " + body.status);
			getPostsFromMongoDb();
		});

		setPost("");
	};

	const deletePost = (id) => {
		console.log('...requested to delete book');
		fetch(`http://localhost:3001/posts/${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } })
			.then(res => res.json()).then(status => {
				console.log("Status of deleting book: " + status.status);
				getPostsFromMongoDb();
			});
	};

	return (
		<div className='react-app-component text-center'>
			<div className="container">
				<div className="row justify-content-md-center">
					<div className="col-6">
						<div className="card">
							<div className="card-body">
								<div className="mb-3">
									<label className="form-label">Enter your post</label>
									<textarea className="form-control" id="post-content" rows="3" value={post} onChange={(e) => (setPost(e.target.value))}></textarea>
									<div className="d-grid gap-2">
										<button type="button" className="btn btn-primary mt-2" onClick={() => addPost()}>Post</button>
									</div>
								</div>
							</div>
						</div>
						{
							posts.map(((post, index) => {
								return (
									<div key={index} className="card text-white bg-dark my-3 text-start">
										<div className="card-body">
											<h6 className="card-subtitle mb-2 text-muted">{parseDateTime(post.createdAt)}</h6>
											<p className="card-text">{post.postMessage}</p>
											<a href="#" className="card-link" onClick={() => deletePost(post._id)}>Delete</a>
										</div>
									</div>
								)
							}))
						}

					</div>
				</div>
			</div>
		</div>
	);
}

export default App;