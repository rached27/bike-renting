import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  View
} from 'react-native';
  import { Switch, Text } from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {fetchStationData} from '../redux/actions/stationActions';
import MapboxGL from '@react-native-mapbox-gl/maps';
import MapboxDirectionsFactory from "@mapbox/mapbox-sdk/services/directions";
import { lineString as makeLineString } from "@turf/helpers";
import envs from '../config/env';
import * as constants from '../utils/constants';

const MapView = (props) => {

  const {MAP_TOKEN} = envs;

  MapboxGL.setAccessToken(MAP_TOKEN);
  const directionsClient = MapboxDirectionsFactory({accessToken: MAP_TOKEN});

  const dispatch = useDispatch();
  // Station list
  const stations = useSelector(state => state.stationsReducer.stations);

  const [selectedPointInformations, setSelectedPointInformations] = useState(null);
  
  const [messageInstructionsAndStationInformations, setMessageInstructionsAndStationInformations] = useState(null);

  const [isSwitchOnStart, setIsSwitchOnStart] = useState(false);
  const [isSwitchOnEnd, setIsSwitchOnEnd] = useState(false);


  const [nearestStartStation, setNearestStartStation] = useState(null);
  const [nearestEndStation, setNearestEndStation] = useState(null);

  const [startPoint, setStartPoint] = useState(null);
  const [startStationName, setStartStationName] = useState(null);

  let [route, setRoute] = useState(null);

    // Change header title
    useEffect(() => {
      props.navigation.setOptions({
        title: "Carte",
      });
      dispatch(fetchStationData({}));
    }, []);

    /********************
    Stations informations
    *********************/

   // Get selected station informations
  const onSelectPoint = event => {
    setSelectedPointInformations(JSON.parse(event.properties.id));
  };

  // Add stations on the map based on filter
  const renderPointAnnotation = 
  stations.map(station =>

    (!(
      // If the user has not indicated the name station
      props.route.params.name.length == 0
      // Or he has indicated a word
      || props.route.params.name.length > 0
      // And the word is included in the name station
      && station.name.toLowerCase().includes(props.route.params.name.toLowerCase()))
      // If the user wishes to have only open stations and this station is closed
      || (props.route.params.status && station.status != "OPEN")
      // If the user wishes to have only cloed stations and this station is open
      || (!props.route.params.status && station.status == "OPEN")
      // If the user wishes to have only stations with available bikes and this station does not contain any available bikes
      || (props.route.params.availableBikes && station.totalStands.availabilities.bikes < 1)
      // If the user wishes to have only stations with none available bikes and this station contain at least one available bikes
      || (!props.route.params.availableBikes && station.totalStands.availabilities.bikes > 0)) ? null :
      // Add station on the map
              <MapboxGL.PointAnnotation
              key={station.number}
              id={JSON.stringify(station)}
              coordinate={[station.position.longitude, station.position.latitude]}
              onSelected={onSelectPoint}
            /> 
);


    /********************
    Starting and ending points
    *********************/

  const onToggleSwitchStart = () => {
    // If user turns on the switch of s
    if (!isSwitchOnStart) {
      setMessageInstructionsAndStationInformations("Veuillez indiquez votre point de départ sur la carte");
    }
    else {
      setMessageInstructionsAndStationInformations(null);
    }
    setIsSwitchOnStart(!isSwitchOnStart);
    setIsSwitchOnEnd(false);
  }
    
  const onToggleSwitchEnd = () => {
    // If user turns on the arrival switch and has not selected a starting point
    if (!startPoint) {
      setMessageInstructionsAndStationInformations("Veuillez d'abord sélectionner un point de départ");
      return;
    }
    // If user turns on the arrival switch and has selected a starting point
    else if (!isSwitchOnEnd) {
      setMessageInstructionsAndStationInformations("Veuillez indiquez votre point d'arrivée sur la carte");
    }
    else {
      setMessageInstructionsAndStationInformations(null);
    }
    setIsSwitchOnEnd(!isSwitchOnEnd);
    setIsSwitchOnStart(false);
  }
  

  /********************
    Tracing route
    *********************/

  const getNearestStartStation = (point) => {
    // The shortest distance
    let shortest_distance = distance(point[1], point[0], stations[0].position.latitude, stations[0].position.longitude);
    // Browse the list stations
    for (var i = 0; i < stations.length; i++) {
      // if this station is closer to the selected point
      if (distance(point[1], point[0], stations[i].position.latitude, stations[i].position.longitude) < shortest_distance && stations[i].totalStands.availabilities.bikes > 0) {
        // Update the shortest distance
        shortest_distance = distance(point[1], point[0], stations[i].position.latitude, stations[i].position.longitude);
        // Get the location of start station 
        setNearestStartStation([stations[i].position.longitude, stations[i].position.latitude]);
        // Store the station name
        setStartStationName("Station de départ: " + stations[i].name );
        // Update informative message
        setMessageInstructionsAndStationInformations("Station de départ: " + stations[i].name );
      }
    }
  };

  const getNearestEndStation = (point) => {
    // The shortest distance
    let shortest_distance = distance(point[1], point[0], stations[0].position.latitude, stations[0].position.longitude);
    // Browse the list stations
    for (var i = 0; i < stations.length; i++) {
      // if this station is closer to the selected point
      if (distance(point[1], point[0], stations[i].position.latitude, stations[i].position.longitude) < shortest_distance && (stations[i].totalStands.availabilities.stands - stations[i].totalStands.availabilities.bikes > 0)) {
        // Update the shortest distance
        shortest_distance = distance(point[1], point[0], stations[i].position.latitude, stations[i].position.longitude);
        // Get the location of end station 
        setNearestEndStation([stations[i].position.longitude, stations[i].position.latitude]);
        // Update informative message
        setMessageInstructionsAndStationInformations(startStationName + "\n" + "Station d'arrivée: " + stations[i].name);
      }
    }
  };

  // Get distance between two points
  const distance = (lat1, lon1, lat2, lon2) => {
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515 * 1.609344
    return dist
  }

      // Draw a route between the two nearest stations based on the start and end points
      const fetchRoute = async () => {
        const reqOptions = {
          waypoints: [
            { coordinates: nearestStartStation },
            { coordinates: nearestEndStation }
          ],
          profile: "cycling",
          geometries: "geojson"
        };
        const res = await directionsClient.getDirections(reqOptions).send();
        const newRoute = makeLineString(res.body.routes[0].geometry.coordinates);
        setRoute(newRoute);
      };
  
      // Refresh the route if the arrival point has changed
    useEffect(() => {
      nearestEndStation && fetchRoute();
    }, [nearestEndStation]);

  const renderRoute = () => {
    return route ? (
      <MapboxGL.ShapeSource id="routeSource" shape={route}>
        <MapboxGL.LineLayer id="routeFill" />
      </MapboxGL.ShapeSource>
    ) : null;
  };

  return (
    <View  style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={styles.bodyContainer}>
        <View
        style={styles.switchView}>
  <Text style={styles.textSwitchView}>Je souhaites sélectionner mon point de départ :</Text>
  <Switch color={constants.ORANGE_COLOR} value={isSwitchOnStart} onValueChange={onToggleSwitchStart}/>
  </View>
  <View
        style={styles.switchView}>
  <Text style={styles.textSwitchView} >Je souhaites sélectionner mon point d'arrivée :</Text>
  <Switch color={constants.ORANGE_COLOR} value={isSwitchOnEnd} onValueChange={onToggleSwitchEnd}/>
  </View>
  { messageInstructionsAndStationInformations
  && <View 
        style={styles.messageView}>
  <Text style={styles.textMessageView} >{messageInstructionsAndStationInformations}</Text>
  </View> 
}
          <MapboxGL.MapView
            style={styles.map}
            onPress={event => {
              // If user activated the start switch
              if (isSwitchOnStart) {
                setIsSwitchOnStart(false)
                setIsSwitchOnEnd(false)
                // Save the start point before selecting the end point
                setStartPoint(event.geometry.coordinates)
                // Get nearest start station
                getNearestStartStation(event.geometry.coordinates);
              }
              // If user activated the end switch
              else if (isSwitchOnEnd) {
                setIsSwitchOnStart(false)
                setIsSwitchOnEnd(false)
                // Get nearest end station
                getNearestEndStation(event.geometry.coordinates);
              }
            }}>
            <MapboxGL.Camera
              zoomLevel={8}
              centerCoordinate={[2.3496325777332494, 48.85650085170348]} // Focus on Paris
            />
            
          { 
            renderPointAnnotation // Show stations on the map
        }

          {
            renderRoute() // Show the route between the nearest departure and arrival stations
        }
          </MapboxGL.MapView>
          {selectedPointInformations && // Show informations of the selected station
            <View style={styles.coordinateViewContainer}>
              <View style={styles.coordinateView}>
                 <Text style={styles.textInformations}>Nom: {selectedPointInformations.name} {"\n"}</Text>
              
                <Text style={styles.textInformations}>Adresse: {selectedPointInformations.address} {"\n"}</Text>

                <Text style={styles.textInformations}>Vélos disponibles: {selectedPointInformations.totalStands.availabilities.bikes}</Text>
              </View>
            </View>
          }
        </View>
        </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  },
  bodyContainer: {
    height: '100%',
    width: '100%',
  },
  switchView: {
    flexDirection: 'row',
    paddingVertical: 10,
    marginHorizontal: 20,
    alignItems: 'center'
  },
  textSwitchView: {
    marginRight: 10
  },
  messageView: {
    flexDirection: 'row',
    paddingVertical: 10,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textMessageView: {
    marginRight: 10,
    textAlign: 'center',
    color: '#e46d31',
    fontWeight: 'bold'
  },
  map: {
    flex: 1,
  },
  coordinateViewContainer: {
    position: 'absolute',
    bottom: 0,
    padding: 5,
    width: '100%',
    backgroundColor: 'transparent',
  },
  coordinateView: {
    padding: 5,
    backgroundColor: '#fff',
    flex: 1,
  },
  textInformations: {
    fontWeight: 'bold'
  },
});

export default MapView;