import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { ProfileHeader } from '@/components/navigation/ProfileHeader';
import { useTranslation } from 'react-i18next';

export default function TabsLayout() {
    const { t } = useTranslation();

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
                    tabBarLabel: t('TABS.HOME'),
                    headerTitle: '',
                    header: () => <ProfileHeader />,
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="home-outline" size={24} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="recipes"
                options={{
                    tabBarLabel: t('TABS.RECIPES'),
                    headerTitle: '',
                    header: () => <ProfileHeader />,
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="restaurant-outline" size={24} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="shopping-list"
                options={{
                    tabBarLabel: t('TABS.SHOPPING'),
                    headerTitle: t('TABS.SHOPPING_LIST_TITLE'),
                    header: () => <ProfileHeader />,
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="cart-outline" size={24} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="fridge"
                options={{
                    tabBarLabel: t('TABS.FRIDGE'),
                    headerTitle: t('TABS.MY_PRODUCTS_TITLE'),
                    header: () => <ProfileHeader />,
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="fridge-outline" size={24} color={color} />
                    ),
                }}
            />


            <Tabs.Screen
                name="plans"
                options={{
                    tabBarLabel: t('TABS.PLANS'),
                    headerTitle: t('TABS.MEAL_PLAN_TITLE'),
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="calendar-outline" size={24} color={color} />
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