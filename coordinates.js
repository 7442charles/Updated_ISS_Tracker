let countryFlagData = [];

// Load the country flag data JSON from the CDN
fetch("https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/index.json")
  .then(response => response.json())
  .then(data => {
    countryFlagData = data;
  })
  .catch(err => console.error("Error loading country flag data:", err));

// Function to get the country name and flag from the country code
function getCountryInfoFromCode(code) {
  const country = countryFlagData.find(c => c.code === code);
  if (country) {
    return {
      name: country.name,
      flag: country.image, // Use the SVG image for better quality
    };
  } else {
    return {
      name: "Unknown",
      flag: null,
    };
  }
}

// Function to get the country code and timezone using the Where is ISS API
function getCountryFromCoordinates(latitude, longitude) {
  const url = `https://api.wheretheiss.at/v1/coordinates/${latitude},${longitude}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const countryCode = data.country_code || "Unknown"; // Fallback to Unknown if not available
      const countryInfo = getCountryInfoFromCode(countryCode); // Get country name and flag

      // Update the UI
      document.getElementById("latitude").textContent = `Latitude: ${latitude.toFixed(4)}`;
      document.getElementById("longitude").textContent = `Longitude: ${longitude.toFixed(4)}`;
      if (countryCode !== "Unknown" && countryInfo.name !== "Unknown") {
        document.getElementById("country").innerHTML = `
          Country: ${countryInfo.name} 
          <img src="${countryInfo.flag}" alt="${countryInfo.name} flag" style="width:20px; height:auto; margin-left:5px;">
        `;
      } else {
        document.getElementById("country").textContent = "Country: oversea 😝";
      }
    })
    .catch(err => console.error("Error fetching country data:", err));
}

// Function to update ISS position and get the country
function updateISSPosition() {
  fetch("https://api.wheretheiss.at/v1/satellites/25544")
    .then(response => response.json())
    .then(data => {
      const latitude = data.latitude;
      const longitude = data.longitude;

      // Fetch the country and timezone using Where is ISS API
      getCountryFromCoordinates(latitude, longitude);
    })
    .catch(err => console.error("Error fetching ISS data:", err));
}

// Update the ISS position every 3 seconds
setInterval(updateISSPosition, 5000);
