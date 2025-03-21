import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import { useGeolocation } from "@uidotdev/usehooks";
import { Map } from "leaflet";
import { RouteDataTest } from '../services/FetchRouteDataTest.ts'
import { FeatureCollection } from "geojson";
//import { userIcon } from "../components/Icon.tsx";

const Home = () => {

    const location = useGeolocation({enableHighAccuracy: true}); 
    const mapRef = useRef<Map | null>(null);
    const zoomLevel = 16;

    const [places, setPlaces] = useState<Place[] | null>([])

    const [preference, setPreference] = useState<string|"">("");    

    const TomTomAPI = new RouteDataTest();

    const defaultCenter: [number, number] = [51.441643, 5.469722];  
    const [userLocation, setUserLocation] = useState<[number, number]>(defaultCenter);

    const [trafficData, setTrafficData] = useState<any>(null);

    const lat: number = location.latitude ?? 0;
    const lon: number = location.longitude ?? 0; 

    interface Place {
        name: string;
        address: string;
        latitude: number;
        longitude: number;
    }

    const processAPIResponse = (response: any) => {
    
        const data: Place[] = [];

        if (Array.isArray(response.features) && response.features.length > 0) {
            response.features.forEach((feature: any) => {
                
                const place: Place = {
                    name: feature.properties.name,    
                    address: feature.properties.formatted,  
                    latitude: feature.properties.lat || 0, 
                    longitude: feature.properties.lon || 0,  
                };
                
                data.push(place);
    
                setPlaces(data);
            });

        } else {
            console.log('No places found in the response.');
        }
    };

    useEffect(() => {

        const fetchData = async () => {

            console.log(lat, lon)

            if (lat && lon && location.error) {

                const newLocation: [number, number] = [lat, lon];
                setUserLocation(newLocation);

                if (mapRef.current && location.latitude && location.longitude) {

                    mapRef.current.flyTo(newLocation, zoomLevel, { animate: true });
                
                }
            }

            

            // const response = await TomTomAPI.getRouteFlowData(lat, lon);

            // if(response?.flowSegmentData){
            //     setTrafficData(response.flowSegmentData);
            //     console.log(response.flowSegmentData);
            // }
            
        };

        fetchData();

        console.log("Accuracy:", location.accuracy);

    }, [location]);

    useEffect(() =>{

        const getPlaces = async () => {

            const [pName, type] = preference.split(", ");

            const response = await TomTomAPI.getPlacesData(lat, lon, type, pName);

            processAPIResponse(response);

            console.log(places);
            
        }

        if(preference !== ""){
            getPlaces();
        }
        
    }, [preference])

    const pointsOfInterest = [

        {
            name: "Cafes",
            apiName: "cafe",
            type: "catering",
        },
        {
            name: "Restaurants",
            apiName: "restaurant",
            type: "catering",
        },
        {
            name: "Parks",
            apiName: "park",
            type: "leisure",
        },
        {
            name: "Museums",
            apiName: "museum",
            type: "entertainment",
        },
        {
            name: "Hotels",
            apiName: "hotel",
            type: "accommodation",
        },
        {
            name: "Supermarkets",
            apiName: "supermarket",
            type: "commercial",
        },
        {
            name: "Pharmacies",
            apiName: "pharmacy",
            type: "healthcare",
        },
        {
            name: "Hospitals",
            apiName: "hospital",
            type: "healthcare",
        },

    ]
    
    
    const getTrafficGeoJSON = (trafficData: any): FeatureCollection => {
        if (!trafficData?.coordinates?.coordinate) {
            return { type: "FeatureCollection", features: [] };
        }
    
        return {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    geometry: {
                        type: "LineString",
                        coordinates: trafficData.coordinates.coordinate.map(
                            (coord: { latitude: number; longitude: number }) => [coord.longitude, coord.latitude]
                        ),
                    },
                    properties: {
                        currentSpeed: trafficData.currentSpeed,
                        freeFlowSpeed: trafficData.freeFlowSpeed,
                        currentTravelTime: trafficData.currentTravelTime,
                        freeFlowTravelTime: trafficData.freeFlowTravelTime,
                    },
                },
            ],
        };
    };
    

    const getCurrentUserLocation = () => {
        if (location.latitude && location.longitude && !location.error && mapRef.current) {
            mapRef.current.flyTo(userLocation, zoomLevel, { animate: true });
            mapRef.current.fitBounds([userLocation, userLocation], { padding: [50, 50] });
            
        } else {
            alert(location.error?.message || "Unable to get location.");
        }
    };

    return (
        <>

            <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'white', padding: '10px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', zIndex: '1000' }}>
                <label style={{color: 'black'}}>What are you looking for?</label>
                <select
                    value={preference}
                    onChange={(e) => setPreference(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: 'white', color: 'black' }}
                >
                    <option value="" disabled>Select a preference</option>

                    {pointsOfInterest.map((poi, index) => (
                        <option key={index} value={`${poi.apiName}, ${poi.type}`}>{poi.name}</option>
                    ))}

                </select>
            </div>
            <MapContainer
                center={userLocation || defaultCenter}
                zoom={zoomLevel}
                scrollWheelZoom={true}
                style={{ minHeight: "100vh", minWidth: "100vw" }}
                whenReady={() => {
                    if (mapRef.current) {
                        getCurrentUserLocation();
                    }
                }}
                ref={mapRef}
            >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                minZoom={3} 
                maxZoom={18}
                updateWhenZooming={true}
                updateWhenIdle={true}
                updateInterval={100}
            />
            {!location.error && location.latitude && location.longitude && (
                <>
                    <Marker position={userLocation}>
                        <Popup>
                            Current user location <br />
                        </Popup>
                    </Marker>

                    {
                        places && places?.length > 0 && places?.map((place, index) =>(
                                                <Marker key={index} position={[place.latitude, place.longitude]}>
                                                    <Popup>
                                                        {place.name} <br />
                                                        {place.address}
                                                    </Popup>
                                                </Marker>
                        ))  
                    }

                    {/* <Circle
                        center={userLocation}
                        radius={location.accuracy || 0} >
                    
                    </Circle> */}
                </>
            )}


            {trafficData && (
                <GeoJSON 
                    data={getTrafficGeoJSON(trafficData)} 
                    style={(feature: any) => {
                        const speedRatio = feature.properties.currentSpeed / feature.properties.freeFlowSpeed;
                        const color = speedRatio > 0.8 ? "green" : speedRatio > 0.5 ? "yellow" : "red";
                        return { color, weight: 5, opacity: 0.8 };
                    }}
                />
            )}

            </MapContainer>
        </>
    );
};

export default Home;
