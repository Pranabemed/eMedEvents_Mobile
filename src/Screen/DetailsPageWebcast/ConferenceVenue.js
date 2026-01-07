import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Image,Text, ScrollView} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Circle } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colorpath from '../../Themes/Colorpath';
import Imagepath from '../../Themes/Imagepath';
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts';
const MapScreen = ({ webcastdeatils, navto }) => {
    const [region, setRegion] = useState(null);
    const [circleRadius, setCircleRadius] = useState(1000);
    useEffect(() => {
        if (webcastdeatils?.latitude && webcastdeatils?.longitude) {
            const latitude = parseFloat(webcastdeatils.latitude);
            const longitude = parseFloat(webcastdeatils.longitude);
            const latitudeDelta = 0.1; // Initial delta for zoom
            const longitudeDelta = 0.1; // Initial delta for zoom

            setRegion({
                latitude,
                longitude,
                latitudeDelta,
                longitudeDelta,
            });
        }
    }, [webcastdeatils?.latitude, webcastdeatils?.longitude]);
    const resetToInitialLocation = () => {
        if (webcastdeatils?.latitude && webcastdeatils?.longitude) {
            const latitude = parseFloat(webcastdeatils.latitude);
            const longitude = parseFloat(webcastdeatils.longitude);
            const latitudeDelta = 0.1;
            const longitudeDelta = 0.1;

            setRegion({
                latitude,
                longitude,
                latitudeDelta,
                longitudeDelta,
            });
        }
    };
    const zoomIn = () => {
        if (region) {
            const newLatitudeDelta = region.latitudeDelta * 0.8;
            const newLongitudeDelta = region.longitudeDelta * 0.8;
            setRegion({
                ...region,
                latitudeDelta: newLatitudeDelta,
                longitudeDelta: newLongitudeDelta,
            });
        }
    };
    const zoomOut = () => {
        if (region) {
            const newLatitudeDelta = region.latitudeDelta * 1.2;
            const newLongitudeDelta = region.longitudeDelta * 1.2;
            setRegion({
                ...region,
                latitudeDelta: newLatitudeDelta,
                longitudeDelta: newLongitudeDelta,
            });
        }
    };
    const handleRegionChangeComplete = (newRegion, gesture) => {
        if (gesture && !gesture.isGesture) {
            return;
        }
        setRegion(newRegion);
    };

    return (
        <>
        <View style={{ flex: 1 }}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={{ height: '100%', width: '100%', borderRadius: 30 }}
                region={region}
                onRegionChangeComplete={handleRegionChangeComplete}
                showsUserLocation={false}
                showsMyLocationButton={false}
            >
                {region && (
                    <>
                        <Marker coordinate={{ latitude: region?.latitude, longitude: region?.longitude }}>
                            <View style={styles.markerContainer}>
                                <Icon name="place" size={45} color="blue" style={styles.locationIcon} />
                                <Image
                                    source={Imagepath.Logo}
                                    style={styles.customLogo}
                                />
                            </View>
                        </Marker>
                        <Circle
                            center={{
                                latitude: region.latitude,
                                longitude: region.longitude,
                            }}
                            radius={circleRadius}
                            strokeWidth={2}
                            strokeColor="rgba(0, 128, 255, 0.5)"
                            fillColor="rgba(0, 128, 255, 0.2)"
                        />
                    </>
                )}
            </MapView>
            <View style={styles.controlsContainer}>
                <TouchableOpacity style={styles.controlButton} onPress={zoomIn}>
                    <Icon name="add" size={24} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton} onPress={zoomOut}>
                    <Icon name="remove" size={24} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton} onPress={resetToInitialLocation}>
                    <Icon name="my-location" size={24} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton} onPress={() => { navto.navigate("FullscreenMapScreen", { takeMap: { takeMap: webcastdeatils } }) }}>
                    <Icon name="fullscreen" size={24} color="#000" />
                </TouchableOpacity>
            </View>
        </View>
        </>
    );
};

const styles = StyleSheet.create({
    controlsContainer: {
        position: 'absolute',
        bottom: 13,
        right: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 10,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
    },
    controlButton: {
        marginVertical: 5,
    },
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: "relative"
    },
    locationIcon: {
        position: 'absolute',
        zIndex: 1,
    },
    customLogo: {
        width: 38,
        height: 38,
        marginBottom: 10,
        marginLeft: 2,
        resizeMode: 'contain',
        position: "relative",
        zIndex: 2
    },
});

export default MapScreen;
