import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { ProfileHeader } from '@/components/navigation/ProfileHeader';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: '#8E9AAF',
                tabBarShowLabel: true,
                tabBarStyle: styles.tabBar,
                headerShown: true,
                headerShadowVisible: true,
                tabBarHideOnKeyboard: true,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarLabel: 'Головна',
                    headerTitle: '',
                    header: () => <ProfileHeader />,
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="home-sharp" size={24} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="shop"
                options={{
                    tabBarLabel: 'Магазин',
                    headerTitle: 'Список покупок',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="cart" size={24} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="fridge"
                options={{
                    tabBarLabel: 'Холодильник',
                    headerTitle: 'Мої продукти',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="fridge-outline" size={24} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="plans"
                options={{
                    tabBarLabel: 'Меню',
                    headerTitle: 'План харчування',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="calendar-sharp" size={24} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    href: null,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 40,
        height: 80,
        elevation: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.8,
        shadowRadius: 6,
        borderTopWidth: 0,
        paddingBottom: 0,
    },
});