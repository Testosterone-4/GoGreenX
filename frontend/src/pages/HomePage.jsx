import React, { useState, useEffect } from 'react';
import { fetchPosts } from '../services/api';
import Post from '../components/Post/Post';
import CreatePost from '../components/CreatePost/CreatePost';
import { Spinner, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HomePage.css';
import { fetchCurrentUser } from '../services/api';

const HomePage = ({ user, setUser }) => {
  const Motion = motion.div;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await fetchCurrentUser();
      setUser(userData);
      setLoading(false);
    };
    loadUser();
  }, [setUser]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const postsData = await fetchPosts();
        setPosts(postsData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading posts:', error);
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  const handleNewPost = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  if (loading) return (
    <div className="loading-container">
      <Spinner animation="border" variant="success" />
    </div>
  );

  return (
    <div className="homepage-container">
      <main className="main-content">
        <div className="content-wrapper">
          <div className="posts-column">
            <Motion
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="create-post-section"
            >
              <div className="create-post-card">
                <CreatePost currentUser={user} onPostCreated={handleNewPost} />
              </div>
            </Motion>

            <div className="posts-list">
              {posts.length === 0 ? (
                <div className="empty-posts-card">
                  <p className="empty-message">No posts yet. Be the first to share something!</p>
                </div>
              ) : (
                posts.map(post => (
                  <Motion
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.01 }}
                    className="post-item"
                  >
                    <div className="post-card">
                      <Post post={post} currentUser={user} />
                    </div>
                  </Motion>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;