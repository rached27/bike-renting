import React, {useState, useEffect} from 'react';
import { Searchbar, Switch, Text, Button } from 'react-native-paper';
import { View,
  StyleSheet,
  Image,
  StatusBar,
  SafeAreaView,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import * as constants from '../utils/constants';

const Search = (props) => {

  const navigation = useNavigation();

  // Search text value
  const [searchQuery, setSearchQuery] = useState('');
  // status (open or closed)
  const [isSwitchOnStatus, setIsSwitchOnStatus] = useState(true);
  // availibility bikes
  const [isSwitchOnAvailableBikes, setIsSwitchOnAvailableBikes] = useState(true);

  const onChangeSearch = query => setSearchQuery(query);
  const onToggleSwitchStatus = () => setIsSwitchOnStatus(!isSwitchOnStatus);
  const onToggleSwitchAvailableBikes = () => setIsSwitchOnAvailableBikes(!isSwitchOnAvailableBikes);

  // Redirect to map screen
  const onPressSearchButton = () => navigation.navigate('MapView', {name: searchQuery, status: isSwitchOnStatus, availableBikes: isSwitchOnAvailableBikes });

  // Change header title
  useEffect(() => {
    props.navigation.setOptions({
      title: "Recherche",
    });
  }, []);

  return (
    <SafeAreaView style={styles.safeAreaView}>
        <KeyboardAvoidingView style={styles.keyboardView} behavior="padding" enabled >
    <ScrollView>
        <View style={styles.imageContainer}>
        <Image
        source={require('../images/tap_and_go.jpeg')}
        style={styles.imageView}/>
        </View>
        <View>
    <Searchbar
      placeholder="Nom de la station"
      onChangeText={onChangeSearch}
      value={searchQuery}
      style={styles.searchbarView}
    />
    <View
      style={styles.stateView}>
<Text style={styles.textStateView}>Etat (ouvert) :</Text>
<Switch color={constants.ORANGE_COLOR} value={isSwitchOnStatus} onValueChange={onToggleSwitchStatus} />
</View>
<View
      style={styles.availableBikesView}>
<Text style={styles.textAvailableBikesView} >Bicloo disponible :</Text>
<Switch color={constants.ORANGE_COLOR} value={isSwitchOnAvailableBikes} onValueChange={onToggleSwitchAvailableBikes} />
</View>
<Button style={styles.searchButton} icon="map-search-outline" mode="contained" color={constants.ORANGE_COLOR} labelStyle={{color: constants.TEXT_BUTTON_COLOR}} onPress={() => onPressSearchButton()}>
    Rechercher
  </Button>
  </View>
  </ScrollView>
  </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: 'white'
  },
  keyboardView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageView: {
    resizeMode: 'center',
    height: Dimensions.get('window').height / 2.5
  },
  searchbarView: {
    marginHorizontal: 20,
    marginBottom: 20
  },
  stateView: {
    flexDirection: 'row',
    paddingVertical: 10,
    marginHorizontal: 20,
    alignItems: 'center'
  },
  textStateView: {
    marginRight: 10
  },
  availableBikesView: {
    flexDirection: 'row',
    paddingVertical: 10,
    marginHorizontal: 20,
    alignItems: 'center'
  },
  textAvailableBikesView: {
    marginRight: 10
  },
  searchButton: {
    margin: 20
  }
});

export default Search;