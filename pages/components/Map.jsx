import React, { useEffect, useContext, useState } from "react";
import tw from "tailwind-styled-components";
import mapboxgl from "!mapbox-gl";
import { point, distance } from "@turf/turf";
import axios from "axios";

import UberContext from "../../context/UberContext";

mapboxgl.accessToken =
  "pk.eyJ1IjoibHVjaWRqb3kiLCJhIjoiY2xvbW1ubDBoMWN0bTJpbzVmZnQ1bmRyMyJ9.4bUROR20LVUTZJc3gj5sgA";

const Map = (props) => {
  const { fetchCurrentLocation, latitude, longitude, setCurrentLocation } =
    useContext(UberContext);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/drakosi/ckvcwq3rwdw4314o3i2ho8tph",
      center: [longitude, latitude],
      zoom: 8,
    });

    fetchCurrentLocation();

    const fetchMapboxLocation = async () => {
      try {
        const response = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json`,
          {
            params: {
              access_token:
                "pk.eyJ1IjoibHVjaWRqb3kiLCJhIjoiY2xvbW1ubDBoMWN0bTJpbzVmZnQ1bmRyMyJ9.4bUROR20LVUTZJc3gj5sgA",
            },
          }
        );

        const location = response.data.features[0].place_name;
        // console.log("Mapbox Location:", response.data.features[0]);
        setCurrentLocation(location);
        if (props.index) {
          addToMap(map, [longitude, latitude]);
        }
        // console.log("LOCATIONL: ", location);
      } catch (error) {
        console.error("Error fetching Mapbox location:", error);
      }
    };

    fetchMapboxLocation();

    if (props.pickupCoordinates) {
      // navigator.geolocation.getCurrentPosition((coords) => {
      // console.log(coords.coords.latitude, coords.coords.longitude)
      // const onlyPick = getPickupCoordinates("Malibu");
      // console.log("--> ", onlyPick);
      // addToMap(map, []);
      // new mapboxgl.Marker({ color: "black" })
      //   .setLngLat([coords.coords.latitude, coords.coords.longitude])
      //   .addTo(map);
      // });
    }

    if (props.dropoffCoordinates) {
      // addToMap(map, props.dropoffCoordinates);
    }

    console.log(
      "MAP file:  ",
      props.pickupCoordinates,
      props.dropoffCoordinates
    );

    if (props.pickupCoordinates && props.dropoffCoordinates) {
      map.fitBounds([props.dropoffCoordinates, props.pickupCoordinates], {
        padding: 100,
      });
      addToMap(map, props.pickupCoordinates);
      addToMap(map, props.dropoffCoordinates);
    }
  }, [longitude, props.pickupCoordinates]);

  const addToMap = (map, coordinates) => {
    console.log("Marker -->", coordinates);
    new mapboxgl.Marker({ color: "black" }).setLngLat(coordinates).addTo(map);
  };

  return (
    <div
      id='map'
      className={`flex flex-col flex-1 ${props.payment ? "h-[100vh]" : "h-1/2"}
  `}
    >
      Map
    </div>
  );
};

export default Map;
