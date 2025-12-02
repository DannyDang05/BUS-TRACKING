import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:6969';

let socket = null;

/**
 * Khởi tạo kết nối Socket.IO
 */
export const initSocket = () => {
    if (socket?.connected) {
        console.log('⚠️ Socket already connected');
        return socket;
    }

    socket = io(SOCKET_URL, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000
    });

    socket.on('connect', () => {
        console.log('✅ Socket connected:', socket.id);
    });

    socket.on('disconnect', (reason) => {
        console.log('❌ Socket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error.message);
    });

    return socket;
};

/**
 * Ngắt kết nối Socket.IO
 */
export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
        console.log('🔌 Socket disconnected');
    }
};

/**
 * Lấy socket instance hiện tại
 */
export const getSocket = () => {
    if (!socket) {
        console.warn('⚠️ Socket not initialized, calling initSocket()');
        return initSocket();
    }
    return socket;
};

/**
 * Kiểm tra socket có đang connected không
 */
export const isSocketConnected = () => {
    return socket?.connected || false;
};

// ========== DRIVER FUNCTIONS ==========

/**
 * Driver: Gửi GPS location lên server
 * @param {Object} locationData - { busId, latitude, longitude, speed, heading }
 */
export const emitDriverLocation = (locationData) => {
    const s = getSocket();
    
    const doEmit = () => {
        s.emit('driver:location', locationData);
    };

    // Nếu đã connected, gửi ngay
    if (s.connected) {
        doEmit();
    } else {
        // Nếu chưa connected, chờ connect (hoặc bỏ qua nếu không quan trọng)
        console.warn('⚠️ Socket not connected, location not sent');
        // Có thể queue lại hoặc retry sau
    }
};

// ========== PARENT FUNCTIONS ==========

/**
 * Parent: Subscribe để nhận vị trí xe của con
 * @param {number} busId - ID của xe bus
 * @param {Function} callback - Callback khi nhận location mới
 */
export const subscribeToParentBus = (busId, callback) => {
    const s = getSocket();
    
    const doSubscribe = () => {
        // Gửi lệnh subscribe
        s.emit('parent:subscribe', { busId });
        console.log(`📡 Subscribed to bus ${busId}`);

        // Lắng nghe vị trí xe
        s.on('bus:location', (data) => {
            if (data.busId === busId) {
                callback(data);
            }
        });
    };

    // Nếu đã connected, subscribe ngay
    if (s.connected) {
        doSubscribe();
    } else {
        // Nếu chưa connected, chờ event 'connect'
        console.log('⏳ Socket not connected yet, waiting for connection...');
        s.once('connect', () => {
            console.log('✅ Socket connected, subscribing to bus', busId);
            doSubscribe();
        });
    }
};

/**
 * Parent: Unsubscribe khỏi bus channel
 * @param {number} busId - ID của xe bus
 */
export const unsubscribeFromParentBus = (busId) => {
    const s = getSocket();
    if (!s) return;

    s.emit('parent:unsubscribe', { busId });
    s.off('bus:location');
    console.log(`❌ Unsubscribed from bus ${busId}`);
};

// ========== DRIVER SCHEDULE FUNCTIONS ==========

/**
 * Driver: Subscribe to schedule pickup status updates
 * @param {number} scheduleId - ID của schedule
 * @param {Function} callback - Callback khi nhận update (data: { scheduleId, pickupPointId, status, studentName, pickupAddress })
 */
export const subscribeToScheduleUpdates = (scheduleId, callback) => {
    const s = getSocket();
    
    const doSubscribe = () => {
        // Gửi lệnh subscribe
        s.emit('driver:subscribe:schedule', { scheduleId });
        console.log(`📡 Subscribed to schedule ${scheduleId} updates`);

        // Lắng nghe pickup status updates
        s.on('pickup:status:updated', (data) => {
            if (data.scheduleId === scheduleId) {
                callback(data);
            }
        });
    };

    // Nếu đã connected, subscribe ngay
    if (s.connected) {
        doSubscribe();
    } else {
        // Nếu chưa connected, chờ event 'connect'
        console.log('⏳ Socket not connected yet, waiting for connection...');
        s.once('connect', () => {
            console.log('✅ Socket connected, subscribing to schedule', scheduleId);
            doSubscribe();
        });
    }
};

/**
 * Driver: Unsubscribe from schedule updates
 * @param {number} scheduleId - ID của schedule
 */
export const unsubscribeFromScheduleUpdates = (scheduleId) => {
    const s = getSocket();
    if (!s) return;

    s.emit('driver:unsubscribe:schedule', { scheduleId });
    s.off('pickup:status:updated');
    console.log(`❌ Unsubscribed from schedule ${scheduleId}`);
};

// ========== ADMIN FUNCTIONS (optional) ==========

/**
 * Admin: Subscribe tất cả xe bus
 * @param {Function} callback - Callback khi nhận location
 */
export const subscribeToAllBuses = (callback) => {
    const s = getSocket();
    if (!s || !s.connected) {
        console.error('❌ Socket not connected');
        return;
    }

    s.on('bus:location', callback);
    console.log('📡 Subscribed to all buses');
};

/**
 * Admin: Unsubscribe khỏi tất cả xe
 */
export const unsubscribeFromAllBuses = () => {
    const s = getSocket();
    if (!s) return;

    s.off('bus:location');
    console.log('❌ Unsubscribed from all buses');
};

export default {
    initSocket,
    disconnectSocket,
    getSocket,
    isSocketConnected,
    emitDriverLocation,
    subscribeToParentBus,
    unsubscribeFromParentBus,
    subscribeToScheduleUpdates,
    unsubscribeFromScheduleUpdates,
    subscribeToAllBuses,
    unsubscribeFromAllBuses
};
