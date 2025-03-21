import { useEffect, useState } from "react";

interface Position {
    latitude?: number;
    longitude?: number;
}

export const usePosition = () => {
    const [position, setPosition] = useState<Position|null>({});
    const [error, setError] = useState<GeolocationPositionError|null>(null);

    const onChange = ({ coords }: { coords: Position }) => {

        setPosition({
            latitude: coords.latitude,
            longitude: coords.longitude
        })
    }

    const onError = (error: GeolocationPositionError) => {
        setError(error);
    }

    useEffect(() =>{
        const geo = navigator.geolocation;

        if(!geo){

            setError({
                code: 0,
                message: "Geolocation is not supported by this browser."
            } as GeolocationPositionError);
            return;
        }   

        const watcher = geo.watchPosition(onChange, onError);

        return () => geo.clearWatch(watcher);
    })

    return {...position, error };

   
}
 
