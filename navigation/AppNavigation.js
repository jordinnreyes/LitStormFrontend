//import Login from '../app/Login';
/*
import BottomTabs from '../screens/BottomTabs';
import Profile from '../screens/Profile';
*/
/*

const Stack = createNativeStackNavigator();
const AppNavigation = () => {
  const [token, setAuth] = useState('');

  const handleAuthenticate = (t) => {
    setAuth(t);
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Register">
          <Stack.Screen name="Login" options={{ headerShown: false }} >

          {props => <Login {...props} handleAuthenticate={handleAuthenticate} />}

        </Stack.Screen>

        <Stack.Screen name="Register" options={{ headerShown: false }} component={Register} />

        <Stack.Screen name="BottomTabs" options={{ headerShown: false }} component={BottomTabs}/>
      </Stack.Navigator>
    </NavigationContainer>
  )

}

export default AppNavigation;
*/