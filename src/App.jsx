import Map from './components/Map'
import DashboardOverlay from './components/DashboardOverlay'
import DataLayers from './components/DataLayers'

function App() {
  return (
    <div className="h-screen w-screen relative overflow-hidden bg-black">
      <Map>
        <DataLayers />
      </Map>
      <DashboardOverlay />
    </div>
  )
}

export default App
