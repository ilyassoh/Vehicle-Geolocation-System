import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import api from '../api';

const Geo = ({ navigation, route }) => {
    const [sts, setSts] = useState(0); // Initialize sts with a default value
    const [positions, setPositions] = useState([]);
    const [errorMsg, setErrorMsg] = useState(null);
    const mountedRef = useRef(true); // Use ref to avoid stale closures
    const [stop, setStop] = useState(true);
    const [status, setStatus] = useState("En_location");
    const statusRef = useRef(status);

    const { vehicle } = route.params;

    const sendLocation = async (latitude, longitude, etat, status) => {
        if (stop) {
            const payload = {
                'latitude': latitude,
                'longitude': longitude,
                'car': vehicle.id,
                'etat': `${etat}`,
                'status': status,
            };
            try {
                const response = await fetch(`${api}/location`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });
                if (!response.ok) {
                    console.log("Problème de GPS");
                    return;
                }
                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleButtonClick = async () => {
        setStop(true);
        try {
            if (!mountedRef.current) {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    throw new Error('Permission to access location was denied');
                }
                mountedRef.current = true;
            }
            if (sts === 0) {
                setSts(1);
                startLocationUpdates();
            } else {
                stopLocationUpdates();
            }
        } catch (error) {
            setErrorMsg(error.message);
        }
    };

    const handleReportButtonClick = () => {
        const newStatus = sts === 1 ? 3 : 1;
        setSts(newStatus);
        const updatedStatus = newStatus === 3 ? "En_Panne" : "En_location";
        setStatus(updatedStatus);
        statusRef.current = updatedStatus;
    };

    const stopLocationUpdates = async () => {
        if (positions.length > 0) {
            sendLocation(
                positions[positions.length - 1].latitude.toFixed(6),
                positions[positions.length - 1].longitude.toFixed(6),
                0,
                statusRef.current
            );
        }

        setStop(false);
        setPositions([]);
        mountedRef.current = false;
        setSts(0);
        await Location.stopLocationUpdatesAsync();
    };

    const startLocationUpdates = async () => {
        try {
            await Location.watchPositionAsync(
                { accuracy: Location.Accuracy.BestForNavigation, distanceInterval: 1 },
                (location) => handleLocationUpdate(location, statusRef.current)
            );
        } catch (error) {
            setErrorMsg(error.message);
        }
    };

    const handleLocationUpdate = (location, currentStatus) => {
        if (mountedRef.current) {
            setPositions((prevPositions) => [...prevPositions, location.coords]);
            sendLocation(
                location.coords.latitude.toFixed(6),
                location.coords.longitude.toFixed(6),
                1,
                currentStatus
            );
        }
    };

    const handleExitButtonClick = async () => {
        await stopLocationUpdates();
        setStop(false);
        navigation.navigate("Qrcode");
    };

    useEffect(() => {
        return () => {
            if (mountedRef.current) {
                stopLocationUpdates();
                console.log("Location updates stopped");
            }
        };
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Vehicle Location</Text>
            </View>
            <View style={styles.mapContainer}>
                <Text style={styles.positionText}>
                    {positions.length > 0 ? `Latitude: ${positions[positions.length - 1].latitude.toFixed(6)}, Longitude: ${positions[positions.length - 1].longitude.toFixed(6)}` : 'No position data available'}
                </Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, { backgroundColor: (sts === 0) ? '#6A5ACD' : (sts === 1) ? '#28B463' : '#B03A2E' }]} onPress={handleButtonClick}>
                    <Ionicons name="location" size={24} color="#E7E7E7" />
                    <Text style={styles.buttonText}>Location</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.reportButton]} onPress={handleReportButtonClick}>
                    <MaterialIcons name="report-problem" size={24} color="#E7E7E7" />
                    <Text style={styles.buttonText}>Report</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.exitButton]} onPress={handleExitButtonClick}>
                    <Ionicons name="exit" size={24} color="#E7E7E7" />
                    <Text style={styles.buttonText}>Exit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        marginBottom: 20,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    mapContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: '#F0F0F0',
        marginBottom: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    positionText: {
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        height: 50,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 20,
    },
    buttonText: {
        color: '#E7E7E7',
        marginLeft: 10,
    },
    reportButton: {
        backgroundColor: '#FF6478',
        marginLeft: 10,
    },
    exitButton: {
        backgroundColor: '#BDBDBD',
        marginLeft: 10,
    },
});

export default Geo;
