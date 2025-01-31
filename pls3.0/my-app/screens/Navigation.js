import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './Login';
import ClientHome from './Client/ClientHome';
import TrainerHome from './Trainer/TrainerHome'
import WorkoutsMenu from './Trainer/WorkoutsMenu';
import EditWorkoutScreen from './Trainer/EditWorkout';
import TrainerScreen from './Trainer/TrainerScreen';
import TVScreen from './Trainer/TVScreen';
import CreateWorkout from './Trainer/CreateWorkout';

const Stack = createStackNavigator();

export default function AppNavigator({ isAuthenticated, userRole }) {
  let initialRoute = 'Login';

  if (isAuthenticated) {
    initialRoute = userRole === 'client' || userRole === 'user' ? 'ClientHome' : 'TrainerHome';
  }
  

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ClientHome" component={ClientHome} />
      <Stack.Screen name="TrainerHome" component={TrainerHome} />
      <Stack.Screen name="WorkoutsMenu" component={WorkoutsMenu} />
      <Stack.Screen name="EditWorkout" component={EditWorkoutScreen} />
      <Stack.Screen name="CreateWorkout" component={CreateWorkout} />
      <Stack.Screen name="TrainerScreen" component={TrainerScreen} />
      <Stack.Screen name="TVScreen" component={TVScreen} />
    </Stack.Navigator>
  );
}
