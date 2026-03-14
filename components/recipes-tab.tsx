"use client"

import { useState } from "react"
import { Clock, Flame, ChefHat, ArrowLeft, Check, ShoppingCart } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Recipe, FridgeItem } from "@/lib/types"

interface RecipesTabProps {
  fridgeItems: FridgeItem[]
}

type MealType = "any" | "breakfast" | "lunch" | "dinner" | "snack"
type Cuisine = "any" | "italian" | "asian" | "mexican" | "mediterranean" | "american"
type CalorieRange = "any" | "under-300" | "300-500" | "500-700"

const RECIPES: Recipe[] = [
  {
    id: "1",
    name: "Avocado Toast with Eggs",
    emoji: "🥑",
    cookTime: 15,
    calories: 380,
    difficulty: "Easy",
    ingredients: ["Avocados", "Sourdough Bread", "Brown Eggs", "Fresh Spinach"],
    instructions: [
      "Toast the sourdough bread until golden brown",
      "While toasting, mash the avocado with salt, pepper, and a squeeze of lemon",
      "Fry or poach the eggs to your preference",
      "Spread the mashed avocado on toast",
      "Top with eggs and fresh spinach",
      "Season with salt, pepper, and red pepper flakes"
    ],
    image: "🍳"
  },
  {
    id: "2",
    name: "Greek Yogurt Parfait",
    emoji: "🥛",
    cookTime: 5,
    calories: 280,
    difficulty: "Easy",
    ingredients: ["Greek Yogurt", "Organic Bananas"],
    instructions: [
      "Slice the bananas into rounds",
      "Layer Greek yogurt in a glass or bowl",
      "Add a layer of sliced bananas",
      "Repeat layers until glass is full",
      "Optional: drizzle with honey or add granola"
    ],
    image: "🍨"
  },
  {
    id: "3",
    name: "Chicken Stir Fry",
    emoji: "🍗",
    cookTime: 25,
    calories: 420,
    difficulty: "Medium",
    ingredients: ["Chicken Breast", "Baby Carrots", "Fresh Spinach"],
    instructions: [
      "Slice chicken breast into thin strips",
      "Heat oil in a wok or large pan over high heat",
      "Cook chicken until golden, about 5-6 minutes",
      "Add sliced carrots and cook for 3 minutes",
      "Add spinach and stir until wilted",
      "Season with soy sauce, garlic, and ginger",
      "Serve over rice or noodles"
    ],
    image: "🥘"
  },
  {
    id: "4",
    name: "Fresh Garden Salad",
    emoji: "🥗",
    cookTime: 10,
    calories: 180,
    difficulty: "Easy",
    ingredients: ["Roma Tomatoes", "Fresh Spinach", "Avocados", "Baby Carrots"],
    instructions: [
      "Wash and dry all vegetables",
      "Chop tomatoes into wedges",
      "Slice avocados and carrots",
      "Arrange spinach as base in a large bowl",
      "Top with tomatoes, avocados, and carrots",
      "Drizzle with olive oil and balsamic vinegar"
    ],
    image: "🥗"
  },
  {
    id: "5",
    name: "Banana Smoothie Bowl",
    emoji: "🍌",
    cookTime: 10,
    calories: 320,
    difficulty: "Easy",
    ingredients: ["Organic Bananas", "Greek Yogurt", "Whole Milk"],
    instructions: [
      "Freeze bananas for at least 2 hours",
      "Blend frozen bananas with yogurt and milk",
      "Pour into a bowl",
      "Top with sliced fresh bananas",
      "Add your favorite toppings like seeds or honey"
    ],
    image: "🥣"
  },
  {
    id: "6",
    name: "Tomato Bruschetta",
    emoji: "🍅",
    cookTime: 15,
    calories: 220,
    difficulty: "Easy",
    ingredients: ["Roma Tomatoes", "Sourdough Bread"],
    instructions: [
      "Dice tomatoes and season with salt, basil, and garlic",
      "Let tomato mixture sit for 10 minutes",
      "Toast sourdough slices until crispy",
      "Rub toast with a garlic clove",
      "Top with tomato mixture",
      "Drizzle with olive oil and serve"
    ],
    image: "🥖"
  },
  {
    id: "7",
    name: "Veggie Omelette",
    emoji: "🍳",
    cookTime: 15,
    calories: 310,
    difficulty: "Easy",
    ingredients: ["Brown Eggs", "Fresh Spinach", "Roma Tomatoes", "Cheese"],
    instructions: [
      "Crack eggs into a bowl and whisk with a pinch of salt",
      "Heat butter in a non-stick pan over medium heat",
      "Pour in eggs and let them set slightly at the edges",
      "Add spinach, diced tomatoes, and cheese on one half",
      "Fold the omelette over the filling",
      "Slide onto a plate and serve immediately"
    ],
    image: "🍳"
  },
  {
    id: "8",
    name: "Carrot & Ginger Soup",
    emoji: "🥕",
    cookTime: 35,
    calories: 210,
    difficulty: "Easy",
    ingredients: ["Baby Carrots", "Whole Milk", "Chicken Breast"],
    instructions: [
      "Chop carrots and sauté in a pot with olive oil for 5 minutes",
      "Add grated ginger and garlic, cook for 1 minute",
      "Pour in vegetable broth and bring to a boil",
      "Simmer for 20 minutes until carrots are tender",
      "Blend until smooth using an immersion blender",
      "Stir in milk and season with salt and pepper",
      "Serve warm with crusty bread"
    ],
    image: "🍲"
  },
  {
    id: "9",
    name: "Spinach & Egg Scramble",
    emoji: "🥚",
    cookTime: 10,
    calories: 260,
    difficulty: "Easy",
    ingredients: ["Brown Eggs", "Fresh Spinach", "Cheese"],
    instructions: [
      "Whisk eggs with a splash of milk, salt, and pepper",
      "Heat a pan over medium-low heat and add butter",
      "Add spinach and cook until wilted, about 2 minutes",
      "Pour in eggs and gently stir with a spatula",
      "Remove from heat when eggs are just set",
      "Top with shredded cheese and serve"
    ],
    image: "🍳"
  },
  {
    id: "10",
    name: "Pasta Primavera",
    emoji: "🍝",
    cookTime: 30,
    calories: 480,
    difficulty: "Medium",
    ingredients: ["Fresh Spinach", "Roma Tomatoes", "Baby Carrots", "Cheese"],
    instructions: [
      "Cook pasta in salted boiling water until al dente",
      "Sauté carrots in olive oil for 3 minutes",
      "Add tomatoes and cook until they soften",
      "Toss in spinach and stir until wilted",
      "Drain pasta and add to the vegetable pan",
      "Toss with olive oil, salt, pepper, and grated cheese",
      "Serve immediately with extra cheese on top"
    ],
    image: "🍝"
  },
  {
    id: "11",
    name: "Chicken Caesar Wrap",
    emoji: "🌯",
    cookTime: 20,
    calories: 520,
    difficulty: "Medium",
    ingredients: ["Chicken Breast", "Fresh Spinach", "Sourdough Bread", "Cheese"],
    instructions: [
      "Season chicken with salt, pepper, and garlic powder",
      "Cook chicken in a pan over medium heat until golden, about 6 minutes per side",
      "Let rest for 5 minutes then slice thinly",
      "Warm the bread or use a tortilla as the wrap base",
      "Layer spinach, sliced chicken, and cheese",
      "Drizzle with Caesar dressing",
      "Roll tightly and slice in half to serve"
    ],
    image: "🌯"
  },
  {
    id: "12",
    name: "Banana Pancakes",
    emoji: "🥞",
    cookTime: 20,
    calories: 350,
    difficulty: "Easy",
    ingredients: ["Organic Bananas", "Brown Eggs", "Whole Milk"],
    instructions: [
      "Mash two ripe bananas in a bowl until smooth",
      "Whisk in eggs and milk until combined",
      "Add flour, baking powder, and a pinch of salt",
      "Heat a lightly buttered pan over medium heat",
      "Pour small rounds of batter and cook until bubbles form",
      "Flip and cook for another minute",
      "Serve with sliced banana and maple syrup"
    ],
    image: "🥞"
  },
  {
    id: "13",
    name: "Caprese Salad",
    emoji: "🍅",
    cookTime: 5,
    calories: 240,
    difficulty: "Easy",
    ingredients: ["Roma Tomatoes", "Cheese", "Avocados"],
    instructions: [
      "Slice tomatoes and fresh mozzarella into rounds",
      "Slice avocado into thin pieces",
      "Alternate tomato, cheese, and avocado on a plate",
      "Drizzle generously with olive oil",
      "Season with salt, pepper, and fresh basil",
      "Serve immediately as a starter or side"
    ],
    image: "🥗"
  },
  {
    id: "14",
    name: "Teriyaki Chicken Bowl",
    emoji: "🍱",
    cookTime: 30,
    calories: 550,
    difficulty: "Medium",
    ingredients: ["Chicken Breast", "Baby Carrots", "Fresh Spinach"],
    instructions: [
      "Cook rice according to package instructions",
      "Slice chicken into bite-sized pieces",
      "Cook chicken in a pan with oil over medium-high heat",
      "Pour teriyaki sauce over chicken and simmer for 3 minutes",
      "Steam carrots for 4 minutes until tender",
      "Assemble bowl with rice, chicken, carrots, and spinach",
      "Drizzle with extra teriyaki sauce and sesame seeds"
    ],
    image: "🍱"
  },
  {
    id: "15",
    name: "Tomato Egg Drop Soup",
    emoji: "🍜",
    cookTime: 15,
    calories: 160,
    difficulty: "Easy",
    ingredients: ["Roma Tomatoes", "Brown Eggs"],
    instructions: [
      "Dice tomatoes and sauté in a pot with oil for 3 minutes",
      "Add 3 cups of chicken or vegetable broth and bring to a boil",
      "Season with salt, pepper, and a pinch of sugar",
      "Whisk eggs in a bowl",
      "Slowly drizzle eggs into the simmering soup while stirring",
      "Cook for 1 more minute until eggs are set",
      "Garnish with green onions and sesame oil"
    ],
    image: "🍜"
  },
  {
    id: "16",
    name: "Avocado & Spinach Smoothie",
    emoji: "🥤",
    cookTime: 5,
    calories: 290,
    difficulty: "Easy",
    ingredients: ["Avocados", "Fresh Spinach", "Organic Bananas", "Whole Milk"],
    instructions: [
      "Peel and pit the avocado",
      "Peel and slice the banana",
      "Add avocado, banana, and spinach to a blender",
      "Pour in milk and add a handful of ice",
      "Blend on high until completely smooth",
      "Taste and add honey if desired",
      "Pour into a glass and serve immediately"
    ],
    image: "🥤"
  }
]

export function RecipesTab({ fridgeItems }: RecipesTabProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [mealType, setMealType] = useState<MealType>("any")
  const [cuisine, setCuisine] = useState<Cuisine>("any")
  const [calories, setCalories] = useState<CalorieRange>("any")

  const fridgeItemNames = fridgeItems.map(item => item.name.toLowerCase())

  const recipesWithMatch = RECIPES.map(recipe => {
    const matchedIngredients = recipe.ingredients.filter(ing =>
      fridgeItemNames.some(name =>
        name.toLowerCase().includes(ing.toLowerCase()) ||
        ing.toLowerCase().includes(name.toLowerCase())
      )
    )
    const matchPercentage = Math.round((matchedIngredients.length / recipe.ingredients.length) * 100)
    return { ...recipe, matchedIngredients, matchPercentage }
  })
    .filter(recipe => {
      const name = recipe.name.toLowerCase()
      const isBreakfast = /toast|parfait|bowl|breakfast|pancake|scramble|omelette|smoothie/.test(name)
      const isLunch = /salad|sandwich|wrap|soup|caprese/.test(name)
      const isDinner = /stir fry|bruschetta|chicken|pasta|dinner|teriyaki|bowl/.test(name)
      const isSnack = /parfait|bruschetta|snack|smoothie/.test(name)

      if (mealType === "breakfast" && !isBreakfast) return false
      if (mealType === "lunch" && !isLunch) return false
      if (mealType === "dinner" && !isDinner) return false
      if (mealType === "snack" && !isSnack) return false

      const n = recipe.name.toLowerCase()
      const isItalian = /bruschetta|pasta|caprese/.test(n)
      const isAsian = /stir fry|teriyaki|egg drop|bowl/.test(n)
      const isMexican = /taco|burrito|wrap/.test(n)
      const isMediterranean = /salad|yogurt|avocado|caprese/.test(n)
      const isAmerican = /toast|bowl|parfait|pancake|scramble|omelette/.test(n)

      if (cuisine === "italian" && !isItalian) return false
      if (cuisine === "asian" && !isAsian) return false
      if (cuisine === "mexican" && !isMexican) return false
      if (cuisine === "mediterranean" && !isMediterranean) return false
      if (cuisine === "american" && !isAmerican) return false

      if (calories === "under-300" && !(recipe.calories < 300)) return false
      if (calories === "300-500" && !(recipe.calories >= 300 && recipe.calories <= 500)) return false
      if (calories === "500-700" && !(recipe.calories > 500 && recipe.calories <= 700)) return false

      return true
    })
    .sort((a, b) => b.matchPercentage - a.matchPercentage)

  const toggleStep = (index: number) => {
    setCompletedSteps(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    )
  }

  if (selectedRecipe) {
    const recipe = recipesWithMatch.find(r => r.id === selectedRecipe.id) || selectedRecipe
    const progress = (completedSteps.length / recipe.instructions.length) * 100

    return (
      <div className="flex flex-col gap-6 pb-24">
        <Button
          variant="ghost"
          className="w-fit gap-2 -ml-2"
          onClick={() => {
            setSelectedRecipe(null)
            setCompletedSteps([])
          }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to recipes
        </Button>

        <div className="text-center">
          <span className="text-6xl">{recipe.emoji}</span>
          <h2 className="text-2xl font-bold text-foreground mt-4">{recipe.name}</h2>
          <div className="flex items-center justify-center gap-4 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {recipe.cookTime} min
            </span>
            <span className="flex items-center gap-1">
              <Flame className="h-4 w-4" />
              {recipe.calories} cal
            </span>
            <Badge variant="secondary">{recipe.difficulty}</Badge>
          </div>
        </div>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Cooking Progress</span>
            <span className="text-sm text-muted-foreground">
              {completedSteps.length}/{recipe.instructions.length} steps
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </Card>

        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Ingredients</h3>
          <Card className="p-4">
            <div className="grid grid-cols-2 gap-2">
              {recipe.ingredients.map((ing, index) => {
                const hasIngredient = fridgeItemNames.some(
                  name =>
                    name.toLowerCase().includes(ing.toLowerCase()) ||
                    ing.toLowerCase().includes(name.toLowerCase())
                )
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-2 p-2 rounded-lg ${
                      hasIngredient ? "bg-success/10" : "bg-muted"
                    }`}
                  >
                    {hasIngredient ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className={`text-sm ${hasIngredient ? "text-foreground" : "text-muted-foreground"}`}>
                      {ing}
                    </span>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Instructions</h3>
          <div className="space-y-3">
            {recipe.instructions.map((step, index) => (
              <Card
                key={index}
                className={`p-4 cursor-pointer transition-all ${
                  completedSteps.includes(index)
                    ? "bg-success/10 border-success/30"
                    : "bg-card hover:bg-muted"
                }`}
                onClick={() => toggleStep(index)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                      completedSteps.includes(index)
                        ? "bg-success text-success-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {completedSteps.includes(index) ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <p
                    className={`text-sm leading-relaxed ${
                      completedSteps.includes(index)
                        ? "text-muted-foreground line-through"
                        : "text-foreground"
                    }`}
                  >
                    {step}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 pb-24">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Suggested Recipes</h2>
        <p className="text-sm text-muted-foreground">
          Based on {fridgeItems.length} items in your fridge
        </p>
      </div>

      <Card className="p-3 space-y-3">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Dining preferences
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground w-16">Meal</span>
              {[
                { id: "any", label: "Any" },
                { id: "breakfast", label: "Breakfast" },
                { id: "lunch", label: "Lunch" },
                { id: "dinner", label: "Dinner" },
                { id: "snack", label: "Snack" },
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setMealType(option.id as MealType)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    mealType === option.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted text-foreground border-transparent hover:bg-muted/80"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground w-16">Cuisine</span>
              {[
                { id: "any", label: "Any" },
                { id: "italian", label: "Italian" },
                { id: "asian", label: "Asian" },
                { id: "mexican", label: "Mexican" },
                { id: "mediterranean", label: "Mediterranean" },
                { id: "american", label: "American" },
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setCuisine(option.id as Cuisine)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    cuisine === option.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted text-foreground border-transparent hover:bg-muted/80"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground w-16">Calories</span>
              {[
                { id: "any", label: "Any" },
                { id: "under-300", label: "Under 300" },
                { id: "300-500", label: "300–500" },
                { id: "500-700", label: "500–700" },
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setCalories(option.id as CalorieRange)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    calories === option.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted text-foreground border-transparent hover:bg-muted/80"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {fridgeItems.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <ChefHat className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground">No ingredients yet</p>
              <p className="text-sm text-muted-foreground">
                Add items to your fridge to get recipe suggestions
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {recipesWithMatch.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No recipes match your filters. Try adjusting your preferences.
              </p>
            </Card>
          ) : (
            recipesWithMatch.map((recipe) => (
              <Card
                key={recipe.id}
                className="p-4 cursor-pointer hover:bg-muted transition-all"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <div className="flex gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-muted text-3xl">
                    {recipe.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-foreground">{recipe.name}</h3>
                      <Badge
                        variant={recipe.matchPercentage >= 75 ? "default" : "secondary"}
                        className={recipe.matchPercentage >= 75 ? "bg-success text-success-foreground" : ""}
                      >
                        {recipe.matchPercentage}% match
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {recipe.cookTime} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="h-3 w-3" />
                        {recipe.calories} cal
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {recipe.matchedIngredients.slice(0, 3).map((ing, i) => (
                        <Badge key={i} variant="outline" className="text-xs bg-success/10 border-success/30 text-success">
                          {ing}
                        </Badge>
                      ))}
                      {recipe.matchedIngredients.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{recipe.matchedIngredients.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}