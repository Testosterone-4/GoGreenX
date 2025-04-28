import React, { useState } from 'react';
import { createPost } from '../../services/api';
import { Button, Spinner, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CreatePost.css';

const CreatePost = ({ currentUser, onPostCreated }) => {
  const [postContent, setPostContent] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!postContent.trim()) {
      setError('Post content cannot be empty');
      return;
    }

    setIsSubmitting(true);

    try {
      const postData = { content: postContent };
      if (postTitle.trim()) postData.title = postTitle;

      const response = await createPost(postData);

      if (response) {
        onPostCreated(response);
        setPostContent('');
        setPostTitle('');
        setCharacterCount(0);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Post creation error:', error);
      if (error.message.includes('title')) {
        setError('Title cannot be blank if provided');
      } else if (error.message.includes('content')) {
        setError('Post content cannot be empty');
      } else {
        setError(error.message || 'Failed to create post. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContentChange = (e) => {
    setPostContent(e.target.value);
    setCharacterCount(e.target.value.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="create-post-container"
    >
      <div className="post-author">
        {currentUser?.avatar ? (
          <img
            src={currentUser.avatar}
            alt={currentUser.username}
            className="author-avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default-avatar.png';
            }}
          />
        ) : (
          <div className="author-avatar placeholder">
            {currentUser?.username?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="post-form">
        {error && (
          <Alert variant="danger" className="form-alert">
            <i className="fas fa-exclamation-circle me-2"></i> {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" className="form-alert">
            <i className="fas fa-check-circle me-2"></i> Post created successfully!
          </Alert>
        )}

        <div className="form-group">
          <input
            type="text"
            placeholder="Add a title (optional)"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            className="form-control title-input"
            maxLength="120"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <textarea
            placeholder={`What's on your mind, ${currentUser?.username || 'User'}?`}
            value={postContent}
            onChange={handleContentChange}
            className="form-control content-textarea"
            rows={4}
            disabled={isSubmitting}
            required
            maxLength="2000"
          />
          <div className="character-counter">
            {characterCount}/2000
          </div>
        </div>

        <div className="form-actions">
          <Button
  variant="success" // Changed from "primary" to "success"
  type="submit"
  disabled={isSubmitting || !postContent.trim()}
  className="submit-button"
>
  {isSubmitting ? (
    <>
      <Spinner as="span" animation="border" size="sm" className="me-2" />
      Posting...
    </>
  ) : (
    <>
      <i className="fas fa-paper-plane me-2"></i> Publish Post
    </>
  )}
</Button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreatePost;