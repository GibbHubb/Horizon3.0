import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './screens/Navigation';
import ErrorBoundary from './ErrorBoundary';

export default function App() {
  const isAuthenticated = false; // Replace with actual authentication state
  const userRole = ''; // Replace with actual user role

  return (
    <ErrorBoundary>
      <NavigationContainer>
        <AppNavigator isAuthenticated={isAuthenticated} userRole={userRole} />
      </NavigationContainer>
    </ErrorBoundary>
  );
}
