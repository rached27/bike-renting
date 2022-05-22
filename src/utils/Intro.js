import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';

class Intro extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Bienvenue sur React Native !</Text>
        <Text style={styles.instructions}>
          C'est un test de snapshot pour React Native.
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    flex: 1,
    justifyContent: 'center',
  },
  instructions: {
    color: '#333333',
    marginBottom: 5,
    textAlign: 'center',
  },
  welcome: {
    fontSize: 20,
    margin: 10,
    textAlign: 'center',
  },
});

export default Intro;