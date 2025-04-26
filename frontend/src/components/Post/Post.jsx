import React, { useState, useEffect } from 'react';
import {
  likePost,
  unlikePost,
  createComment,
  getPostComments,
  getPostGroupName
} from '../../services/api';
import Comment from '../Comment/Comment';
import { Button, Spinner, Alert, Form, Image, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Post.css';

const Post = ({ post, currentUser }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentError, setCommentError] = useState(null);
  const [postError, setPostError] = useState(null);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [groupName, setGroupName] = useState(null);
  const [isLoadingGroup, setIsLoadingGroup] = useState(false);

  useEffect(() => {
    if (post) {
      setIsLiked(post.likes?.some(like => like?.id === currentUser?.id) || false);
      setLikeCount(post.like_count || 0);

      if (post.group) {
        fetchGroupName();
      }

      if (showComments && comments.length === 0) {
        loadComments();
      }
    }
  }, [post, currentUser, showComments]);

  const fetchGroupName = async () => {
    setIsLoadingGroup(true);
    try {
      const name = await getPostGroupName(post.id);
      setGroupName(name);
    } catch (error) {
      console.error('Group fetch error:', error);
    } finally {
      setIsLoadingGroup(false);
    }
  };

  const loadComments = async () => {
    if (!post?.id) return;

    setIsLoadingComments(true);
    try {
      const fetchedComments = await getPostComments(post.id);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Failed to load comments:', error);
      setCommentError('Failed to load comments');
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleLike = async () => {
    try {
      setPostError(null);

      if (!post?.id) throw new Error('Invalid post');
      if (!currentUser?.id) throw new Error('Please log in to like posts');

      if (isLiked) {
        await unlikePost(post.id);
        setLikeCount(prev => prev - 1);
      } else {
        await likePost(post.id);
        setLikeCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Like error:', error);
      setPostError(error.message);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentError(null);

    if (!newComment.trim()) {
      setCommentError('Comment cannot be empty');
      return;
    }

    setIsCommenting(true);

    try {
      const createdComment = await createComment(post.id, newComment);
      setComments(prev => [createdComment, ...prev]);
      setNewComment('');
    } catch (error) {
      console.error('Comment error:', error);
      setCommentError(error.message || 'Failed to post comment');
    } finally {
      setIsCommenting(false);
    }
  };

  if (!post) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="post-container"
    >
      {/* Post Header */}
      <div className="post-header">
        <div className="author-avatar">
          {post.author?.avatar ? (
            <Image
              src={post.author.avatar}
              alt={post.author.username}
              roundedCircle
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-avatar.png';
              }}
            />
          ) : (
            <div className="avatar-placeholder">
              {post.author?.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
        </div>

        <div className="post-meta">
          <div className="author-info">
            <span className="author-name">{post.author?.username || 'Unknown User'}</span>
            {isLoadingGroup ? (
              <Spinner animation="border" size="sm" className="group-spinner" />
            ) : groupName && (
              <Badge bg="light" text="dark" className="group-badge">
                <i className="fas fa-users me-1"></i>
                {groupName}
              </Badge>
            )}
          </div>
          <span className="post-date">
            {new Date(post.created_at).toLocaleString([], {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </div>

      {/* Post Content */}
      <div className="post-content">
        {post.title && <h3 className="post-title">{post.title}</h3>}
        <div className="post-text">{post.content}</div>
      </div>

      {/* Post Stats */}
      <div className="post-stats">
        <div className="likes-count">
          <i className="fas fa-thumbs-up"></i> {likeCount} likes
        </div>
        <div
          className="comments-count"
          onClick={() => setShowComments(!showComments)}
        >
          <i className="fas fa-comment"></i> {comments.length} comments
        </div>
      </div>

      {/* Post Actions */}
      <div className="post-actions">
        <Button
          variant="light"
          className={`action-button ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
          disabled={!currentUser}
        >
          <i className={`fas fa-thumbs-up ${isLiked ? 'text-primary' : ''}`}></i> Like
        </Button>
        <Button
          variant="light"
          className="action-button"
          onClick={() => setShowComments(!showComments)}
        >
          <i className="fas fa-comment"></i> Comment
        </Button>
      </div>

      {/* Error Message */}
      {postError && (
        <Alert variant="danger" className="post-error">
          <i className="fas fa-exclamation-circle me-2"></i> {postError}
        </Alert>
      )}

      {/* Comments Section */}
      {showComments && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="comments-section"
        >
          {/* Comment Form */}
          <Form onSubmit={handleCommentSubmit} className="comment-form">
            <div className="comment-input-wrapper">
              {currentUser?.avatar ? (
                <Image
                  src={currentUser.avatar}
                  alt={currentUser.username}
                  roundedCircle
                  className="comment-avatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-avatar.png';
                  }}
                />
              ) : (
                <div className="comment-avatar placeholder">
                  {currentUser?.username?.charAt(0)?.toUpperCase() || 'Y'}
                </div>
              )}
              <Form.Control
                as="textarea"
                rows={2}
                value={newComment}
                onChange={(e) => {
                  setNewComment(e.target.value);
                  if (commentError) setCommentError(null);
                }}
                placeholder="Write a comment..."
                className="comment-textarea"
                disabled={isCommenting}
              />
            </div>
            {commentError && (
              <Alert variant="danger" className="comment-error">
                <i className="fas fa-exclamation-circle me-2"></i> {commentError}
              </Alert>
            )}
            <div className="comment-submit">
              <Button
                variant="primary"
                type="submit"
                disabled={isCommenting || !newComment.trim()}
                size="sm"
                className="comment-submit-btn"
              >
                {isCommenting ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                    Posting...
                  </>
                ) : (
                  'Post Comment'
                )}
              </Button>
            </div>
          </Form>

          {/* Comments List */}
          <div className="comments-list">
            {isLoadingComments ? (
              <div className="comments-loading">
                <Spinner animation="border" variant="primary" size="sm" className="me-2" />
                Loading comments...
              </div>
            ) : comments.length > 0 ? (
              comments.map(comment => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Comment
                    comment={comment}
                    currentUser={currentUser}
                  />
                </motion.div>
              ))
            ) : (
              <div className="no-comments">
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Post;