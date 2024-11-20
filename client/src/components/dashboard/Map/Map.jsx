import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, MarkerClusterer, Marker } from "@react-google-maps/api";
import { useGoogleMapsScript } from "../../../config/googleMapsConfig";
import api from "../../../services/api";

const Map = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [map, setMap] = useState(null);
  const { isLoaded, loadError } = useGoogleMapsScript();
  const [isLoading, setIsLoading] = useState(true);

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "16px",
    overflow: "hidden",
  };

  const mapOptions = {
    mapId: process.env.REACT_APP_GOOGLE_MAPS_ID,
    mapTypeId: "roadmap",
    tilt: 0,
    rotateControl: false,
    mapTypeControl: false,
    streetViewControl: true,
    fullscreenControl: true,
    zoomControl: true,
    gestureHandling: "greedy",
  };

  const formatCurrency = (amount) => {
    if (!amount) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleMarkerClick = useCallback(
    (property, markerPosition) => {
      if (!map || !window.google) return;

      if (selectedProperty?.infoWindow) {
        selectedProperty.infoWindow.close();
      }

      map.panTo(markerPosition);
      map.setZoom(16);

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="info-window">
            <h3>${property.address}</h3>
            <div class="info-content">
              <div class="property-type">${
                property.property_type || "Residential"
              }</div>
              <div class="info-price">${formatCurrency(
                property.purchase_price
              )}</div>
              <div class="info-details">
                <div class="detail-row">
                  <span>Bedrooms</span>
                  <span>${property.num_bedrooms || "N/A"}</span>
                </div>
                <div class="detail-row">
                  <span>Bathrooms</span>
                  <span>${property.num_bathrooms || "N/A"}</span>
                </div>
                ${
                  property.is_hoa
                    ? `
                  <div class="detail-row">
                    <span>HOA Fee</span>
                    <span>${formatCurrency(property.hoa_fee)}/month</span>
                  </div>`
                    : ""
                }
              </div>
            </div>
          </div>
        `,
        maxWidth: 320,
        position: markerPosition,
        pixelOffset: new window.google.maps.Size(0, -35),
      });

      infoWindow.open(map);
      setSelectedProperty({ ...property, infoWindow });
    },
    [map, selectedProperty]
  );

  const customIcon = useCallback(
    () => ({
      url: `data:image/svg+xml;base64,${btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path d="M3 13h1v7c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-7h1a1 1 0 0 0 .707-1.707l-9-9a.999.999 0 0 0-1.414 0l-9 9A1 1 0 0 0 3 13zm9-8.586l6 6V15l.001 5H6v-9.586l6-6z" fill="#3b82f6" />
        </svg>
      `)}`,
      scaledSize: window.google?.maps
        ? new window.google.maps.Size(40, 40)
        : null,
    }),
    []
  );

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  useEffect(() => {
    const fetchAndGeocodeProperties = async () => {
      if (!isLoaded || !window.google) return;

      try {
        const response = await api.get("/properties");
        const propertiesData = response.data;
        const geocoder = new window.google.maps.Geocoder();
        const geocodedProperties = [];

        for (const property of propertiesData) {
          const address = [
            property.address,
            property.city,
            property.state,
            property.zip,
            "USA",
          ]
            .filter(Boolean)
            .join(", ");

          try {
            const results = await new Promise((resolve, reject) => {
              geocoder.geocode({ address }, (results, status) => {
                if (status === "OK" && results[0]) {
                  resolve(results);
                } else {
                  reject(status);
                }
              });
            });

            geocodedProperties.push({
              ...property,
              latitude: results[0].geometry.location.lat(),
              longitude: results[0].geometry.location.lng(),
            });
          } catch (error) {
            console.warn(`Geocoding failed for ${address}:`, error);
          }
        }

        setProperties(geocodedProperties);

        if (map && geocodedProperties.length > 0) {
          const bounds = new window.google.maps.LatLngBounds();
          geocodedProperties.forEach((property) => {
            bounds.extend({ lat: property.latitude, lng: property.longitude });
          });
          const padding = { top: 50, right: 50, bottom: 50, left: 50 };
          map.fitBounds(bounds, padding);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setIsLoading(false);
      }
    };

    fetchAndGeocodeProperties();
  }, [isLoaded, map]);

  if (loadError) return <div className="error-message">Error loading maps</div>;
  if (!isLoaded || isLoading)
    return <div className="loading-spinner">Loading map...</div>;

  return (
    <div className="map-page">
      <div className="map-container">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          options={mapOptions}
          onLoad={onLoad}
        >
          {map && (
            <MarkerClusterer
              options={{
                gridSize: 50,
                minimumClusterSize: 2,
                styles: [
                  {
                    textColor: "white",
                    url: `data:image/svg+xml;base64,${btoa(`
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="20" cy="20" r="20" fill="#3b82f6"/>
                    </svg>
                  `)}`,
                    height: 40,
                    width: 40,
                    textSize: 14,
                  },
                ],
              }}
            >
              {(clusterer) =>
                properties.map((property) => (
                  <Marker
                    key={
                      property.id ||
                      `${property.latitude}-${property.longitude}`
                    }
                    position={{
                      lat: property.latitude,
                      lng: property.longitude,
                    }}
                    clusterer={clusterer}
                    icon={customIcon()}
                    onClick={() =>
                      handleMarkerClick(property, {
                        lat: property.latitude,
                        lng: property.longitude,
                      })
                    }
                  />
                ))
              }
            </MarkerClusterer>
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default Map;
