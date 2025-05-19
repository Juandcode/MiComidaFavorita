import {NavigationContainer} from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import {createNativeStackNavigator} from "@react-navigation/native-stack";


const Stack = createNativeStackNavigator();
export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator id="RootStack" initialRouteName="Login">
                <Stack.Screen name={"Login"} component={LoginScreen} options={{headerShown: false}}/>
                <Stack.Screen name={"Register"} component={RegisterScreen} options={{headerShown: false}}/>
                <Stack.Screen name={"Home"} component={HomeScreen} options={{headerShown: true, title: "Mi Perfil"}}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}
