
   
import axios from './axiosDeclaration';
import envs from '../../config/env';

export const getAllStations = async () => {
const {API_TOKEN} = envs;
  try {
    // GET all stations at cergy-pontoise
    const stations = await axios.get("?contract=cergy-pontoise&apiKey="+API_TOKEN);
    return stations.data;
  } catch (err) {
    return console.error(err);
  }
};