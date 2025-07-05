import 
{ 
    View, 
    Text, 
    TextInput,
    FlatList
} from 'react-native'
import { MealAPI } from '../../services/mealAPI';
import { searchStyles } from '../../assets/styles/search.styles';
import { useState, useEffect } from 'react';
import { useDebounce } from "../../hooks/useDebounce"
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from '../../constants/colors';
import RecipeCard from '../../components/RecipeCard';
import LoadingSpinner from '../../components/LoadingSpinner';


const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitiaLoading] = useState(true);

  const debouncedSearchQuery = useDebounce(searchQuery, 300); // Perform search only after 300 milliseconds

  const performSearch = async (query) => {

    // If there is no search query to be requested
    if (!query.trim) {
      const randomMeals = await MealAPI.getRandomMeals(12);
      return randomMeals
        .map( meal => MealAPI.transformMealData(meal) )
        .filter(meal => meal !== null)
    }

    // First search by name, then by ingredient if no results
    const nameResults = await MealAPI.searchMealsByName(query);
    
    let results = nameResults;

    if (results.length === 0) {
      const ingredientResults = await MealAPI.filterByIngredient(query);
      results = ingredientResults;
    }

    return results
      .slice(0, 12) // Get the top 12 results
      .map(meal => MealAPI.transformMealData(meal)) // Since it is in JSON file, transform into a clean structured object
      .filter(meal => meal !== null); // Filter out null values (so only with data is returned)  
  }

  // This effect is the default state when the user goes to Search Tab
  useEffect(()=> {
    const loadInitialData = async () => {
      try
      {
        const results = await performSearch("");
        setRecipes(results);
      } 
      catch(error)
      {
        console.error("Error loading initial data: ", error);
      }
      finally
      {
        setInitiaLoading(false);
      }
    }

    loadInitialData();
  }, [])

  // This effect is when a user performs a search query
  useEffect(() => {
    if (initialLoading) {
      return;
    }

    const handleSearch = async () => {
      setLoading(true);

      try 
      {
        const results = await performSearch(debouncedSearchQuery);

        setRecipes(results);
      } 
      catch (error)
      {
        console.error("Error Searching: ", error);
        setRecipes([]);
      } 
      finally 
      {
        setLoading(false);
      }
    };

    handleSearch();
  }, [debouncedSearchQuery, initialLoading]); // dependency array, every time a debouncedSearchQuery or initialLoading's state changes
  // run the effect (it will not run if there is no changes)

  if (initialLoading) {
    return <LoadingSpinner message="Loading some data..." />
  }

  return (
    <View style={searchStyles.container}>
      <View style={searchStyles.searchSection}>
        <View style={searchStyles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={COLORS.textLight}
            style={searchStyles.searchItem}
          />

          <TextInput 
            style={searchStyles.searchInput}
            placeholder="Search recipes, ingredients..."
            placeholderTextColor={COLORS.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
        </View>

      </View>

      <View style={searchStyles.resultsSection}>
        <View style={searchStyles.resultsHeader}>
          <Text style={searchStyles.resultsTitle}>
            {searchQuery ? `Results for "${searchQuery}"` : "Popular Reciples" }
          </Text>
          <Text style={searchStyles.resultsCount}>{recipes.length} found</Text>
        </View>


        {loading ? 
        (
          <View style={searchStyles.loadingContainer}>
            <LoadingSpinner message="Searching recipes..." size="small" />
          </View>
        ) : (
          <FlatList 
            data={recipes}
            renderItem={({item}) => <RecipeCard recipe={item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={searchStyles.row}
            contentContainerStyle={searchStyles.recipesGrid}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<NoResultsFound />}
          />
        )}

      </View>
    </View>
  )
}

export default SearchScreen;

function NoResultsFound() {
  return (
    <View style={searchStyles.emptyState}>
      <Ionicons name="search-outline" size={64} color={COLORS.textLight} />
      <Text style={searchStyles.emptyTitle}>No recipes found</Text>
      <Text style={searchStyles.emptyDescription}>
        Try different keywords
      </Text>
    </View>
  )
}