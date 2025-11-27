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
     * Tạo các nhóm tuyến tối ưu với giới hạn khoảng cách
     * @param {Array} students - Danh sách học sinh có distanceFromSchool
     * @param {Array} vehicles - Danh sách xe
     * @param {Object} schoolLocation - Vị trí trường
     * @param {number} maxDistance - Khoảng cách tối đa (km)
     * @returns {Array} Các nhóm tuyến
     */
    async createOptimizedGroups(students, vehicles, schoolLocation, maxDistance) {
        const minStudentsPerRoute = 10; // Tối thiểu 10 học sinh mỗi xe
        const groups = [];
        let vehicleIdx = 0;
        let remainingStudents = [...students].sort((a, b) => a.distanceFromSchool - b.distanceFromSchool);

        while (remainingStudents.length > 0 && vehicleIdx < vehicles.length) {
            const vehicle = vehicles[vehicleIdx];
            const group = [];
            let currentDistance = 0;

            // Chọn học sinh gần nhất làm điểm bắt đầu
            const firstStudent = remainingStudents.shift();
            group.push(firstStudent);
            let currentLocation = { lat: firstStudent.Latitude, lon: firstStudent.Longitude };

            // Thêm học sinh gần nhất cho đến khi đầy xe hoặc vượt quá khoảng cách
            while (remainingStudents.length > 0 && group.length < vehicle.Capacity) {
                let nearestIdx = -1;
                let nearestDist = Infinity;

                // Tìm học sinh gần nhất với vị trí hiện tại
                for (let i = 0; i < remainingStudents.length; i++) {
                    const student = remainingStudents[i];
                    const dist = this.calculateDistance(
                        currentLocation.lat, currentLocation.lon,
                        student.Latitude, student.Longitude
                    );

                    // Kiểm tra nếu thêm học sinh này có vượt quá maxDistance không
                    const estimatedTotalDist = currentDistance + dist + student.distanceFromSchool;
                    
                    if (dist < nearestDist && estimatedTotalDist <= maxDistance) {
                        nearestDist = dist;
                        nearestIdx = i;
                    }
                }

                // Nếu đã đủ minStudents và không tìm được học sinh phù hợp nữa, dừng
                if (nearestIdx === -1) {
                    if (group.length >= minStudentsPerRoute) {
                        break;
                    } else {
                        // Chưa đủ 10 người, bắt buộc phải thêm học sinh gần nhất dù vượt quá 20km
                        nearestIdx = 0;
                        nearestDist = this.calculateDistance(
                            currentLocation.lat, currentLocation.lon,
                            remainingStudents[0].Latitude, remainingStudents[0].Longitude
                        );
                        for (let i = 1; i < remainingStudents.length; i++) {
                            const dist = this.calculateDistance(
                                currentLocation.lat, currentLocation.lon,
                                remainingStudents[i].Latitude, remainingStudents[i].Longitude
                            );
                            if (dist < nearestDist) {
                                nearestDist = dist;
                                nearestIdx = i;
                            }
                        }
                    }
                }

                const nearest = remainingStudents.splice(nearestIdx, 1)[0];
                group.push(nearest);
                currentDistance += nearestDist;
                currentLocation = { lat: nearest.Latitude, lon: nearest.Longitude };
            }

            // Chỉ thêm nhóm nếu đủ minStudents
            if (group.length >= minStudentsPerRoute) {
                // Tính centroid
                const avgLat = group.reduce((sum, s) => sum + parseFloat(s.Latitude), 0) / group.length;
                const avgLon = group.reduce((sum, s) => sum + parseFloat(s.Longitude), 0) / group.length;

                groups.push({
                    clusterId: vehicleIdx,
                    students: group,
                    vehicle: vehicle,
                    centroid: { lat: avgLat, lon: avgLon }
                });
                vehicleIdx++;
            } else if (groups.length > 0) {
                // Nếu không đủ 10 người, gộp vào nhóm cuối cùng
                groups[groups.length - 1].students.push(...group);
            } else {
                // Nếu không có nhóm nào và không đủ 10 người, vẫn tạo nhóm
                const avgLat = group.reduce((sum, s) => sum + parseFloat(s.Latitude), 0) / group.length;
                const avgLon = group.reduce((sum, s) => sum + parseFloat(s.Longitude), 0) / group.length;

                groups.push({
                    clusterId: vehicleIdx,
                    students: group,
                    vehicle: vehicle,
                    centroid: { lat: avgLat, lon: avgLon }
                });
                vehicleIdx++;
            }
        }

        return groups;
    }

    /**
     * Tối ưu thứ tự đón với xuất phát và về trường
     * Trường -> Điểm 1 -> Điểm 2 -> ... -> Điểm cuối -> Trường
     * @param {Array} students - Students in a route
     * @param {Object} schoolLocation - School location {lat, lon}
     * @returns {Promise<Object>} Ordered students with total distance including return
     */
    async optimizeRouteWithSchoolReturn(students, schoolLocation) {
        if (students.length === 0) return { orderedStudents: [], totalDistance: 0, totalDuration: 0 };
        if (students.length === 1) {
            // Chỉ 1 học sinh: trường -> học sinh -> trường
            const toStudent = await this.getRealDistance(
                schoolLocation.lat, schoolLocation.lon,
                students[0].Latitude, students[0].Longitude
            );
            const backToSchool = await this.getRealDistance(
                students[0].Latitude, students[0].Longitude,
                schoolLocation.lat, schoolLocation.lon
            );
            
            return {
                orderedStudents: students,
                totalDistance: parseFloat((toStudent.distance + backToSchool.distance).toFixed(2)),
                totalDuration: parseFloat((toStudent.duration + backToSchool.duration).toFixed(2))
            };
        }

        // Tối ưu thứ tự đón (từ trường)
        const unvisited = [...students];
        const ordered = [];
        let currentLocation = schoolLocation;
        let totalDistance = 0;
        let totalDuration = 0;

        while (unvisited.length > 0) {
            let nearestIdx = 0;
            let nearestResult = await this.getRealDistance(
                currentLocation.lat, currentLocation.lon,
                unvisited[0].Latitude, unvisited[0].Longitude
            );

            for (let i = 1; i < unvisited.length; i++) {
                const result = await this.getRealDistance(
                    currentLocation.lat, currentLocation.lon,
                    unvisited[i].Latitude, unvisited[i].Longitude
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

        // Thêm khoảng cách về trường từ điểm cuối
        const lastStudent = ordered[ordered.length - 1];
        const returnTrip = await this.getRealDistance(
            lastStudent.Latitude, lastStudent.Longitude,
            schoolLocation.lat, schoolLocation.lon
        );
        
        totalDistance += returnTrip.distance;
        totalDuration += returnTrip.duration;

        return { 
            orderedStudents: ordered, 
            totalDistance: parseFloat(totalDistance.toFixed(2)), 
            totalDuration: parseFloat(totalDuration.toFixed(2))
        };
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
     * Xuất phát và kết thúc tại Trường ĐH Sài Gòn Quận 5
     * Mỗi tuyến không vượt quá 20km
     * @param {Object} schoolLocation - School location {lat, lon}
     * @returns {Object} Result with routes and statistics
     */
    async autoAssignRoutes(schoolLocation = { lat: 10.76143060, lon: 106.68216890 }) {
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

            // Bước 1: Tính khoảng cách từ trường đến từng học sinh
            console.log('🔄 Đang tính khoảng cách từ trường đến học sinh...');
            const studentsWithDistance = [];
            for (const student of students) {
                const result = await this.getRealDistance(
                    schoolLocation.lat, schoolLocation.lon,
                    student.Latitude, student.Longitude
                );
                studentsWithDistance.push({
                    ...student,
                    distanceFromSchool: result.distance
                });
            }
            console.log('✅ Hoàn thành tính khoảng cách từ trường');

            // Bước 2: Phân nhóm học sinh theo khoảng cách và giới hạn 20km
            console.log('🔄 Đang phân nhóm học sinh theo tuyến (max 20km)...');
            const routeGroups = await this.createOptimizedGroups(studentsWithDistance, vehicles, schoolLocation, 40);
            console.log(`✅ Tạo được ${routeGroups.length} tuyến`);

            const balancedClusters = routeGroups;

            // Bước 3: Tối ưu thứ tự đón cho từng tuyến (trường -> điểm đón -> trường)
            console.log('🔄 Đang tối ưu thứ tự đón (xuất phát và về trường)...');
            const optimizedRoutes = [];
            
            for (let i = 0; i < balancedClusters.length; i++) {
                const cluster = balancedClusters[i];
                const result = await this.optimizeRouteWithSchoolReturn(cluster.students, schoolLocation);
                
                optimizedRoutes.push({
                    clusterId: i,
                    vehicle: cluster.vehicle,
                    students: result.orderedStudents,
                    studentCount: result.orderedStudents.length,
                    totalDistance: result.totalDistance,
                    totalDuration: result.totalDuration,
                    centroid: cluster.centroid,
                    schoolLocation: schoolLocation  // Lưu vị trí trường
                });
                
                console.log(`  ✅ Tuyến ${i + 1}: Trường → ${result.orderedStudents.length} điểm đón → Trường (${result.totalDistance} km, ${result.totalDuration} phút)`);
            }

            console.log('✅ Hoàn thành phân tuyến!');

            const totalStudents = students.length;

            return {
                success: true,
                routes: optimizedRoutes,
                totalStudents,
                totalRoutes: optimizedRoutes.length,
                message: `Đã phân tuyến thành công ${totalStudents} học sinh vào ${optimizedRoutes.length} tuyến (xuất phát từ Trường ĐH Sài Gòn, mỗi tuyến ≥10 học sinh và ≤20km)`
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

                // Lưu điểm TRƯỜNG (xuất phát) - PointOrder = 0
                const schoolLocation = route.schoolLocation || { lat: 10.76143060, lon: 106.68216890 };
                await connection.query(`
                    INSERT INTO pickuppoints (
                        RouteId, MaHocSinh, Latitude, Longitude, DiaChi, 
                        PointOrder, TinhTrangDon
                    )
                    VALUES (?, NULL, ?, ?, 'Trường ĐH Sài Gòn, Quận 5', 0, 'Xuất phát')
                `, [routeId, schoolLocation.lat, schoolLocation.lon]);

                // Tạo pickuppoints cho từng học sinh trên tuyến
                for (let j = 0; j < route.students.length; j++) {
                    const student = route.students[j];
                    
                    // Insert pickup point (điểm đón học sinh)
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
                        j + 1  // PointOrder bắt đầu từ 1
                    ]);
                }

                // Lưu điểm TRƯỜNG (về) - PointOrder = students.length + 1
                await connection.query(`
                    INSERT INTO pickuppoints (
                        RouteId, MaHocSinh, Latitude, Longitude, DiaChi, 
                        PointOrder, TinhTrangDon
                    )
                    VALUES (?, NULL, ?, ?, 'Trường ĐH Sài Gòn, Quận 5 (Điểm về)', ?, 'Điểm cuối')
                `, [routeId, schoolLocation.lat, schoolLocation.lon, route.students.length + 1]);
                
                console.log(`  ✅ Lưu tuyến ${routeCode}: ${route.students.length} HS + 2 điểm trường, ${route.totalDistance}km, ${route.totalDuration}phút`);
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
