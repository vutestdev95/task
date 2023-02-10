import { useState, useEffect } from "react";
import { DirectionsRenderer } from "@react-google-maps/api";
import * as variable from "../../../utils/variable";
import * as toast from "../../../utils/toast";

interface IPosition {
  latitude: number;
  longitude: number;
}

const lineSymbol = {
  path: "M 0,-1 0,1",
  strokeOpacity: 1,
  scale: 2,
};

function MapDirectionsRenderer(props: any) {
  const [directions, setDirections] = useState(null);

  useEffect(() => {
    const { places, travelMode } = props;
    const waypoints = places.map(({ latitude, longitude }: IPosition) => ({
      location: { lat: latitude, lng: longitude },
      stopover: true,
    }));

    const origin = waypoints.shift()?.location;
    const destination = waypoints.pop()?.location;
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: travelMode,
        waypoints: waypoints,
        optimizeWaypoints: true,
      },
      (result: any, status) => {
        setDirections(result);
        if (status === google.maps.DirectionsStatus.ZERO_RESULTS) {
          toast.toastError("Directions request returned no results");
        }
      }
    );
  }, [props]);
  return (
    directions && (
      <DirectionsRenderer
        directions={directions}
        data-testid="direction-render"
        options={{
          suppressMarkers: true,
          polylineOptions: {
            strokeWeight: 2,
            strokeColor: variable.DEFAULT_COLOR,
            strokeOpacity: 0,
            icons: [{ icon: lineSymbol, offset: "0", repeat: "20px" }],
          },
        }}
      />
    )
  );
}

export default MapDirectionsRenderer;
