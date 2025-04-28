import React, { useState, useEffect } from 'react';
import { likeComment, unlikeComment } from '../../services/api';
import { Button, Alert, Image, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Comment.css';

const Comment = ({ comment, currentUser }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [error, setError] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Safely handle undefined comment
  const safeComment = comment || {};
  const author = safeComment.author || {};
  const likes = safeComment.likes || [];

  useEffect(() => {
    setIsLiked(likes.some(like => like?.id === currentUser?.id));
    setLikeCount(safeComment.like_count || 0);
  }, [safeComment, currentUser, likes]);

  const handleLike = async () => {
    try {
      setError(null);
      setIsAnimating(true);

      if (!safeComment.id) throw new Error('Invalid comment ID');
      if (!currentUser?.id) throw new Error('Please log in to like comments');

      if (isLiked) {
        await unlikeComment(safeComment.id);
        setLikeCount(prev => prev - 1);
      } else {
        await likeComment(safeComment.id);
        setLikeCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Comment like error:', error);
      setError(error.message);
    } finally {
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  if (!comment) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="comment-container"
    >
      <div className="comment-author">
        {author?.avatar ? (
          <Image
            src={author.avatar}
            alt={author.username}
            className="author-avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default-avatar.png';
            }}
          />
        ) : (
          <div className="author-avatar placeholder">
            {author?.username?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        )}
      </div>

      <div className="comment-content">
        <div className="comment-header">
          <span className="author-name">
            {author?.username || 'Unknown User'}
          </span>
          <span className="comment-date">
            {safeComment.created_at ?
              new Date(safeComment.created_at).toLocaleString([], {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : ''}
          </span>
        </div>

        <div className="comment-text">
          {safeComment.content || ''}
        </div>

        {error && (
          <Alert variant="danger" className="comment-error">
            <i className="fas fa-exclamation-circle me-2"></i> {error}
          </Alert>
        )}

        <div className="comment-actions">
          <Button
            variant="link"
            className={`like-button ${isLiked ? 'liked' : ''} ${isAnimating ? 'animating' : ''}`}
            onClick={handleLike}
            disabled={!currentUser}
          >
            <i className={`fas fa-thumbs-up ${isLiked ? 'text-primary' : ''}`}></i>
            <span>Like</span>
            {likeCount > 0 && (
              <Badge bg={isLiked ? 'primary' : 'secondary'} className="like-count">
                {likeCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Comment;