import { pool } from "../config/connectDB.js";

// Store active simulations
const activeSimulations = new Map();

// START /api/v1/simulation/start-trip
const startTripSimulation = async (req, res) => {
  const { scheduleId } = req.body;
  
  if (!scheduleId) {
    return res.status(400).json({ errorCode: 1, message: 'Thiếu scheduleId' });
  }

  try {
    // Get schedule and route info
    const [schedules] = await pool.query(`
      SELECT s.*, r.Id as routeId, r.MaTuyen, r.Name as routeName
      FROM schedules s
      INNER JOIN routes r ON s.route_id = r.Id
      WHERE s.id = ?
    `, [scheduleId]);

    if (schedules.length === 0) {
      return res.status(404).json({ errorCode: 2, message: 'Không tìm thấy schedule' });
    }

    const schedule = schedules[0];
    const routeId = schedule.routeId;

    // Get pickup points for this route (ordered)
    const [pickupPoints] = await pool.query(`
      SELECT 
        p.Id,
        p.PointOrder,
        p.Latitude,
        p.Longitude,
        p.DiaChi
      FROM pickuppoints p
      WHERE p.RouteId = ?
      ORDER BY p.PointOrder ASC
    `, [routeId]);

    if (pickupPoints.length === 0) {
      return res.status(400).json({ errorCode: 3, message: 'Tuyến không có điểm đón nào' });
    }

    // Get route coordinates using Mapbox Directions API
    // Split into chunks of 25 points (Mapbox limit)
    const mapboxToken = 'pk.eyJ1IjoibGlraWpvb25nMSIsImEiOiJjbWg5eXlyN24wMDFlMnJuNmIxY2kxOTc2In0.KDmPuA2vvdV6G28mpeK4KA';
    const chunkSize = 25;
    const chunks = [];
    
    for (let i = 0; i < pickupPoints.length; i += chunkSize - 1) {
      const chunk = pickupPoints.slice(i, i + chunkSize);
      if (chunk.length >= 2) {
        chunks.push(chunk);
      }
    }

    console.log(`📦 Split ${pickupPoints.length} points into ${chunks.length} chunks`);

    let allCoordinates = [];

    // Fetch route for each chunk
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const coordinates = chunk.map(p => `${p.Longitude},${p.Latitude}`).join(';');
      const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&access_token=${mapboxToken}`;

      console.log(`🚗 Fetching route for chunk ${i + 1}/${chunks.length} (${chunk.length} points)`);

      const response = await fetch(directionsUrl);
      const directionsData = await response.json();

      if (directionsData.code === 'Ok' && directionsData.routes && directionsData.routes.length > 0) {
        const chunkCoords = directionsData.routes[0].geometry.coordinates;
        allCoordinates = allCoordinates.concat(chunkCoords);
        console.log(`✅ Got ${chunkCoords.length} coordinates for chunk ${i + 1}`);
      } else {
        console.warn(`⚠️ Failed to get route for chunk ${i + 1}, using straight lines`);
        allCoordinates = allCoordinates.concat(chunk.map(p => [p.Longitude, p.Latitude]));
      }
    }

    if (allCoordinates.length === 0) {
      return res.status(400).json({ errorCode: 4, message: 'Không thể tính toán route' });
    }

    const routeGeometry = allCoordinates;
    console.log(`✅ Total route coordinates: ${routeGeometry.length}`);
    
    // Update schedule status to "Đang chạy"
    await pool.query('UPDATE schedules SET status = ? WHERE id = ?', ['Đang chạy', scheduleId]);
    
    // Update route status
    await pool.query('UPDATE routes SET Status = ? WHERE Id = ?', ['Đang chạy', routeId]);

    // Start simulation
    startSimulation(scheduleId, routeId, routeGeometry, pickupPoints);

    return res.status(200).json({
      errorCode: 0,
      message: 'Đã bắt đầu hành trình (simulation)',
      data: {
        scheduleId,
        routeId,
        totalPoints: routeGeometry.length,
        pickupPoints: pickupPoints.length
      }
    });

  } catch (error) {
    console.error('Error starting trip simulation:', error);
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server: ' + error.message });
  }
};

// STOP /api/v1/simulation/stop-trip
const stopTripSimulation = async (req, res) => {
  const { scheduleId } = req.body;

  if (!scheduleId) {
    return res.status(400).json({ errorCode: 1, message: 'Thiếu scheduleId' });
  }

  if (activeSimulations.has(scheduleId)) {
    const simulation = activeSimulations.get(scheduleId);
    clearInterval(simulation.intervalId);
    activeSimulations.delete(scheduleId);

    try {
      // Update schedule status
      await pool.query('UPDATE schedules SET status = ? WHERE id = ?', ['Hoàn thành', scheduleId]);
      
      // Get route ID and update route status
      const [schedules] = await pool.query('SELECT route_id FROM schedules WHERE id = ?', [scheduleId]);
      if (schedules.length > 0) {
        await pool.query('UPDATE routes SET Status = ?, currentLatitude = NULL, currentLongitude = NULL WHERE Id = ?', 
          ['Đã hoàn thành', schedules[0].route_id]);
      }

      return res.status(200).json({
        errorCode: 0,
        message: 'Đã dừng hành trình'
      });
    } catch (error) {
      console.error('Error stopping trip:', error);
      return res.status(500).json({ errorCode: -1, message: 'Lỗi server' });
    }
  } else {
    return res.status(404).json({ errorCode: 2, message: 'Không tìm thấy simulation đang chạy' });
  }
};

// SIMULATION LOGIC
const startSimulation = (scheduleId, routeId, routeCoordinates, pickupPoints) => {
  let currentIndex = 0;
  const totalPoints = routeCoordinates.length;
  const updateInterval = 2000; // Update every 2 seconds
  const stepsPerUpdate = Math.max(1, Math.floor(totalPoints / 5000)); // Even smaller steps = much slower movement

  console.log(`🚍 Starting simulation for schedule ${scheduleId}, route ${routeId}`);
  console.log(`   Total coordinates: ${totalPoints}, Steps per update: ${stepsPerUpdate}`);

  const intervalId = setInterval(async () => {
    if (currentIndex >= totalPoints) {
      // Simulation complete
      console.log(`✅ Simulation complete for schedule ${scheduleId}`);
      clearInterval(intervalId);
      activeSimulations.delete(scheduleId);

      // Update final status
      try {
        await pool.query('UPDATE schedules SET status = ?, end_time = NOW() WHERE id = ?', ['Hoàn thành', scheduleId]);
        await pool.query('UPDATE routes SET Status = ?, currentLatitude = NULL, currentLongitude = NULL WHERE Id = ?', 
          ['Đã hoàn thành', routeId]);
      } catch (error) {
        console.error('Error updating final status:', error);
      }
      return;
    }

    const [lng, lat] = routeCoordinates[currentIndex];

    // Update current position in database
    try {
      await pool.query(
        'UPDATE routes SET currentLatitude = ?, currentLongitude = ?, lastUpdated = NOW() WHERE Id = ?',
        [lat, lng, routeId]
      );

      // Check if near any pickup point (auto-update status)
      for (const point of pickupPoints) {
        const distance = calculateDistance(lat, lng, point.Latitude, point.Longitude);
        if (distance < 0.05) { // Within 50 meters
          // Auto-mark as picked up
          await pool.query(
            'UPDATE pickuppoints SET TinhTrangDon = ?, ThoiGianDonThucTe = NOW() WHERE Id = ? AND TinhTrangDon = ?',
            ['Đã đón', point.Id, 'Chưa đón']
          );
        }
      }

      console.log(`🚗 Updated position: [${lat}, ${lng}] (${currentIndex}/${totalPoints})`);
    } catch (error) {
      console.error('Error updating position:', error);
    }

    currentIndex += stepsPerUpdate;
  }, updateInterval);

  activeSimulations.set(scheduleId, {
    intervalId,
    routeId,
    startTime: new Date(),
    currentIndex: 0,
    totalPoints
  });
};

// Helper: Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};

// GET active simulations
const getActiveSimulations = (req, res) => {
  const simulations = Array.from(activeSimulations.entries()).map(([scheduleId, data]) => ({
    scheduleId,
    routeId: data.routeId,
    startTime: data.startTime,
    progress: `${data.currentIndex}/${data.totalPoints}`,
    percentage: ((data.currentIndex / data.totalPoints) * 100).toFixed(2) + '%'
  }));

  return res.status(200).json({
    errorCode: 0,
    message: 'OK',
    data: simulations,
    total: simulations.length
  });
};

export {
  startTripSimulation,
  stopTripSimulation,
  getActiveSimulations
};
