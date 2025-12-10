const axios = require("axios");
const { config } = require("../config/config");
const SearchRecord = require("../models/SearchRecord");

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const cache = new Map(); // key: countryName(lowercase), value: { data, expiresAt }

function getCached(countryName) {
  const key = countryName.trim().toLowerCase();
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCached(countryName, data) {
  const key = countryName.trim().toLowerCase();
  cache.set(key, {
    data,
    expiresAt: Date.now() + CACHE_TTL,
  });
}

async function fetchFromApis(countryName) {
  let country = {
    name: countryName,
    capital: "N/A",
    region: "Unknown",
    population: null,
    flag: "🌍",
    currency: "N/A",
    languages: [],
    weather: {
      temperature: null,
      description: "Unknown",
      humidity: null,
    },
    advisory: {
      risk: "Unknown",
      message: "No advisory information available.",
    },
  };

  let iso2 = null;
  let lat = null;
  let lon = null;

  // 1) REST COUNTRIES (required, but we catch errors)
  try {
    const restRes = await axios.get(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`
    );
    const c = restRes.data[0];

    iso2 = c.cca2;
    country.name = c.name.common || countryName;
    country.capital = c.capital?.[0] || "N/A";
    country.region = c.region || "Unknown";
    country.population = c.population ?? null;
    country.flagEmoji = c.flag || "🌍";
    country.flagImage = c.flags?.svg || c.flags?.png || null;

    const currencies = c.currencies ? Object.values(c.currencies) : [];
    country.currency =
      currencies.length > 0
        ? `${currencies[0].name} (${Object.keys(c.currencies)[0]})`
        : "N/A";

    country.languages = c.languages ? Object.values(c.languages) : [];
    [lat, lon] = c.latlng || [null, null];
  } catch (err) {
    console.error("REST Countries error:", err.response?.data || err.message);
    // if this fails badly, at least show some reason
    // we still continue to try weather/advisory with what we have
  }

  // 2) OPENWEATHER (optional)
  if (lat != null && lon != null && config.openWeatherKey) {
    try {
      const weatherRes = await axios.get(
        "https://api.openweathermap.org/data/2.5/weather",
        {
          params: {
            lat,
            lon,
            appid: config.openWeatherKey,
            units: "metric",
          },
        }
      );

      country.weather = {
        temperature: weatherRes.data.main.temp,
        description: weatherRes.data.weather?.[0]?.description ?? "Unknown",
        humidity: weatherRes.data.main.humidity,
      };
    } catch (err) {
      console.error("OpenWeather error:", err.response?.data || err.message);
      // keep default weather object
    }
  }

  // 3) TRAVEL ADVISORY (optional, via RapidAPI)
  if (config.travelApiKey && iso2) {
    try {
      const advRes = await axios.get(
        "https://travel-advisory.p.rapidapi.com/api",
        {
          params: { countrycode: iso2 },
          headers: {
            "X-RapidAPI-Key": config.travelApiKey,
            "X-RapidAPI-Host": "travel-advisory.p.rapidapi.com",
          },
        }
      );

      const advData = advRes.data?.data?.[iso2]?.advisory;
      if (advData) {
        const score = advData.score ?? 0;
        const risk =
          score < 3 ? "Low Risk" : score < 4 ? "Medium Risk" : "High Risk";

        country.advisory = {
          risk,
          message: advData.message,
        };
      }
    } catch (err) {
      console.error("Travel Advisory error:", err.response?.data || err.message);
      // keep default advisory
    }
  }

  return country;
}

async function searchCountry(countryName, user) {
  if (!countryName || !countryName.trim()) {
    throw new Error("Country name is required");
  }

  // cache
  const cached = getCached(countryName);
  const country = cached || (await fetchFromApis(countryName));
  if (!cached) setCached(countryName, country);

  const summaryParts = [];
  if (country.capital) summaryParts.push(country.capital);
  if (country.weather?.temperature != null)
    summaryParts.push(`${country.weather.temperature}°C`);
  if (country.advisory?.risk) summaryParts.push(country.advisory.risk);

  const summary = summaryParts.join(" · ");

  if (user?._id) {
    await SearchRecord.create({
      userId: user._id,
      country: country.name,
      capital: country.capital,
      summary,
      risk: country.advisory?.risk || "Unknown",
      searchedAt: new Date(),
    });
  }

  return {
    ...country,
    summary,
  };
}

async function getHistory(userId) {
  return SearchRecord.find({ userId }).sort({ searchedAt: -1 }).limit(100);
}

module.exports = { searchCountry, getHistory };