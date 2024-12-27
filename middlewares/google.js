const axios = require("axios");

// Load API keys from environment variables
const GEOCODING_API_KEY = process.env.GEOCODING_API_KEY;
const DISTANCE_MATRIX_API_KEY = process.env.DISTANCE_MATRIX_API_KEY;

const getCoordinates = async (zipCode) => {
    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
            params: {
                address: zipCode,
                key: GEOCODING_API_KEY,
            },
        });

        if (response.data.status !== 'OK') {
            throw new Error(`Geocoding API error: ${response.data.status}`);
        }

        const { lat, lng } = response.data.results[0].geometry.location;
        return { lat, lng };
    } catch (error) {
        console.error('Error fetching coordinates:', error.message);
        throw error;
    }
};

const getDistance = async (origin, destinations) => {
    try {
        const destinationString = destinations.map(dest => `${dest.lat},${dest.lng}`).join('|');
        const response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json`, {
            params: {
                origins: `${origin.lat},${origin.lng}`,
                destinations: destinationString,
                key: DISTANCE_MATRIX_API_KEY,
                mode: 'driving', // or 'walking' depending on the requirement
            },
        });

        if (response.data.status !== 'OK') {
            throw new Error(`Distance Matrix API error: ${response.data.status}`);
        }

        return response.data.rows[0].elements;
    } catch (error) {
        console.error('Error fetching distance:', error);
        throw error;
    }
};

module.exports = {
    getCoordinates,
    getDistance,
};
