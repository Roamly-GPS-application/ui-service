const TOMTOM_URL = 'https://api.tomtom.com/traffic/services/4/flowSegmentData';
const API_KEY = 'M7QM5STQbN3wIOWqDfCkPGALe4HLYCYH';

const MINIOAPI_URL = 'http://localhost:8000';

export class RouteDataTest{

    async getRouteFlowData(lat: number, lon: number): Promise<any> {
        try {

            if(lat === 0 || lon === 0){
                return;
            }

            const point = encodeURIComponent(`${lat},${lon}`);
            const response = await fetch(
              `${TOMTOM_URL}/relative0/10/json?point=${point}&unit=KMPH&thickness=10&openLr=false&key=${API_KEY}`,{
                  method: 'GET',
                  headers: {
                      'Accept': 'application/json',
                  },
              }
            );

            const data = await response.json();
          
            return data;

        } catch (error) {
          console.error('Error fetching data:', error);
          throw error;
        }
    }

    async TestMinioUpload(data : any) : Promise<any> {
        try {

            const response = await fetch(`${MINIOAPI_URL}/upload`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),

            })

            const responseData = await response.json();
            return responseData;

        }catch(error){
            console.error('Error fetching data:', error);
            throw error;
        }
    }

    async TestMinioDownload(data : any) : Promise<any> {
        try{

            const response = await fetch(`${MINIOAPI_URL}/download`, {
                method: 'POST',
                headers: {
                    "Content-Type": "text/plain",
                },
                body: data,
            })

            const responseData = await response.json();
            return responseData;

        }catch(error){
            console.error('Error fetching data:', error);
            throw error;
        }
    }

    async getPlacesData(lat: number, lon: number, type: string, building: string) : Promise<any> {
        try {
            const response = await  fetch(`https://api.geoapify.com/v2/places?categories=${type}.${building}&filter=circle:${lon},${lat},15000&bias=proximity:${lon},${lat}&limit=20&apiKey=796037069aa546c997aec743260c0ae8`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            })
            
            const data = await response.json();

            return data;


        }catch(error){
            console.error('Error fetching data:', error);
            throw error;
        }
    }
}


