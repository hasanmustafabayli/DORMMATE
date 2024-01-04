import { Box, Typography, useTheme } from "@mui/material";
import { Air, WbSunnyOutlined } from "@mui/icons-material";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setWeather } from "state";

const WeatherWidget = () => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const weather = useSelector((state) => state.user.weather);
  const weatherCodes = {
    0: "Clear Sky",
    1: "Mainly clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Fog",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Dense Drizzle",
    61: "Slight Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    66: "Light Freezing Rain",
    67: "Heavy Freezing Rain",
    71: "Light Snow",
    73: "Moderate Snow",
    75: "Heavy Snow",
    80: "Slight Rain Showers",
    81: "Moderate Rain Showers",
    82: "Violent Rain Showers",
    85: "Slight Snow Showers",
    86: "Heavy Snow Showers",
    95: "Thunderstorm",
    96: "Thunderstorm with Slight Hail",
    99: "Thunderstorm with Heavy Hail"
  }

  const getWeather = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async function(position) {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&current_weather=true&temperature_unit=fahrenheit`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        dispatch(setWeather({ weather: data }));
      });
   }

  };

  useEffect(() => {
    getWeather();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper>
      <WbSunnyOutlined/>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Weather
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
      <Typography
        color={palette.neutral.dark}
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        {weather ? 
          `${weatherCodes[weather.current_weather.weathercode]} /
          ${weather.current_weather.temperature}° F`
          :
          "Loading Weather..."
        }
      </Typography>

      </Box>
    </WidgetWrapper>
  );
};

export default WeatherWidget;