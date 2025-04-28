import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Button, Card, Form, Alert, Spinner, Badge, Modal, ListGroup } from 'react-bootstrap';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_HOST = import.meta.env.VITE_API_HOST;
// Create an axios instance with authentication
const api = axios.create({
  baseURL: `${API_HOST}`
});
const Motion = motion.div
// Add request interceptor to include token in all requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// API service for user, group and post operations
const ApiService = {
  getCurrentUser: () => api.get('/auth/users/me/'),
  getGroups: () => api.get('/api/groups/'),
  getGroup: (id) => api.get(`/api/groups/${id}/`),
  createGroup: (data) => api.post('/api/groups/', data),
  updateGroup: (id, data) => api.put(`/api/groups/${id}/`, data),
  deleteGroup: (id) => api.delete(`/api/groups/${id}/`),
  joinGroup: (id) => api.post(`/api/groups/${id}/join/`),
  leaveGroup: (id) => api.post(`/api/groups/${id}/leave/`),
  addModerator: (id, userId) => api.post(`/api/groups/${id}/add_moderator/`, { user_id: userId }),
  getUserByEmail: (email) => api.get(`/api/users/lookup/?email=${email}`),
  getGroupPosts: (groupId) => api.get(`/api/groups/${groupId}/posts/`),
  createGroupPost: (groupId, data) => api.post('/api/posts/', { ...data, group: groupId }),
  likePost: (postId) => api.post(`/api/posts/${postId}/like/`),
  unlikePost: (postId) => api.post(`/api/posts/${postId}/unlike/`),
  createComment: (postId, content) => api.post(`/api/comments/`, { content, post: postId }),
  getPostComments: (postId) => api.get(`/api/posts/${postId}/comments/`),
  likeComment: (commentId) => api.post(`/api/comments/${commentId}/like/`),
  unlikeComment: (commentId) => api.post(`/api/comments/${commentId}/unlike/`)
};

// Custom styles with narrower width
const styles = {
   container: {
    marginTop: '220px',
    marginLeft: '20px', // Default left margin - you can adjust this value
    padding: '1rem',
    minHeight: 'calc(100vh - 80px)',
    backgroundColor: '#f8f9fa',
    maxWidth: '1200px', // Narrower max width
    transition: 'margin-left 0.3s ease',
    '@media (minWidth: 992px)': {
      marginLeft: '250px', // When sidebar is open
      maxWidth: '800px'
    },
    '@media (maxWidth: 992px)': {
      marginLeft: '100px', // Keep your left margin when sidebar is closed
      maxWidth: '800px'
    },
    '@media (maxWidth: 800px)': {
      marginLeft: '20px', // Smaller left margin on very small screens
      marginRight: '20px',
      maxWidth: 'calc(100% - 20px)' // Account for margins
    }
  },
  card: {
    borderRadius: '12px',
    border: 'none',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    marginBottom: '1.5rem'
  },
  primaryButton: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
    fontWeight: '500',
    '&:hover': {
      backgroundColor: '#218838',
      borderColor: '#1e7e34'
    }
  },
  secondaryButton: {
    backgroundColor: '#20c997',
    borderColor: '#20c997',
    fontWeight: '500',
    '&:hover': {
      backgroundColor: '#1aa179',
      borderColor: '#189570'
    }
  },
  avatar: {
    width: '45px',
    height: '45px',
    objectFit: 'cover',
    borderRadius: '50%',
    '@media (maxWidth: 576px)': {
      width: '36px',
      height: '36px'
    }
  },
  postContainer: {
    border: 'none',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '1.5rem'
  },
  groupGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', // Adjusted for narrower width
    gap: '1.5rem',
    '@media (maxidth: 576px)': {
      gridTemplateColumns: '1fr'
    }
  }
};

const Post = ({ post, currentUser, onLike, onCreateComment, onLoadComments, onLikeComment, onUnlikeComment }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentError, setCommentError] = useState(null);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);

  const isLiked = post.likes?.some(like => like?.id === currentUser?.id);
  const likeCount = post.like_count || 0;

  const handleLike = async () => {
    try {
      await onLike(post.id);
    } catch (error) {
      console.error('Like error:', error);
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
      const createdComment = await onCreateComment(post.id, newComment);
      setComments([createdComment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Comment error:', error);
      setCommentError(error.message || 'Failed to post comment');
    } finally {
      setIsCommenting(false);
    }
  };

  const handleShowComments = async () => {
    if (!showComments && comments.length === 0) {
      setIsLoadingComments(true);
      try {
        const loadedComments = await onLoadComments(post.id);
        setComments(loadedComments);
      } catch (error) {
        console.error('Failed to load comments:', error);
      } finally {
        setIsLoadingComments(false);
      }
    }
    setShowComments(!showComments);
  };

  const handleLikeComment = async (commentId) => {
    try {
      await onLikeComment(commentId);
      setComments(comments.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              likes: [...comment.likes, { id: currentUser.id }],
              like_count: comment.like_count + 1
            }
          : comment
      ));
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleUnlikeComment = async (commentId) => {
    try {
      await onUnlikeComment(commentId);
      setComments(comments.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              likes: comment.likes.filter(like => like.id !== currentUser.id),
              like_count: comment.like_count - 1
            }
          : comment
      ));
    } catch (error) {
      console.error('Error unliking comment:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card shadow-sm mb-4"
      style={styles.postContainer}
    >
      {/* Post Header */}
      <div className="card-header bg-white border-0 pt-3 pb-2">
        <div className="d-flex align-items-center">
          {post.author?.avatar ? (
            <img
              src={post.author.avatar}
              alt={post.author.username}
              className="rounded-circle me-3"
              style={styles.avatar}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/45';
              }}
            />
          ) : (
            <div
              className="rounded-circle me-3 d-flex align-items-center justify-content-center"
              style={{ ...styles.avatar, backgroundColor: '#28a745', color: 'white' }}
            >
              {post.author?.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
          <div>
            <h6 className="mb-0 fw-bold" style={{ fontSize: '0.95rem' }}>{post.author?.username || 'Unknown User'}</h6>
            <small className="text-muted" style={{ fontSize: '0.75rem' }}>
              {new Date(post.created_at).toLocaleString([], {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </small>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="card-body py-3">
        {post.title && <h5 className="card-title mb-3" style={{ fontSize: '1.1rem' }}>{post.title}</h5>}
        <p className="card-text" style={{ fontSize: '0.9rem' }}>{post.content}</p>
      </div>

      {/* Post Stats */}
      <div className="card-footer bg-white border-0 d-flex justify-content-between py-2">
        <div className="text-muted small" style={{ fontSize: '0.8rem' }}>
          <i className="fas fa-thumbs-up me-1"></i> {likeCount}
        </div>
        <div
          className="text-muted small cursor-pointer"
          onClick={handleShowComments}
          style={{ fontSize: '0.8rem' }}
        >
          {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
        </div>
      </div>

      {/* Post Actions */}
      <div className="card-footer bg-white border-0 d-flex justify-content-around py-2">
        <Button
          variant="link"
          className={`text-decoration-none ${isLiked ? 'text-success fw-bold' : 'text-muted'}`}
          onClick={handleLike}
          disabled={!currentUser}
          style={{ fontSize: '0.85rem' }}
        >
          <i className={`fas fa-thumbs-up me-2 ${isLiked ? 'text-success' : ''}`}></i> Like
        </Button>
        <Button
          variant="link"
          className="text-decoration-none text-muted"
          onClick={handleShowComments}
          style={{ fontSize: '0.85rem' }}
        >
          <i className="fas fa-comment me-2"></i> Comment
        </Button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border-top"
        >
          {/* Comment Form */}
          <Form onSubmit={handleCommentSubmit} className="p-3">
            <div className="d-flex align-items-center mb-3">
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.username}
                  className="rounded-circle me-3"
                  style={{
                    width: '40px',
                    height: '40px',
                    objectFit: 'cover',
                    '@media (maxWidth: 576px)': {
                      width: '32px',
                      height: '32px'
                    }
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/40';
                  }}
                />
              ) : (
                <div
                  className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    '@media (maxWidth: 576px)': {
                      width: '32px',
                      height: '32px'
                    }
                  }}
                >
                  {currentUser?.username?.charAt(0)?.toUpperCase() || 'Y'}
                </div>
              )}
              <Form.Control
                type="text"
                value={newComment}
                onChange={(e) => {
                  setNewComment(e.target.value);
                  if (commentError) setCommentError(null);
                }}
                placeholder="Write a comment..."
                className="flex-grow-1"
                disabled={isCommenting}
                style={{ fontSize: '0.9rem' }}
              />
            </div>
            {commentError && (
              <Alert variant="danger" className="mb-3" style={{ fontSize: '0.85rem' }}>
                <i className="fas fa-exclamation-circle me-2"></i> {commentError}
              </Alert>
            )}
            <div className="d-flex justify-content-end">
              <Button
                variant="success"
                type="submit"
                disabled={isCommenting || !newComment.trim()}
                size="sm"
                style={styles.secondaryButton}
              >
                {isCommenting ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                    Posting...
                  </>
                ) : (
                  'Post'
                )}
              </Button>
            </div>
          </Form>

          {/* Comments List */}
          <div className="px-3 pb-3">
            {isLoadingComments ? (
              <div className="text-center py-3">
                <Spinner animation="border" variant="success" size="sm" className="me-2" />
                <span style={{ fontSize: '0.9rem' }}>Loading comments...</span>
              </div>
            ) : comments.length > 0 ? (
              comments.map(comment => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-3"
                >
                  <div className="d-flex">
                    <div className="flex-shrink-0 me-3">
                      {comment.author?.avatar ? (
                        <img
                          src={comment.author.avatar}
                          alt={comment.author.username}
                          className="rounded-circle"
                          style={{
                            width: '35px',
                            height: '35px',
                            objectFit: 'cover',
                            '@media (maxWidth: 576px)': {
                              width: '30px',
                              height: '30px'
                            }
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/35';
                          }}
                        />
                      ) : (
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: '35px',
                            height: '35px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            '@media (maxWidth: 576px)': {
                              width: '30px',
                              height: '30px'
                            }
                          }}
                        >
                          {comment.author?.username?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                      )}
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between">
                        <h6 className="mb-0 fw-bold" style={{ fontSize: '0.9rem' }}>{comment.author?.username || 'Unknown'}</h6>
                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                          {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </small>
                      </div>
                      <p className="mb-0 mt-1" style={{ fontSize: '0.85rem' }}>{comment.content}</p>
                      <div className="d-flex align-items-center mt-2">
                        <Button
                          variant="link"
                          size="sm"
                          className={`p-0 me-2 text-decoration-none ${comment.likes?.some(like => like.id === currentUser?.id) ? 'text-success' : 'text-muted'}`}
                          onClick={() =>
                            comment.likes?.some(like => like.id === currentUser?.id)
                              ? handleUnlikeComment(comment.id)
                              : handleLikeComment(comment.id)
                          }
                          disabled={!currentUser}
                          style={{ fontSize: '0.8rem' }}
                        >
                          <i className={`fas fa-thumbs-up me-1 ${comment.likes?.some(like => like.id === currentUser?.id) ? 'text-success' : ''}`}></i>
                          {comment.like_count || 0}
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-3 text-muted" style={{ fontSize: '0.9rem' }}>
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

Post.propTypes = {
  post: PropTypes.object.isRequired,
  currentUser: PropTypes.object,
  onLike: PropTypes.func.isRequired,
  onCreateComment: PropTypes.func.isRequired,
  onLoadComments: PropTypes.func.isRequired,
  onLikeComment: PropTypes.func.isRequired,
  onUnlikeComment: PropTypes.func.isRequired
};

// Main Groups component with responsive container
export const Groups = () => {
  const [activeView, setActiveView] = useState('list');
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setAuthError('Authentication required. Please log in again.');
        setLoadingUser(false);
        return;
      }

      try {
        const response = await ApiService.getCurrentUser();
        setUser(response.data);
        setLoadingUser(false);
      } catch (error) {
        console.error('Error fetching current user:', error);
        if (error.response?.status === 401) {
          setAuthError('Authentication required. Please log in again.');
        } else {
          setAuthError('Failed to load user data. Please try again later.');
        }
        setLoadingUser(false);
      }
    };

    fetchCurrentUser();

    // Handle window resize for responsive behavior
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigateToGroupDetail = (groupId) => {
    setSelectedGroupId(groupId);
    setActiveView('detail');
  };

  const navigateToGroupCreate = () => {
    setActiveView('create');
  };

  const navigateToGroupEdit = (groupId) => {
    setSelectedGroupId(groupId);
    setActiveView('edit');
  };

  const navigateToGroupList = () => {
    setActiveView('list');
  };

  if (loadingUser) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100" style={styles.container}>
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  if (authError) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 p-4" style={styles.container}>
        <Card className="w-100" style={{ ...styles.card, maxWidth: '500px' }}>
          <Card.Body className="text-center">
            <Alert variant="danger" className="mb-4">
              {authError}
            </Alert>
            <Button
              variant="success"
              onClick={() => window.location.href = '/login'}
              className="w-100"
              style={styles.primaryButton}
            >
              Go to Login
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  const renderGroupContent = () => {
    switch (activeView) {
      case 'list':
        return <GroupList user={user} onViewGroup={navigateToGroupDetail} onCreateGroup={navigateToGroupCreate} />;
      case 'detail':
        return (
          <GroupDetail
            user={user}
            groupId={selectedGroupId}
            onBack={navigateToGroupList}
            onEdit={navigateToGroupEdit}
          />
        );
      case 'create':
        return <GroupCreate user={user} onSuccess={navigateToGroupList} onCancel={navigateToGroupList} />;
      case 'edit':
        return (
          <GroupEdit
            user={user}
            groupId={selectedGroupId}
            onSuccess={() => navigateToGroupDetail(selectedGroupId)}
            onCancel={() => navigateToGroupDetail(selectedGroupId)}
          />
        );
      default:
        return <GroupList user={user} onViewGroup={navigateToGroupDetail} onCreateGroup={navigateToGroupCreate} />;
    }
  };

  return (
    <div style={{
      ...styles.container,
      marginLeft: `{100}px`, // Use the prop value
      marginLeft: sidebarCollapsed ? `{0}px` : '450px',
      padding: window.innerWidth < 768 ? '0.5rem' : '1rem'
    }}>
      <div className="container-fluid">
        {renderGroupContent()}
      </div>
    </div>
  );
};

// Group List Component with responsive grid
const GroupList = ({ user, onViewGroup, onCreateGroup }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await ApiService.getGroups();
        setGroups(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching groups:', error);
        setError(error.response?.status === 401
          ? 'Authentication error. Please log in again.'
          : 'Failed to load groups. Please try again later.'
        );
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  if (loading) return (
    <div className="text-center p-5">
      <Spinner animation="border" variant="success" />
    </div>
  );

  if (error) return (
    <Alert variant="danger" className="text-center">
      {error}
    </Alert>
  );

  return (
    <Card style={styles.card}>
      <Card.Body>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-4 gap-3">
          <Card.Title className="mb-0 fw-bold">Groups</Card.Title>
          <Button
            variant="success"
            onClick={onCreateGroup}
            className="d-flex align-items-center"
            style={styles.primaryButton}
          >
            <i className="fas fa-plus me-2"></i> Create New Group
          </Button>
        </div>

        <div style={styles.groupGrid}>
          {groups.map(group => (
            <motion.div key={group.id} whileHover={{ scale: 1.02 }}>
              <Card className="h-100" style={styles.card}>
                <Card.Body>
                  <Card.Title className="fw-bold" style={{ fontSize: '1.1rem' }}>{group.name}</Card.Title>
                  <Card.Text className="text-muted" style={{ fontSize: '0.9rem' }}>
                    {group.description.substring(0, 100)}...
                  </Card.Text>
                  <div className="d-flex align-items-center mb-3">
                    {group.is_private && (
                      <Badge bg="secondary" className="me-2">Private</Badge>
                    )}
                    <small className="text-muted" style={{ fontSize: '0.8rem' }}>
                      Created: {new Date(group.created_at).toLocaleDateString()}
                    </small>
                  </div>
                </Card.Body>
                <Card.Footer className="bg-white border-0">
                  <Button
                    variant="outline-success"
                    onClick={() => onViewGroup(group.id)}
                    className="w-100"
                    style={{ fontSize: '0.9rem' }}
                  >
                    View Details
                  </Button>
                </Card.Footer>
              </Card>
            </motion.div>
          ))}
        </div>

        {groups.length === 0 && (
          <div className="text-center py-5">
            <p className="text-muted mb-3">No groups found. Create a new group to get started!</p>
            <Button variant="success" onClick={onCreateGroup} style={styles.primaryButton}>
              Create Your First Group
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

GroupList.propTypes = {
  user: PropTypes.object,
  onViewGroup: PropTypes.func.isRequired,
  onCreateGroup: PropTypes.func.isRequired
};

// Group Create Form with responsive adjustments
const GroupCreate = ({ user, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_private: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await ApiService.createGroup(formData);
      onSuccess();
    } catch (error) {
      console.error('Error creating group:', error);
      setError(
        error.response?.status === 401 ? 'Authentication error. Please log in again.' :
        error.response?.data?.detail || 'Failed to create group. Please check your inputs.'
      );
      setLoading(false);
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Body>
        <Button variant="link" onClick={onCancel} className="mb-3 p-0 text-decoration-none">
          <i className="fas fa-arrow-left me-2"></i> Back to Groups
        </Button>

        <Card.Title className="mb-4 fw-bold">Create New Group</Card.Title>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Group Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              maxLength="100"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              required
            />
          </Form.Group>

          <div className="d-flex flex-column flex-sm-row gap-3">
            <Button variant="success" type="submit" disabled={loading} style={styles.primaryButton}>
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" className="me-2" />
                  Creating...
                </>
              ) : 'Create Group'}
            </Button>
            <Button variant="outline-secondary" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

GroupCreate.propTypes = {
  user: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

// Group Detail Component with responsive adjustments
const GroupDetail = ({ user, groupId, onBack, onEdit }) => {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModeratorForm, setShowAddModeratorForm] = useState(false);
  const [moderatorEmail, setModeratorEmail] = useState('');
  const [actionError, setActionError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [postError, setPostError] = useState(null);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [creatingPost, setCreatingPost] = useState(false);

  const safeUser = user || {};

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await ApiService.getGroup(groupId);
        setGroup(response.data);
        setLoading(false);

        if (response.data.members.some(member => member.id === safeUser.id)) {
          fetchGroupPosts();
        }
      } catch (error) {
        console.error('Error fetching group details:', error);
        setError(
          error.response?.status === 401 ? 'Authentication error. Please log in again.' :
          'Unable to load group details. Please try again later.'
        );
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [groupId, safeUser.id]);

  const fetchGroupPosts = async () => {
    setLoadingPosts(true);
    setPostError(null);
    try {
      const response = await ApiService.getGroupPosts(groupId);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching group posts:', error);
      setPostError(
        error.response?.status === 401 ? 'Authentication error. Please log in again.' :
        'Failed to load posts. Please try again later.'
      );
    } finally {
      setLoadingPosts(false);
    }
  };

  const isGroupMember = () => {
    if (!group || !safeUser.id) return false;
    return group.members.some(member => member.id === safeUser.id);
  };

  const isGroupCreator = () => {
    if (!group || !safeUser.id) return false;
    return group.creator === safeUser.id;
  };

  const isGroupModerator = () => {
    if (!group || !safeUser.id) return false;
    return group.moderators.some(mod => mod.id === safeUser.id);
  };

  const handleJoinGroup = async () => {
    setActionError(null);
    try {
      await ApiService.joinGroup(groupId);
      const response = await ApiService.getGroup(groupId);
      setGroup(response.data);
      fetchGroupPosts();
    } catch (error) {
      console.error('Error joining group:', error);
      setActionError(
        error.response?.status === 401 ? 'Authentication error. Please log in again.' :
        'Failed to join group. Please try again.'
      );
    }
  };

  const handleLeaveGroup = async () => {
    setActionError(null);
    try {
      await ApiService.leaveGroup(groupId);
      const response = await ApiService.getGroup(groupId);
      setGroup(response.data);
    } catch (error) {
      console.error('Error leaving group:', error);
      setActionError(
        error.response?.status === 401 ? 'Authentication error. Please log in again.' :
        'Failed to leave group. Please try again.'
      );
    }
  };

  const handleAddModerator = async (e) => {
    e.preventDefault();
    setActionError(null);

    try {
      const userResponse = await ApiService.getUserByEmail(moderatorEmail);
      if (!userResponse.data?.id) {
        setActionError('User not found with that email address.');
        return;
      }

      await ApiService.addModerator(groupId, userResponse.data.id);
      const response = await ApiService.getGroup(groupId);
      setGroup(response.data);
      setShowAddModeratorForm(false);
      setModeratorEmail('');
    } catch (error) {
      console.error('Error adding moderator:', error);
      setActionError(
        error.response?.status === 401 ? 'Authentication error. Please log in again.' :
        error.response?.status === 403 ? 'You do not have permission to add moderators.' :
        'Failed to add moderator. Please try again.'
      );
    }
  };

  const handleDeleteGroup = async () => {
    setActionError(null);
    try {
      await ApiService.deleteGroup(groupId);
      onBack();
    } catch (error) {
      console.error('Error deleting group:', error);
      setActionError(
        error.response?.status === 401 ? 'Authentication error. Please log in again.' :
        error.response?.status === 403 ? 'You do not have permission to delete this group.' :
        'Failed to delete group. Please try again.'
      );
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setCreatingPost(true);
    setPostError(null);

    try {
      const postData = {
        content: newPostContent,
        group: groupId
      };
      if (newPostTitle.trim()) postData.title = newPostTitle;

      const response = await ApiService.createGroupPost(groupId, postData);
      setPosts([response.data, ...posts]);
      setNewPostContent('');
      setNewPostTitle('');
    } catch (error) {
      console.error('Error creating post:', error);
      setPostError(
        error.response?.status === 401 ? 'Authentication error. Please log in again.' :
        error.response?.data?.detail || 'Failed to create post. Please try again.'
      );
    } finally {
      setCreatingPost(false);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (post.likes.some(like => like.id === safeUser.id)) {
        await ApiService.unlikePost(postId);
        setPosts(posts.map(p =>
          p.id === postId
            ? {
                ...p,
                likes: p.likes.filter(like => like.id !== safeUser.id),
                like_count: p.like_count - 1
              }
            : p
        ));
      } else {
        await ApiService.likePost(postId);
        setPosts(posts.map(p =>
          p.id === postId
            ? {
                ...p,
                likes: [...p.likes, { id: safeUser.id }],
                like_count: p.like_count + 1
              }
            : p
        ));
      }
    } catch (error) {
      console.error('Error liking post:', error);
      setPostError('Failed to like post. Please try again.');
    }
  };

  const handleCreateComment = async (postId, content) => {
    try {
      const newComment = await ApiService.createComment(postId, content);
      setPosts(posts.map(p =>
        p.id === postId
          ? { ...p, comments: [newComment.data, ...(p.comments || [])] }
          : p
      ));
      return newComment.data;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw new Error('Failed to create comment');
    }
  };

  const handleLoadComments = async (postId) => {
    try {
      const response = await ApiService.getPostComments(postId);
      setPosts(posts.map(p =>
        p.id === postId ? { ...p, comments: response.data } : p
      ));
      return response.data;
    } catch (error) {
      console.error('Error loading comments:', error);
      throw new Error('Failed to load comments');
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      await ApiService.likeComment(commentId);
    } catch (error) {
      console.error('Error liking comment:', error);
      throw new Error('Failed to like comment');
    }
  };

  const handleUnlikeComment = async (commentId) => {
    try {
      await ApiService.unlikeComment(commentId);
    } catch (error) {
      console.error('Error unliking comment:', error);
      throw new Error('Failed to unlike comment');
    }
  };

  if (loading) return (
    <div className="text-center p-5">
      <Spinner animation="border" variant="success" />
    </div>
  );

  if (error) return (
    <Alert variant="danger" className="text-center">
      {error}
    </Alert>
  );

  if (!group) return (
    <Alert variant="warning" className="text-center">
      Group not found
    </Alert>
  );

  return (
    <>
      <Card style={styles.card} className="mb-4">
        <Card.Body>
          <Button variant="link" onClick={onBack} className="mb-3 p-0 text-decoration-none">
            <i className="fas fa-arrow-left me-2"></i> Back to Groups
          </Button>

          {actionError && <Alert variant="danger">{actionError}</Alert>}

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-4 gap-3">
            <div>
              <Card.Title className="mb-2 fw-bold">{group.name}</Card.Title>
              <div className="d-flex align-items-center mb-3">
                {group.is_private && (
                  <Badge bg="secondary" className="me-2">Private</Badge>
                )}
                <small className="text-muted">
                  Created {new Date(group.created_at).toLocaleDateString()}
                </small>
              </div>
            </div>

            <div>
              {!isGroupMember() ? (
                <Button variant="success" onClick={handleJoinGroup} style={styles.primaryButton}>
                  Join Group
                </Button>
              ) : (
                <Button variant="outline-danger" onClick={handleLeaveGroup}>
                  Leave Group
                </Button>
              )}
            </div>
          </div>

          <Card.Text className="mb-4">
            {group.description}
          </Card.Text>

          {/* Group Posts Section */}
          {isGroupMember() && (
            <div className="mb-5">
              <h5 className="mb-3 fw-bold">Group Posts</h5>

              {/* Create Post Form */}
              <Card className="mb-4" style={styles.card}>
                <Card.Body>
                  <Form onSubmit={handleCreatePost}>
                    <Form.Group className="mb-3">
                      <Form.Label>Post Title (optional)</Form.Label>
                      <Form.Control
                        type="text"
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                        placeholder="Enter post title"
                        maxLength="200"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Post Content</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="Share your thoughts with the group"
                        required
                      />
                    </Form.Group>
                    <div className="d-flex justify-content-end">
                      <Button
                        variant="success"
                        type="submit"
                        disabled={creatingPost || !newPostContent.trim()}
                        style={styles.primaryButton}
                      >
                        {creatingPost ? (
                          <>
                            <Spinner as="span" animation="border" size="sm" className="me-2" />
                            Posting...
                          </>
                        ) : 'Create Post'}
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>

              {/* Posts List */}
              {postError && <Alert variant="danger">{postError}</Alert>}

              {loadingPosts ? (
                <div className="text-center p-4">
                  <Spinner animation="border" variant="success" />
                </div>
              ) : posts.length > 0 ? (
                <div className="posts-container">
                  {posts.map(post => (
                    <Post
                      key={post.id}
                      post={post}
                      currentUser={safeUser}
                      onLike={handleLikePost}
                      onCreateComment={handleCreateComment}
                      onLoadComments={handleLoadComments}
                      onLikeComment={handleLikeComment}
                      onUnlikeComment={handleUnlikeComment}
                    />
                  ))}
                </div>
              ) : (
                <Alert variant="info">
                  No posts yet. Be the first to share something!
                </Alert>
              )}
            </div>
          )}

          <div className="row">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <Card style={styles.card}>
                <Card.Header className="fw-bold">Members ({group.members.length})</Card.Header>
                <Card.Body className="p-0">
                  <ul className="list-group list-group-flush">
                    {group.members.map(member => (
                      <li key={member.id} className="list-group-item">
                        <div className="d-flex align-items-center">
                          <div className="flex-shrink-0 me-3">
                            <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center"
                                 style={{ width: '40px', height: '40px', color: 'white' }}>
                              {member.username.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <div>{member.username}</div>
                            <div className="d-flex gap-2 mt-1">
                              {group.moderators.some(mod => mod.id === member.id) && (
                                <Badge bg="info">Moderator</Badge>
                              )}
                              {group.creator === member.id && (
                                <Badge bg="success">Creator</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </div>

            {(isGroupCreator() || isGroupModerator()) && (
              <div className="col-lg-6">
                <Card style={styles.card}>
                  <Card.Header className="fw-bold">Manage Group</Card.Header>
                  <Card.Body>
                    {isGroupCreator() && (
                      <div className="mb-4">
                        <Button
                          variant="info"
                          onClick={() => setShowAddModeratorForm(!showAddModeratorForm)}
                          className="mb-3"
                        >
                          {showAddModeratorForm ? 'Cancel' : 'Add Moderator'}
                        </Button>

                        {showAddModeratorForm && (
                          <Form onSubmit={handleAddModerator} className="mb-3">
                            <Form.Group>
                              <Form.Label>User's Email</Form.Label>
                              <div className="d-flex flex-column flex-sm-row gap-2">
                                <Form.Control
                                  type="email"
                                  value={moderatorEmail}
                                  onChange={(e) => setModeratorEmail(e.target.value)}
                                  required
                                />
                                <Button variant="primary" type="submit" className="ms-sm-2">
                                  Add
                                </Button>
                              </div>
                            </Form.Group>
                          </Form>
                        )}
                      </div>
                    )}

                    <div className="d-flex flex-column flex-sm-row gap-3">
                      <Button variant="warning" onClick={() => onEdit(groupId)}>
                        Edit Group
                      </Button>

                      {isGroupCreator() && (
                        <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                          Delete Group
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this group? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteGroup}>
            Delete Group
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

GroupDetail.propTypes = {
  user: PropTypes.object,
  groupId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onBack: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired
};

// Group Edit Component with responsive adjustments
const GroupEdit = ({ user, groupId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_private: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await ApiService.getGroup(groupId);
        setFormData({
          name: response.data.name,
          description: response.data.description,
          is_private: response.data.is_private
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching group details:', error);
        setError(
          error.response?.status === 401 ? 'Authentication error. Please log in again.' :
          'Unable to load group details. Please try again later.'
        );
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await ApiService.updateGroup(groupId, formData);
      onSuccess();
    } catch (error) {
      console.error('Error updating group:', error);
      setError(
        error.response?.status === 401 ? 'Authentication error. Please log in again.' :
        error.response?.status === 403 ? 'You do not have permission to edit this group.' :
        error.response?.data?.detail || 'Failed to update group. Please check your inputs.'
      );
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="text-center p-5">
      <Spinner animation="border" variant="success" />
    </div>
  );

  if (error) return (
    <Alert variant="danger" className="text-center">
      {error}
    </Alert>
  );

  return (
    <Card style={styles.card}>
      <Card.Body>
        <Button variant="link" onClick={onCancel} className="mb-3 p-0 text-decoration-none">
          <i className="fas fa-arrow-left me-2"></i> Back to Group
        </Button>

        <Card.Title className="mb-4 fw-bold">Edit Group</Card.Title>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Group Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              maxLength="100"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Check
              type="checkbox"
              label="Private Group"
              name="is_private"
              id="is_private"
              checked={formData.is_private}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="d-flex flex-column flex-sm-row gap-3">
            <Button variant="success" type="submit" disabled={saving} style={styles.primaryButton}>
              {saving ? (
                <>
                  <Spinner as="span" animation="border" size="sm" className="me-2" />
                  Saving...
                </>
              ) : 'Save Changes'}
            </Button>
            <Button variant="outline-secondary" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

GroupEdit.propTypes = {
  user: PropTypes.object,
  groupId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};