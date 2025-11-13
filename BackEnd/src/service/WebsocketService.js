import { WebSocketServer } from 'ws';

let wss; // Biến lưu trữ WebSocket Server

const initWebSocket = (server) => {
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('✅ Client (Admin Map) đã kết nối WebSocket.');

    ws.on('close', () => {
      console.log('❌ Client (Admin Map) đã ngắt kết nối WebSocket.');
    });

    ws.on('error', (error) => {
      console.error('Lỗi WebSocket:', error);
    });
  });

  console.log('✅ WebSocket Service đã sẵn sàng.');
};

// Hàm gửi dữ liệu vị trí đến TẤT CẢ các client (admin) đang kết nối
const broadcastLocation = (locationData) => {
  if (!wss) {
    console.log("WS chưa khởi tạo.");
    return;
  }

  const data = JSON.stringify(locationData);

  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // 1 = WebSocket.OPEN
      client.send(data);
    }
  });
};

export { initWebSocket, broadcastLocation };