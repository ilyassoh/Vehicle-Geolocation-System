import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import Qrcode from './Comp/Qrcode';
import Geo from './Comp/Geo';


//import { config } from "@gluestack-ui/config";
//import { GluestackUIProvider } from "@gluestack-ui/themed"
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
          <Stack.Navigator initialRouteName="Qrcode">
            <Stack.Screen options={{ headerShown: false }} name="Qrcode" component={Qrcode} />
             <Stack.Screen    options={{ headerShown: false }} name="Geo" component={Geo} />
        </Stack.Navigator>      
    </NavigationContainer>
  );
};

export default AppNavigator;