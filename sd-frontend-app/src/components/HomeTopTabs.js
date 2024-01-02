import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Generate from '../screens/Generate';
import MyModel from '../screens/MyModel';
import { theme } from '../core/theme';

const Tab = createMaterialTopTabNavigator();

export default function HomeTopTabs() {
    return (
        <Tab.Navigator
            initialRouteName="Generate"
            screenOptions={{
                tabBarIndicatorStyle: { backgroundColor: theme.colors.primary },
            }}>
            <Tab.Screen
                name="Generate"
                component={Generate} />
            <Tab.Screen
                name="My Model"
                component={MyModel} />
        </Tab.Navigator>
    );
}