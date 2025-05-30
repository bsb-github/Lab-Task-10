import { registerRootComponent } from 'expo';

import App from './App';
import Activity from './Activity';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately

// To run Activity uncomment the following line
// registerRootComponent(Activity);
// To run Task Management uncomment the following line
registerRootComponent(App);
// Make Sure Only one of the above lines is uncommented at a time