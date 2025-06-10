/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import ExpensesScreen from './modules/configurations/expenses/ExpenseScreen';
import {DatabaseProvider, useDatabase} from './databaseUtil/DatabaseContext';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import HomeScreen from './modules/main/HomeScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import ExpenseDetailReportScreen from './modules/main/ExpenseDetailReport/ExpenseDetailReportScreen';

const Drawer = createDrawerNavigator();


function AppContent() {
  const {isDBReady} = useDatabase();

  if (!isDBReady) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
        <Text>Cargando base de datos...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Tipos de Gastos" component={ExpensesScreen} />
        <Drawer.Screen name="Reporte" component={ExpenseDetailReportScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

function App(): React.JSX.Element {
  return (
    <DatabaseProvider>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </DatabaseProvider>
  );
}

export default App;
