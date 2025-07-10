// MATERIAL UI IMPORTS
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Prayer from "./Prayer";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import axios from "axios";
import { useState, useEffect } from "react";
import moment from "moment";

const MainContent = () => {
  const cities = [
    "Ushaiqer",
    "Riyadh",
    "Jeddah",
    "Makkah",
    "Madinah",
    "Dammam",
    "Shaqra",
    "Tabuk",
    "Abha",
    "Buraidah",
    "Hail",
    "Najran",
    "Jazan",
    "Al Khobar",
    "Al Hofuf",
    "Al Qatif",
    "Yanbu",
    "Arar",
  ];

  const [timings, setTimings] = useState({
    Fajr: "00:00",
    Dhuhr: "00:00",
    Asr: "00:00",
    Maghrib: "00:00",
    Isha: "00:00",
  });
  const [selectedCity, setSelectedCity] = useState("Riyadh");
  const [date, setDate] = useState();
  const [timer, setTimer] = useState("");
  const [nextPrayer, setNextPrayer] = useState("");

  function getNextPrayer(timings) {
    const now = moment();
    const prayerOrder = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
    let nextPrayer = null;
    let nextTime = null;

    for (let i = 0; i < prayerOrder.length; i++) {
      const prayer = prayerOrder[i];
      const [hour, minute] = timings[prayer].split(":");
      let prayerMoment = moment().set({
        hour: parseInt(hour, 10),
        minute: parseInt(minute, 10),
        second: 0,
        millisecond: 0,
      });
      prayerMoment = prayerMoment.add(60, "seconds");
      if (prayerMoment.isAfter(now)) {
        nextPrayer = prayer;
        nextTime = prayerMoment;
        break;
      }
    }

    if (!nextPrayer) {
      const [hour, minute] = timings["Fajr"].split(":");
      let prayerMoment = moment()
        .add(1, "day")
        .set({
          hour: parseInt(hour, 10),
          minute: parseInt(minute, 10),
          second: 0,
          millisecond: 0,
        });
      prayerMoment = prayerMoment.add(60, "seconds");
      nextPrayer = "Fajr";
      nextTime = prayerMoment;
    }

    return { nextPrayer, nextTime };
  }

  function formatTimeLeft(duration) {
    if (duration.asMilliseconds() <= 0) return "00:00:00";
    const hours = String(Math.floor(duration.asHours())).padStart(2, "0");
    const minutes = String(duration.minutes()).padStart(2, "0");
    const seconds = String(duration.seconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }

  useEffect(() => {
    axios
      .get(
        `https://api.aladhan.com/v1/timingsByCity?country=SA&city=${selectedCity}`
      )
      .then((response) => {
        setTimings(response.data.data.timings);
        setDate(response.data.data.date.readable);
      })
      .catch((error) => console.log(error));
  }, [selectedCity]);

  useEffect(() => {
    if (!timings) return;
    function updateTimer() {
      const { nextPrayer, nextTime } = getNextPrayer(timings);
      setNextPrayer(nextPrayer);
      const now = moment();
      const duration = moment.duration(nextTime.diff(now));
      setTimer(formatTimeLeft(duration));
    }
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [timings]);

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  return (
    <div style={{ color: "#354f52", padding: "1em" }}>
      {/* SELECT CITY */}
      <Stack direction="row" style={{ marginBottom: "30px", width: "100%" }}>
        <FormControl
          fullWidth
          variant="outlined"
          sx={{
            width: { xs: "100%", md: "20%" },
            "& label.Mui-focused": { color: "#354f52" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#2f3e46" },
              "&:hover fieldset": { borderColor: "#354f52" },
              "&.Mui-focused fieldset": { borderColor: "#354f52" },
            },
          }}
        >
          <InputLabel id="city-select-label">City</InputLabel>
          <Select
            labelId="city-select-label"
            id="city-select"
            onChange={handleCityChange}
            value={selectedCity}
            label="City"
          >
            {cities.map((city) => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Divider style={{ borderColor: "#2f3e46", opacity: "0.3" }} />

      {/* INFO ROW */}
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        style={{ marginTop: "20px" }}
      >
        {/* LEFT SIDE */}
        <Grid item xs={12} md={6}>
          <div>
            <h2 style={{ marginBottom: "0.3em" }}>{date}</h2>
            <h1 style={{ fontSize: "2.5em", fontWeight: 700 }}>
              {selectedCity} 🌴
            </h1>
          </div>
        </Grid>

        {/* RIGHT SIDE */}
        <Grid item xs={12} md={6}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              textAlign: "right",
              gap: "0.5em",
            }}
          >
            <h2 style={{ color: "#354f52", fontWeight: 600 }}>
              Time till {nextPrayer} prayer
            </h2>
            <div
              style={{
                fontSize: "2.5em",
                fontWeight: 700,
                color: "#2f3e46",
                letterSpacing: "2px",
              }}
            >
              {timer}
            </div>
          </div>
        </Grid>
      </Grid>

      <Divider
        style={{ borderColor: "#2f3e46", opacity: "0.3", marginTop: "20px" }}
      />

      {/* PRAYER CARDS */}
      {timings && (
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={5}
          style={{ marginTop: "50px", width: "100%" }}
          alignItems="center"
          justifyContent="center"
        >
          <Prayer name="🌅 Fajr" time={timings.Fajr} />
          <Prayer name="🌇 Dhuhr" time={timings.Dhuhr} />
          <Prayer name="🌆 Asr" time={timings.Asr} />
          <Prayer name="🌄 Maghrib" time={timings.Maghrib} />
          <Prayer name="🌃 Isha" time={timings.Isha} />
        </Stack>
      )}
    </div>
  );
};

export default MainContent;
