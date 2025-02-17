import TideChart from "@/components/TideChart";

const LAT = 51.548
const LNG = 0.612
const START = "2025-02-16T00:00:00Z"
const END = "2025-02-18T23:59:59Z"

function StationInfo({ station }: { station: {distance: number, name: string, lat: number, lng: number} }) {
  return (
    <div>
      <h2 className="text-2xl font-bold flex gap-2">
        {station.name}
        <small className="font-normal font-mono text-gray-500">
          @{station.lat},{station.lng}</small>
        </h2>
      <p className="text-sm text-gray-500 flex gap-1">
        {station.distance}km from your location
        <small className="font-normal font-mono text-gray-500">
        @{LAT},{LNG}
        </small>
        </p>
    </div>
  )
}

async function apiCall<T>(url: string): Promise<T> {
  const base = 'https://api.stormglass.io/v2'
  const searchParams = new URLSearchParams()
  searchParams.set('lat', LAT.toString())
  searchParams.set('lng', LNG.toString())
  searchParams.set('start', START)
  searchParams.set('end', END)
  const response = await fetch(`${base}${url}?${searchParams.toString()}`, {
    method: "GET",
    cache: "force-cache",
    headers: {
      "Authorization": process.env.STORMGLASS_AUTH as string
    }
  })
  return response.json()
}

type Meta = {
  start: string,
  end: string,
  station: {distance: number, name: string, lat: number, lng: number},
  datum: string
}

type Levels = {
  meta: Meta,
  data: {sg: number, time: string}[]
}

type Extremes = {
  meta: Meta,
  data: {height: number, time: string, type: "high" | "low"}[]
}

export default async function Home() {
  const [levelsData, extremesData] = await Promise.all([
    apiCall<Levels>(`/tide/sea-level/point`),
    apiCall<Extremes>(`/tide/extremes/point`)
  ])
  const { start: startLevel, end: endLevel, station, datum } = levelsData.meta
  const level: {sg: number, time: string}[] = levelsData.data
  const { start: startExtremes, end: endExtremes, datum: datumExtremes } = extremesData.meta
  const extremes: {height: number, time: string, type: "high" | "low"}[] = extremesData.data
  const points = [
    ...level.map((row) => ({...row, value: row.sg})),
    ...extremes.map((row) => ({...row, value: row.height}))
  ].sort((a, b) => a.time > b.time ? 1 : -1)

  return (
    <div className="p-4 space-y-2">
      <StationInfo station={station} />
      <p>Level: {startLevel} - {endLevel}, {datum}</p>
      <p>Extremes: {startExtremes} - {endExtremes}, {datumExtremes}</p>
      <TideChart data={{
        labels: points.map((row) =>row.time),
        datasets: [
          {
            type: 'scatter',
            label: 'tide extremes over time',
            data: extremes.map((row) => ({x: row.time, y: row.height})),
            borderColor: 'rgb(255,132, 155)',
            backgroundColor: 'rgba(255,132, 155, 0.8)'
          },
          {
            label: 'tide level over time',
            data: points.map((row) => ({x: row.time, y: row.value})),
            borderColor: 'rgb(132, 155, 255)',
            backgroundColor: 'rgba(132, 155, 255, 0.8)'
          },
        ]}} />
    </div>
  );
}