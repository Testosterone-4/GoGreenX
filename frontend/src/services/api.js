const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const fetchCurrentUser = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  try {
    const response = await fetch('http://127.0.0.1:8000/auth/users/me/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Failed to fetch user');
    return await response.json();
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};

export const fetchPosts = async () => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${API_BASE_URL}/posts/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return await response.json();
};
// Notification-related API functions
export const fetchNotifications = async () => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch notifications');
    return await response.json();
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/mark_as_read/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to mark notification as read');
    return await response.json();
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async () => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/mark_all_as_read/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to mark all notifications as read');
    return await response.json();
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

// Add these to your existing API functions

export const createPost = async (postData) => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('No authentication token found');

  try {
    const response = await fetch(`${API_BASE_URL}/posts/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend validation errors:', errorData);

      // Format validation errors into a readable string
      const errorMessages = [];
      for (const [field, errors] of Object.entries(errorData)) {
        errorMessages.push(`${field}: ${errors.join(', ')}`);
      }

      throw new Error(errorMessages.join(' | ') || 'Invalid post data');
    }

    return await response.json();
  } catch (error) {
    console.error('Network error:', error);
    throw error;
  }
};
export const likePost = async (postId) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/like/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error('Failed to like post');
  return await response.json();
};

export const unlikePost = async (postId) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/unlike/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error('Failed to unlike post');
  return await response.json();
};

export const getPostGroupName = async (postId) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/group_name/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null; // Post doesn't exist
    }
    if (response.status === 204) {
      return null; // Post has no group
    }
    throw new Error('Failed to fetch group name');
  }

  const data = await response.json();
  return data.group_name;
};
// Add these to your existing API functions

export const createComment = async (postId, content) => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('No authentication token found');

  try {
    const response = await fetch(`${API_BASE_URL}/comments/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: content,
        post: postId  // Only send content and post ID
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

export const likeComment = async (commentId) => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}/like/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to like comment');
    }

    return await response.json();
  } catch (error) {
    console.error('Error liking comment:', error);
    throw error;
  }
};

export const unlikeComment = async (commentId) => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}/unlike/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to unlike comment');
    }

    return await response.json();
  } catch (error) {
    console.error('Error unliking comment:', error);
    throw error;
  }
};
export const getPostComments = async (postId) => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch comments');
    return await response.json();
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};
// Group-related API functions
export const createGroup = async (groupData) => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await fetch(`${API_BASE_URL}/groups/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: groupData.name,
        description: groupData.description || '', // Ensure description is sent even if empty
        is_private: groupData.is_private || false // Default to public if not specified
        // creator is automatically set by the backend via request.user
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend validation errors:', errorData);
      throw new Error(errorData.detail || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
};

export const fetchGroups = async () => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${API_BASE_URL}/groups/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error('Failed to fetch groups');
  return await response.json();
};

export const joinGroup = async (groupId) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${API_BASE_URL}/groups/${groupId}/join/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error('Failed to join group');
  return await response.json();
};

export const leaveGroup = async (groupId) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${API_BASE_URL}/groups/${groupId}/leave/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error('Failed to leave group');
  return await response.json();
};

export const addModerator = async (groupId, userId) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${API_BASE_URL}/groups/${groupId}/add_moderator/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ user_id: userId })
  });
  if (!response.ok) throw new Error('Failed to add moderator');
  return await response.json();
};

export const getGroupPosts = async (groupId) => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await fetch(`${API_BASE_URL}/groups/${groupId}/posts/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch posts');
    return await response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};


