import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Search from './src/screens/SearchView';
import MapView from './src/screens/MapView';
const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Search" component={Search} options={{ headerShown: false }}/>
        <Stack.Screen name="MapView" component={MapView}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;