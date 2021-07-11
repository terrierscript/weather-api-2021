import "dayjs/locale/ja"


import fetch from "node-fetch"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

dayjs.extend(utc)
dayjs.extend(timezone)


type LatLon = {
  lat: string,
  lon: string
}
const openWeatherUrl = ({ lat, lon }: LatLon) => {
  return `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_API_KEY}&lang=ja_jp&units=metric`
}

const now = dayjs().set("minutes", 0).set("second", 0)

const after6h = now.clone().add(6, "hours").unix()
const after12h = now.clone().add(12, "hours").unix()


const convertData = (data) => {
  return Object.fromEntries(
    data.map((d) => [d.dt, d])
  )
}

// https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
const weatherIconToEmoji = (weatherMain: any) => {
  const iconCode = weatherMain?.icon.slice(0, 2)
  switch (iconCode) {
    case "01": return "☀️"
    case "02": return "⛅️"
    case "03": return "☁️"
    case "04": return "☁️"
    case "09": return "🌧"
    case "10": return "🌦"
    case "11": return "🌩"
    case "13": return "❄️"
    case "50": return "🌫"
    default:
      return weatherMain?.main
  }
}

const generateMessage = (target, enableNortify = false) => {
  const time = dayjs(target.dt * 1000)
    .tz("Asia/Tokyo")
    .locale("ja")
    .format("MM月DD日 HH時頃")
  const icon = weatherIconToEmoji(target?.weather?.[0])
  const percip = [
    icon,
    ` / 🌂${target.pop * 100}%`,
  ].join("")
  const temperature = `🌡 ${target.temp}度`
  return [`${time}`, percip, temperature].join(" / ")
}

const fetchTarget = async ({ lat, lon }) => {
  const url = openWeatherUrl({ lat, lon })
  const response = await fetch(url)
  if (response.status !== 200) {
    console.error(response.statusText)
  }
  const data = await response.json()
  return convertData(data.hourly)
}

export const execute = async ({ lat, lon }) => {
  const msg = await fetchTarget({ lat, lon }).then((r) => {
    return [
      generateMessage(r[after6h]).trim(),
      generateMessage(r[after12h]).trim()
    ].join("\n")
  })
  return msg
}