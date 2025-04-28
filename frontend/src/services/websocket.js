export class NotificationWebSocket {
  constructor(userId, onNotification) {
    this.wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    this.wsUrl = `${this.wsProtocol}//${window.location.host}/ws/notifications/`;
    this.userId = userId;
    this.onNotification = onNotification;
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    this.socket = new WebSocket(this.wsUrl);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      // Authenticate the connection
      this.socket.send(JSON.stringify({
        type: 'authenticate',
        user_id: this.userId
      }));
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'notification') {
        this.onNotification(data);
      }
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket disconnected:', event);
      if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
        const delay = Math.min(1000 * (2 ** this.reconnectAttempts), 30000);
        console.log(`Reconnecting in ${delay}ms...`);
        setTimeout(() => {
          this.reconnectAttempts++;
          this.connect();
        }, delay);
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}