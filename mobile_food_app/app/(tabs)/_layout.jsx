import { Stack, Tabs } from 'expo-router'
import { Redirect } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

const TabsLayout = () => {
    const { isSignedIn } = useAuth();

    if (!isSignedIn) {
        return <Redirect href={'/{auth}/sign-in'} />
    }

    return ( 
        <Tabs
            screenOptions={{ 
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textLight,
                tabBarStyle:  
                {
                    backgroundColor: COLORS.white,
                    borderTopColor: COLORS.border,
                    borderTopWidth: 1,
                    paddingBottom: 8,
                    paddingTop: 8,
                    height: 80,
                },
                tabBarLabelStyle: 
                {
                    fontSize: 12,
                    fontWeight: "600",
                },
                headerStyle: 
                {
                    backgroundColor: COLORS.background,
                    borderBottomColor: COLORS.border,
                    borderBottomWidth: 1,
                }
            }}
        > 
            {/* Tabs.Screen is a Child of Tabs */}
            <Tabs.Screen 
                name="index" // Should match to the file name index.jsx
                options=
                {{
                    title:"Recipes",
                    tabBarIcon: ( {color, size} ) => 
                    <Ionicons 
                        name="restaurant" 
                        size={size}
                        color={color}
                    />
                }}
            />

            <Tabs.Screen
                name="search" // Should match to the file name search.jsx
                options=
                {{
                    title:"Search",
                    tabBarIcon: ( {color, size} ) => 
                    <Ionicons 
                        name="search" 
                        size={size}
                        color={color}
                    />
                }}
            />

             <Tabs.Screen
                name="favorites" // Should match to the file name favorites.jsx
                options=
                {{
                    title:"Favorites",
                    tabBarIcon: ( {color, size} ) => 
                    <Ionicons 
                        name="heart" 
                        size={size}
                        color={color}
                    />
                }}
            />

        </Tabs>
    );
};

export default TabsLayout;