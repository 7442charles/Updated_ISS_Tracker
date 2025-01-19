# ISS Tracker and Globe Visualization

This project visualizes the real-time position of the International Space Station (ISS) on a 3D globe using Three.js. The application also provides details about the ISS's current latitude, longitude, and the country it is flying over, including the country flag.

## Features
- **3D Globe Visualization**:
  - Displays the Earth with GeoJSON data for countries and rivers.
  - Tracks the ISS in real-time, showing its location on the globe.

- **Real-Time Updates**:
  - Updates the ISS position every 3 seconds using the `Where is ISS` API.

- **Country Information**:
  - Retrieves the country name and flag based on the ISS's current location.
  - Displays country information, or "Probably oversea 😝" if the ISS is over international waters.

## APIs Used

### 1. **Where is ISS API**
- **Base URL**: `https://api.wheretheiss.at`
- **Endpoints Used**:
  - `/v1/satellites/25544`: Fetches the current position (latitude and longitude) of the ISS.
  - `/v1/coordinates/[lat,lon]`: Retrieves additional information such as timezone and country code based on the given latitude and longitude.
- **Example Response**:
  ```json
  {
      "latitude": "37.795517",
      "longitude": "-122.393693",
      "timezone_id": "America/Los_Angeles",
      "offset": -7,
      "country_code": "US",
      "map_url": "https://maps.google.com/maps?q=37.795517,-122.393693&z=4"
  }
  ```

### 2. **Country Flag and Emoji JSON**
- **CDN URL**: `https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/index.json`
- **Purpose**:
  - Maps country codes to country names and flags.
- **Example Response**:
  ```json
  {
      "name": "Ascension Island",
      "code": "AC",
      "emoji": "🇦🇨",
      "unicode": "U+1F1E6 U+1F1E8",
      "image": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AC.svg"
  }
  ```

## File Structure

- **index.html**:
  - Contains the basic structure of the webpage.
  - Displays latitude, longitude, and country information in a floating UI panel.

- **index.js**:
  - Manages the 3D globe visualization using Three.js.
  - Adds ISS markers and handles updates to the globe.

- **coordinates.js**:
  - Fetches real-time ISS data and country details.
  - Updates the latitude, longitude, and country name/flag on the webpage.

## How It Works
1. The application initializes a 3D globe using Three.js and overlays country and river data using GeoJSON.
2. Every 3 seconds, the ISS's latitude and longitude are fetched from the `Where is ISS` API.
3. The country code from the ISS API response is mapped to a country name and flag using the `Country Flag and Emoji JSON` API.
4. The latitude, longitude, and country information (including the flag) are displayed dynamically on the webpage.

## Requirements
- A modern browser that supports JavaScript modules.
- Internet connection to fetch data from the APIs and CDN resources.

## Future Improvements
- Add animations to smooth the ISS's movement on the globe.
- Enhance the UI with additional details, such as timezone or altitude.
- Store historical ISS data for replay functionality.
- Implement error handling for network failures or API issues.

