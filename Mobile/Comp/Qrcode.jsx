import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, TextInput, Alert, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../api';

export default function Qrcode() {
    const navigation = useNavigation();
    const [number, onChangeNumber] = useState('');
    const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
    const buttonAnim = useRef(new Animated.Value(1)).current; // Initial value for scale: 1

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    const handleSearch = async () => {
        try {
            Alert.alert('Chargement', 'Recherche de véhicule...');
            console.log(`${api}/vehicule/get/${number}`)
            const response = await fetch(`${api}/vehicule/get/${number}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            // Check if the response is not empty
            const textResponse = await response.text();
            console.log(textResponse)
            if (!textResponse) {
                throw new Error('Empty response from server');
            }

            // Try to parse the response
            const vehicle = JSON.parse(textResponse);
            if (response.ok) {
                Alert.alert('Succès', `Véhicule <${number}> existe`);
                navigation.navigate("Geo", { vehicle });

            } else {
                Alert.alert('Erreur', "Le matricule n'existe pas");
            }
        } catch (error) {
          Alert.alert('Erreur', "Le matricule n'existe pas");
        }
    };

    const handlePressIn = () => {
        Animated.spring(buttonAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(buttonAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={styles.fullScreen}>
            <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
                <Text style={styles.title}>Enter Matricule</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeNumber}
                    value={number}
                    placeholder="Enter Matricule"
                    keyboardType="default"
                />
                <Animated.View style={{ transform: [{ scale: buttonAnim }] }}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSearch}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                    >
                        <Text style={styles.buttonText}>Search</Text>
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    fullScreen: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    container: {
        width: '80%',
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333333',
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#cccccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007BFF',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
