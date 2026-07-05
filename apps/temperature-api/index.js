const express = require("express");

const app = express();
const PORT = process.env.PORT || 8081;

const MIN_TEMP = -10;
const MAX_TEMP = 35;
const SENSOR_TO_LOCATION = {
  0: "Unknown",
  1: "Living Room",
  2: "Bedroom",
  3: "Kitchen",
};
const LOCATION_TO_SENSOR = {
  Unknown: "0",
  "Living Room": "1",
  Bedroom: "2",
  Kitchen: "3",
};
const RES_STATUS = {
  Success: 200,
  Error: 400,
};
const ROUTE = {
  Health: "/health",
  Temperature: "/temperature",
};

function randomTemperature() {
  const value = MIN_TEMP + Math.random() * (MAX_TEMP - MIN_TEMP);

  return Math.round(value * 10) / 10;
}

function buildReading({ location, sensorId }) {
  return {
    value: randomTemperature(),
    unit: "°C",
    timestamp: new Date().toISOString(),
    location,
    status: "active",
    sensor_id: sensorId,
    sensor_type: "temperature",
    description: `Temperature reading for ${location}`,
  };
}

app.get(ROUTE.Health, (_req, res) => {
  res.json({ status: "ok" });
});

app.get(ROUTE.Temperature, (req, res) => {
  const location = req.query.location;

  if (!location) {
    return res.status(RES_STATUS.Error).json({
      code: "validation_error",
      message: "Query parameter 'location' is required",
    });
  }

  const sensorId = LOCATION_TO_SENSOR[location] ?? LOCATION_TO_SENSOR.Unknown;
  res.status(RES_STATUS.Success).json(buildReading({ location, sensorId }));
});

app.get(`${ROUTE.Temperature}/:sensorId`, (req, res) => {
  const sensorId = req.params.sensorId;
  const location = SENSOR_TO_LOCATION[sensorId] ?? SENSOR_TO_LOCATION[0];
  res.status(RES_STATUS.Success).json(buildReading({ location, sensorId }));
});

app.listen(PORT, () => {
  console.log(`temperature-api listening on port ${PORT}`);
});
