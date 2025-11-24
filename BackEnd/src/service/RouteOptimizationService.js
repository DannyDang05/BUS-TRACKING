// Service for automatic route optimization using KNN algorithm
import { pool } from '../config/connectDB.js';
import axios from 'axios';

class RouteOptimizationService {
    /**
     * Calculate distance between two geographic points using Haversine formula (fallback only)
     * @param {number} lat1 - Latitude of point 1
     * @param {number} lon1 - Longitude of point 1
     * @param {number} lat2 - Latitude of point 2
     * @param {number} lon2 - Longitude of point 2
     * @returns {number} Distance in kilometers
     */
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    toRad(degrees) {
        return degrees * Math.PI / 180;
    }

    /**
     * Tính khoảng cách THỰC TẾ theo đường đi (như Grab) sử dụng OSRM API
     * @param {number} lat1 - Latitude điểm 1
     * @param {number} lon1 - Longitude điểm 1
     * @param {number} lat2 - Latitude điểm 2
     * @param {number} lon2 - Longitude điểm 2
     * @returns {Promise<Object>} {distance: km, duration: phút}
     */
    async getRealDistance(lat1, lon1, lat2, lon2) {
        try {
            // OSRM API (miễn phí, tính theo đường đi thực tế)
            const url = `http://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false`;
            const response = await axios.get(url, { timeout: 5000 });
            
            if (response.data && response.data.routes && response.data.routes.length > 0) {
                const route = response.data.routes[0];
                return {
                    distance: route.distance / 1000, // Chuyển m -> km
                    duration: route.duration / 60,   // Chuyển s -> phút
                    isReal: true
                };
            }
        } catch (error) {
            console.warn(`OSRM API error for (${lat1},${lon1}) -> (${lat2},${lon2}):`, error.message);
        }
        
        // Fallback về Haversine nếu API lỗi
        const distance = this.calculateDistance(lat1, lon1, lat2, lon2);
        return {
            distance: distance * 1.3, // Nhân hệ số 1.3 để gần với đường thực hơn
            duration: (distance * 1.3 / 40) * 60, // Ước lượng 40km/h
            isReal: false
        };
    }

    /**
     * Tính ma trận khoảng cách thực tế giữa tất cả các điểm
     * @param {Array} students - Danh sách học sinh
     * @returns {Promise<Array>} Ma trận khoảng cách [n][n]
     */
    async calculateRealDistanceMatrix(students) {
        const n = students.length;
        const distanceMatrix = Array(n).fill(null).map(() => Array(n).fill(0));
        const durationMatrix = Array(n).fill(null).map(() => Array(n).fill(0));
        
        console.log(`Đang tính ma trận khoảng cách thực tế cho ${n} học sinh...`);
        
        // Tính khoảng cách giữa mọi cặp học sinh
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                const result = await this.getRealDistance(
                    students[i].Latitude, students[i].Longitude,
                    students[j].Latitude, students[j].Longitude
                );
                distanceMatrix[i][j] = result.distance;
                distanceMatrix[j][i] = result.distance; // Ma trận đối xứng
                durationMatrix[i][j] = result.duration;
                durationMatrix[j][i] = result.duration;
            }
        }
        
        return { distanceMatrix, durationMatrix };
    }

    /**
     * KNN (K-Nearest Neighbors) clustering với khoảng cách THỰC TẾ
     * Phân nhóm học sinh dựa trên khoảng cách đường đi, không phải đường chim bay
     * @param {Array} students - Array of students with Latitude and Longitude
     * @param {Array} distanceMatrix - Ma trận khoảng cách thực tế [n][n]
     * @param {number} k - Number of clusters (routes)
     * @returns {Array} Array of clusters
     */
    async knnClustering(students, distanceMatrix, k) {
        if (students.length === 0) return [];
        if (students.length <= k) {
            // Mỗi học sinh 1 cluster
            return students.map((student, idx) => ({
                clusterId: idx,
                students: [student],
                centroid: { lat: student.Latitude, lon: student.Longitude }
            }));
        }

        // Bước 1: Chọn k điểm trung tâm ban đầu (phân tán nhất)
        const centerIndices = this.selectInitialCenters(distanceMatrix, k);
        
        // Bước 2: Gán mỗi học sinh vào cluster gần nhất (theo khoảng cách thực)
        const clusters = Array(k).fill(null).map(() => []);
        
        for (let i = 0; i < students.length; i++) {
            if (centerIndices.includes(i)) {
                // Điểm trung tâm
                const clusterIdx = centerIndices.indexOf(i);
                clusters[clusterIdx].push(students[i]);
            } else {
                // Tìm cluster gần nhất
                let minDist = Infinity;
                let closestCluster = 0;
                
                for (let j = 0; j < centerIndices.length; j++) {
                    const centerIdx = centerIndices[j];
                    const dist = distanceMatrix[i][centerIdx];
                    
                    if (dist < minDist) {
                        minDist = dist;
                        closestCluster = j;
                    }
                }
                
                clusters[closestCluster].push(students[i]);
            }
        }

        // Tính centroid cho mỗi cluster
        return clusters.map((cluster, idx) => {
            const avgLat = cluster.reduce((sum, s) => sum + parseFloat(s.Latitude), 0) / cluster.length;
            const avgLon = cluster.reduce((sum, s) => sum + parseFloat(s.Longitude), 0) / cluster.length;
            
            return {
                clusterId: idx,
                students: cluster,
                centroid: { lat: avgLat, lon: avgLon }
            };
        });
    }

    /**
     * Chọn k điểm trung tâm ban đầu sao cho phân tán nhất (k-means++ style)
     * @param {Array} distanceMatrix - Ma trận khoảng cách
     * @param {number} k - Số cluster
     * @returns {Array} Indices of center points
     */
    selectInitialCenters(distanceMatrix, k) {
        const n = distanceMatrix.length;
        const centers = [];
        
        // Chọn điểm đầu tiên ngẫu nhiên
        centers.push(Math.floor(Math.random() * n));
        
        // Chọn k-1 điểm còn lại
        for (let i = 1; i < k; i++) {
            const distances = [];
            
            // Tính khoảng cách từ mỗi điểm đến center gần nhất
            for (let j = 0; j < n; j++) {
                if (centers.includes(j)) {
                    distances.push(0); // Điểm đã là center
                } else {
                    const minDist = Math.min(...centers.map(c => distanceMatrix[j][c]));
                    distances.push(minDist);
                }
            }
            
            // Chọn điểm có khoảng cách lớn nhất
            const maxDistIdx = distances.indexOf(Math.max(...distances));
            centers.push(maxDistIdx);
        }
        
        return centers;
    }

    /**
     * Tối ưu thứ tự đón học sinh sử dụng Nearest Neighbor với khoảng cách THỰC
     * @param {Array} students - Students in a cluster
     * @param {Object} schoolLocation - School location {lat, lon}
     * @returns {Promise<Array>} Ordered list of students with real distance
     */
    async optimizeRouteOrder(students, schoolLocation) {
        if (students.length === 0) return [];
        if (students.length === 1) return students;

        const unvisited = [...students];
        const ordered = [];
        let currentLocation = schoolLocation;
        let totalDistance = 0;
        let totalDuration = 0;

        while (unvisited.length > 0) {
            // Tìm học sinh GẦN NHẤT theo khoảng cách thực tế
            let nearestIdx = 0;
            let nearestResult = await this.getRealDistance(
                currentLocation.lat,
                currentLocation.lon,
                unvisited[0].Latitude,
                unvisited[0].Longitude
            );

            for (let i = 1; i < unvisited.length; i++) {
                const result = await this.getRealDistance(
                    currentLocation.lat,
                    currentLocation.lon,
                    unvisited[i].Latitude,
                    unvisited[i].Longitude
                );
                
                if (result.distance < nearestResult.distance) {
                    nearestResult = result;
                    nearestIdx = i;
                }
            }

            const nearest = unvisited.splice(nearestIdx, 1)[0];
            ordered.push(nearest);
            totalDistance += nearestResult.distance;
            totalDuration += nearestResult.duration;
            currentLocation = { lat: nearest.Latitude, lon: nearest.Longitude };
        }

        return { 
            orderedStudents: ordered, 
            totalDistance: parseFloat(totalDistance.toFixed(2)), 
            totalDuration: parseFloat(totalDuration.toFixed(2))
        };
    }

    /**
     * Automatically assign students to routes using KNN with REAL DISTANCE (như Grab)
     * CHỈ phân tuyến cho học sinh có TrangThaiHocTap = 'Đang học'
     * @param {Object} schoolLocation - School location {lat, lon}
     * @returns {Object} Result with routes and statistics
     */
    async autoAssignRoutes(schoolLocation = { lat: 10.7769, lon: 106.7009 }) {
        try {
            console.log('🚀 Bắt đầu phân tuyến tự động với KNN + khoảng cách thực tế...');
            
            // CHỈ LẤY học sinh ĐANG HỌC và có đầy đủ tọa độ
            const [students] = await pool.query(`
                SELECT MaHocSinh, HoTen, Lop, Latitude, Longitude, DiaChi, MaPhuHuynh
                FROM hocsinh
                WHERE TrangThaiHocTap = 'Đang học'
                  AND Latitude IS NOT NULL 
                  AND Longitude IS NOT NULL
                ORDER BY MaHocSinh
            `);

            if (students.length === 0) {
                return { success: false, message: 'Không có học sinh đang học hoặc thiếu tọa độ địa lý' };
            }

            console.log(`✅ Tìm thấy ${students.length} học sinh đang học`);

            // Get available vehicles (IsActive = 1)
            const [vehicles] = await pool.query(`
                SELECT v.Id, v.LicensePlate, v.Model, v.Capacity
                FROM vehicles v
                WHERE v.IsActive = 1
                ORDER BY v.Capacity DESC
            `);

            if (vehicles.length === 0) {
                return { success: false, message: 'Không có xe nào khả dụng' };
            }

            console.log(`✅ Tìm thấy ${vehicles.length} xe khả dụng`);

            // Calculate number of routes needed
            const totalStudents = students.length;
            let totalCapacity = 0;
            let routesNeeded = 0;
            
            for (const vehicle of vehicles) {
                totalCapacity += vehicle.Capacity;
                routesNeeded++;
                if (totalCapacity >= totalStudents) break;
            }

            if (totalCapacity < totalStudents) {
                return {
                    success: false,
                    message: `Không đủ xe. Cần ${totalStudents} chỗ nhưng chỉ có ${totalCapacity} chỗ`
                };
            }

            console.log(`📊 Cần ${routesNeeded} tuyến để chở ${totalStudents} học sinh`);

            // Bước 1: Tính ma trận khoảng cách THỰC TẾ
            console.log('🔄 Đang tính ma trận khoảng cách thực tế...');
            const { distanceMatrix, durationMatrix } = await this.calculateRealDistanceMatrix(students);
            console.log('✅ Hoàn thành tính ma trận khoảng cách');

            // Bước 2: KNN Clustering với khoảng cách thực
            console.log('🔄 Đang phân cụm KNN...');
            const clusters = await this.knnClustering(students, distanceMatrix, routesNeeded);
            console.log('✅ Hoàn thành phân cụm KNN');

            // Bước 3: Cân bằng clusters theo sức chứa xe
            const balancedClusters = this.balanceClusters(clusters, vehicles);

            // Bước 4: Tối ưu thứ tự đón cho từng tuyến
            console.log('🔄 Đang tối ưu thứ tự đón...');
            const optimizedRoutes = [];
            
            for (let i = 0; i < balancedClusters.length; i++) {
                const cluster = balancedClusters[i];
                const result = await this.optimizeRouteOrder(cluster.students, schoolLocation);
                
                optimizedRoutes.push({
                    clusterId: i,
                    vehicle: cluster.vehicle,
                    students: result.orderedStudents,
                    studentCount: result.orderedStudents.length,
                    totalDistance: result.totalDistance,
                    totalDuration: result.totalDuration,
                    centroid: cluster.centroid
                });
                
                console.log(`  ✅ Tuyến ${i + 1}: ${result.orderedStudents.length} HS, ${result.totalDistance} km, ${result.totalDuration} phút`);
            }

            console.log('✅ Hoàn thành phân tuyến!');

            return {
                success: true,
                routes: optimizedRoutes,
                totalStudents,
                totalRoutes: routesNeeded,
                message: `Đã phân tuyến thành công ${totalStudents} học sinh vào ${routesNeeded} tuyến với khoảng cách thực tế`
            };

        } catch (error) {
            console.error('❌ Error in autoAssignRoutes:', error);
            return { success: false, message: error.message };
        }
    }

    /**
     * Balance clusters based on vehicle capacity
     */
    balanceClusters(clusters, vehicles) {
        const balanced = [];
        let vehicleIdx = 0;

        for (let cluster of clusters) {
            if (vehicleIdx >= vehicles.length) break;

            const vehicle = vehicles[vehicleIdx];
            const capacity = vehicle.Capacity;

            if (cluster.students.length <= capacity) {
                // Cluster fits in vehicle
                balanced.push({
                    ...cluster,
                    vehicle
                });
                vehicleIdx++;
            } else {
                // Split cluster into multiple vehicles
                let remaining = [...cluster.students];
                while (remaining.length > 0 && vehicleIdx < vehicles.length) {
                    const currentVehicle = vehicles[vehicleIdx];
                    const batch = remaining.splice(0, currentVehicle.Capacity);
                    balanced.push({
                        clusterId: cluster.clusterId,
                        students: batch,
                        centroid: cluster.centroid,
                        vehicle: currentVehicle
                    });
                    vehicleIdx++;
                }
            }
        }

        return balanced;
    }

    /**
     * Save optimized routes to database (với TotalDistance và EstimatedTime THỰC TẾ)
     * LOGIC MỚI: Xóa routes + pickuppoints cũ, tạo mới hoàn toàn
     * @param {Array} routes - Array of optimized routes
     * @returns {Object} Result
     */
    async saveRoutesToDB(routes) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            console.log('🔄 Đang lưu routes vào database...');

            // XÓA TẤT CẢ routes tự động cũ (routes có MaTuyen bắt đầu bằng 'AUTO')
            await connection.query(`DELETE FROM routes WHERE MaTuyen LIKE 'AUTO%'`);

            // Track created route IDs for schedule creation
            const createdRouteIds = [];

            // TẠO MỚI routes và pickuppoints
            for (let i = 0; i < routes.length; i++) {
                const route = routes[i];
                const routeName = `Tuyến tự động ${i + 1}`;
                const routeCode = `AUTO${String(i + 1).padStart(3, '0')}`;

                // Tạo route mới với TotalDistance và EstimatedTime THỰC TẾ
                const [routeResult] = await connection.query(`
                    INSERT INTO routes (MaTuyen, Name, VehicleId, Status, TotalDistance, EstimatedTime)
                    VALUES (?, ?, ?, 'Chưa chạy', ?, ?)
                `, [
                    routeCode, 
                    routeName, 
                    route.vehicle.Id,
                    route.totalDistance || null,  // Khoảng cách thực tế (km)
                    route.totalDuration || null   // Thời gian thực tế (phút)
                ]);

                const routeId = routeResult.insertId;
                createdRouteIds.push(routeId);  // Save route ID for schedule creation

                // Tạo pickuppoints cho từng học sinh trên tuyến
                for (let j = 0; j < route.students.length; j++) {
                    const student = route.students[j];
                    
                    // Insert pickup point (điểm đón chính là địa chỉ học sinh)
                    await connection.query(`
                        INSERT INTO pickuppoints (
                            RouteId, MaHocSinh, Latitude, Longitude, DiaChi, 
                            PointOrder, TinhTrangDon
                        )
                        VALUES (?, ?, ?, ?, ?, ?, 'Chưa đón')
                    `, [
                        routeId,
                        student.MaHocSinh,
                        student.Latitude,
                        student.Longitude,
                        student.DiaChi,
                        j + 1
                    ]);
                }
                
                console.log(`  ✅ Lưu tuyến ${routeCode}: ${route.students.length} HS, ${route.totalDistance}km, ${route.totalDuration}phút`);
            }

            await connection.commit();
            
            const totalStudents = routes.reduce((sum, r) => sum + r.students.length, 0);
            console.log(`✅ Lưu thành công ${routes.length} tuyến với ${totalStudents} điểm đón`);
            
            return { 
                success: true, 
                routeIds: createdRouteIds,  // Return array of created route IDs
                message: `Đã lưu thành công ${routes.length} tuyến với ${totalStudents} điểm đón (khoảng cách thực tế)` 
            };

        } catch (error) {
            await connection.rollback();
            console.error('❌ Error saving routes:', error);
            return { success: false, message: error.message };
        } finally {
            connection.release();
        }
    }
}

export default new RouteOptimizationService();
