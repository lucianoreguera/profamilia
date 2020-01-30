import React, { useState, useEffect, Fragment } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { Icon } from 'leaflet';
import './app.css';

function App() {

  const [stores, setStores] = useState([]);
  const [storepopup, setStorePopup] = useState(null);

  useEffect(() => {
    const requestAPI = async () => {
    
      const url = 'https://tarjetafamilia.catamarca.gob.ar/api/v1/commerce/';
  
      // consultar la URL
      const response = await fetch(url);
      const result = await response.json();
  
      setStores(result.data);
    };
  
    requestAPI();
    
  }, []);

  const getIcon = tags => {
    let icon;
    
    switch (tags[0]) {
      case 'carniceria':
          icon = new Icon({
            iconUrl: "/svg/butcher-shop.svg",
            iconSize: [25, 25]
          });
        break;
      case 'supermercado':
          icon = new Icon({
            iconUrl: "/svg/supermarket.svg",
            iconSize: [25, 25]
          });
        break;
      default:
        icon = new Icon({
          iconUrl: "/svg/store.svg",
          iconSize: [25, 25]
        });
        break;
    }
    
    return icon;
  };

  return (
    <Fragment>
      <header>
        <h2>Tarjetas Profamilia Catamarca</h2>
      </header>
        <Map 
            center={[-28.475073054565765,-65.76921650185238]}
            zoom={12}
          >
          <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />

          { 
            stores.map((store) => 
              (store.attributes.point !== null) 
              ?
                <Marker
                  key={store.id}
                  position={[store.attributes.point.coordinates[1], store.attributes.point.coordinates[0]]}
                  icon={getIcon(store.attributes.tags)}
                  onClick={() => {
                    setStorePopup(store);
                  }}
                />
              :  
                false
            )
          }

          {
            storepopup ? (
              <Popup
                position={[
                  storepopup.attributes.point.coordinates[1], 
                  storepopup.attributes.point.coordinates[0]
                ]}
                onClose={() => {
                  setStorePopup(null);
                }}
              >
                <div>
                  <h5>{storepopup.attributes.name}</h5>
                  <p>Direccion: {storepopup.attributes.address}</p>
                  <p>Email: {storepopup.attributes.email}</p>
                  <p>Tags: <a href="#!">#{storepopup.attributes.tags}</a></p>
                </div>
              </Popup>
            ) : null
          }
      </Map>
    </Fragment>
  );
}

export default App;
