// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from './components/HeaderButton';
import { FAB, Provider as PaperProvider } from 'react-native-paper';


const initialTasks = [
  { id: '1', title: 'Complete Project', status: 'Pending' },
  { id: '2', title: 'Team Meeting', status: 'Completed' },
];

function AllTasksScreen({ navigation, route }) {
  const [tasks, setTasks] = React.useState(initialTasks);
  const newTask = route.params?.newTask;

  React.useEffect(() => {
    if (newTask && !tasks.find((t) => t.id === newTask.id)) {
      setTasks((prev) => [...prev, newTask]);
      Alert.alert('New Task Added', `Task: ${newTask.title}`);
    }
  }, [newTask]);

  return (
    <PaperProvider>
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.setParams({
          newTask: { id: String(Date.now()), title: 'New Task', status: 'Pending' },
        })}
      />
      <View style={styles.screen}>
        <Text style={styles.title}>All Tasks</Text>
        {tasks.map((task) => (
          <Text
            key={task.id}
            style={styles.taskItem}
            onPress={() =>
              navigation.navigate('TaskDetails', {
                task,
                updateStatus: (id, status) => {
                  setTasks((prev) =>
                    prev.map((t) =>
                      t.id === id ? { ...t, status } : t
                    )
                  );
                  Alert.alert('Status Updated', `Task ${id} is now ${status}`);
                },
              })
            }
          >
            {task.title} - {task.status}
          </Text>
        ))}
      </View>
    </PaperProvider>
  );
}

function CompletedTasksScreen({ navigation }) {
  const completedTasks = initialTasks.filter((t) => t.status === 'Completed');
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Completed Tasks</Text>
      {completedTasks.map((task) => (
        <Text
          key={task.id}
          style={styles.taskItem}
          onPress={() => navigation.navigate('TaskDetails', { task })}
        >
          {task.title} - {task.status}
        </Text>
      ))}
    </View>
  );
}

function TaskDetailsScreen({ route }) {
  const { task, updateStatus } = route.params;

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Task Details</Text>
      <Text style={styles.text}>Title: {task.title}</Text>
      <Text style={styles.text}>Status: {task.status}</Text>
      {updateStatus && (
        <Button
          title="Toggle Status"
          onPress={() =>
            updateStatus(task.id, task.status === 'Pending' ? 'Completed' : 'Pending')
          }
        />
      )}
    </View>
  );
}

function ProfileScreen({ route, navigation }) {
  const { userName = 'Guest' } = route.params || {};

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title="Home"
            iconName="home"
            onPress={() => navigation.navigate('Home')}
          />
        </HeaderButtons>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.text}>Welcome, {userName}!</Text>
      <Button
        title="Change Name"
        onPress={() => navigation.setParams({ userName: 'John Doe' })}
      />
    </View>
  );
}

const Tab = createBottomTabNavigator();
function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons = {
            AllTasks: 'list',
            Completed: 'checkmark-done',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        headerStyle: { backgroundColor: '#6200ee' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      })}
    >
      <Tab.Screen
        name="AllTasks"
        component={AllTasksScreen}
        initialParams={{ newTask: null }}
        options={{ title: 'All Tasks', headerShown: false }}
      />
      <Tab.Screen name="Completed" component={CompletedTasksScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();
function TaskStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#6200ee' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="Home" component={HomeTabs} options={{ title: 'Task Manager', headerShown: false }} />
      <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} />
    </Stack.Navigator>
  );
}

const Drawer = createDrawerNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#6200ee' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Drawer.Screen name="Home" component={TaskStack} />
        <Drawer.Screen
          name="Profile"
          component={ProfileScreen}
          initialParams={{ userName: 'Guest' }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    alignSelf: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 8,
  },
  taskItem: {
    fontSize: 16,
    padding: 10,
    marginVertical: 4,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#eee',
  }
});
