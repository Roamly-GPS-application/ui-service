import { useEffect } from 'react';
import { RouteDataTest } from '../services/FetchRouteDataTest.ts'

const TestPage = () => {
    const MINIO_API = new RouteDataTest();

    
    const minio_data = {
        bucket_name: 'test-bucket',
        file_name: 'test.txt',
        file_path: 'C:/Desktop/ATM data/test.txt'
    }

    useEffect(() => {

        const uploadData = async () => {
            MINIO_API.TestMinioUpload(minio_data).then((response) => {
                console.log(response);
            }); 
        }

        uploadData();

        // const downloadData = async () => {

        //     MINIO_API.TestMinioDownload(minio_data.bucket_name).then((response) => {
        //         console.log(response);
        //     });
        // }

        // downloadData();

        // const placesData = async () =>{
        //     const response = await MINIO_API.getPlacesData()

        //     console.log(response);
        // }

        // placesData();

    },[])

    return (  
        <h1>Test done check results</h1>
    );
}
 
export default TestPage;