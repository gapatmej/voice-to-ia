/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import ExpensesScreen from './modules/configurations/expenses/ExpenseScreen';
import { DatabaseProvider, useDatabase } from './databaseUtil/DatabaseContext';

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

  return <ExpensesScreen />;
}

function App(): React.JSX.Element {
  return (
    <DatabaseProvider>
      <AppContent />
    </DatabaseProvider>
  );
}

export default App;
