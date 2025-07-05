import 
{ 
    View, 
    Text, 
    ScrollView,
    TouchableOpacity,
    FlatList,
    Alert
} from 'react-native';

import { useClerk, useUser } from '@clerk/clerk-expo';
import { useEffect, useState } from 'react';
import { API_URL } from '../../constants/api';
import {favoritesStyles } from '../../assets/styles/favorites.styles'
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from '../../constants/colors';
import NoFavoritesFound from '../../components/NoFavoritesFound';
import LoadingSpinner from '../../components/LoadingSpinner';
import RecipeCard from '../../components/RecipeCard';


const FavoritesScreen = () => {

  const { signOut } = useClerk(); // useClerk provides the signOut method directly 
  // useSignUp, useSignIn - more specialized as they are related to flow 
  const { user } = useUser(); // used to access the current user's information, including their userId,
  // email, name, or any other profile data enabled.
  const [ favoriteRecipes, setFavoriteRecipes ] = useState([]);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    if (!user || !user.id) {
      setFavoriteRecipes([]); // Optionally clear favorites on logout
      setLoading(false);      // Stop loading spinner if no user
      return;
    }

    const loadFavorites = async() => {
      try
      {
        const response = await fetch(`${API_URL}/favorites/${user.id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch favorites");
        }

        const favorites = await response.json();

        // Has to transform the id since it needs to match the RecipeCard component
        // is compatible
        const transformedFavorites = favorites.map(favorite => ({
          ...favorite, // copies all properties from the favorite object into a new object 
          id: favorite.recipeId, // except id, will be overriden with the value of favorite.recipeId
        }));

        setFavoriteRecipes(transformedFavorites);

      }
      catch(error)
      {
        Alert.alert("Error", "Failed to load favorites");
        console.error("Error loading favorites: ", error);
      }
      finally
      {
        setLoading(false);
      }
    }

    loadFavorites();
  }, [user.id]) // Run whenever the user.id changes


  const handleSignOut = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {"text": "Cancel", style: "cancel"},
      {"text": "Logout", style: "destructive", onPress: signOut }
    ]);
  };

  if (loading) return <LoadingSpinner message="Loading your favorites..." />;



  return (
    <View style={favoritesStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        <View style={favoritesStyles.header}>
          <Text style={favoritesStyles.title}>
            Favorites
          </Text>
          
          <TouchableOpacity
            style={favoritesStyles.logoutButton}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>
       
       <View style={favoritesStyles.recipesSection}>
        <FlatList
          data={favoriteRecipes}
          renderItem={({item}) => <RecipeCard recipe={item} />}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={favoritesStyles.row}
          contentContainerStyle={favoritesStyles.recipesGrid}
          scrollEnabled={false}
          ListEmptyComponent={<NoFavoritesFound />}
        />
       </View>
   
      </ScrollView>
    </View>
  )


}

export default FavoritesScreen;

 