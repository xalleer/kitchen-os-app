import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import {CustomHeader} from "@/components/ui/CustomHeader";


export default function TabsLayout() {

    const getRouteName = (name: string) => {
        switch (name) {
            case 'shop': return 'Магазин';
            case 'index': return 'Головна';
            case 'dishes': return 'Страви';
            case 'plans': return 'Календар';
            case 'fridge': return 'Холодильник';
            default: return  'Головна'
        }
    }

    return (
        <Tabs

            screenOptions={{
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: '#8E9AAF',
                tabBarShowLabel: true,
                tabBarStyle: styles.tabBar,
                headerShown: true,
                headerShadowVisible: true,
                header: (nav) => <CustomHeader title={getRouteName(nav.route.name)} subtitle={'Kitchen OS'} showAvatar={true}/>,
                tabBarHideOnKeyboard: true
            }}
        >
            <Tabs.Screen
                name="shop"
                options={{
                    tabBarLabel: 'Магазин',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="fast-food" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="fridge"
                options={{
                    tabBarLabel: 'Холодильник',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="fridge-outline" size={24} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="index"
                options={{
                    tabBarLabel: 'Головна',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="home-sharp" size={24} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="dishes"
                options={{
                    tabBarLabel: 'Страви',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="document" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="plans"
                options={{
                    tabBarLabel: 'Календар',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="calendar-sharp" size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 40,
        height: 90,
        elevation: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.8,
        shadowRadius: 6,
        borderTopWidth: 0,
        paddingBottom: 0,
    },


});