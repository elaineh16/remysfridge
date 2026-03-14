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
  }
]

export function RecipesTab({ fridgeItems }: RecipesTabProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const fridgeItemNames = fridgeItems.map(item => item.name.toLowerCase())

  const recipesWithMatch = RECIPES.map(recipe => {
    const matchedIngredients = recipe.ingredients.filter(ing =>
      fridgeItemNames.some(name => name.toLowerCase().includes(ing.toLowerCase()) || 
                                   ing.toLowerCase().includes(name.toLowerCase()))
    )
    const matchPercentage = Math.round((matchedIngredients.length / recipe.ingredients.length) * 100)
    return { ...recipe, matchedIngredients, matchPercentage }
  }).sort((a, b) => b.matchPercentage - a.matchPercentage)

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

        {/* Progress */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Cooking Progress</span>
            <span className="text-sm text-muted-foreground">
              {completedSteps.length}/{recipe.instructions.length} steps
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </Card>

        {/* Ingredients */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Ingredients</h3>
          <Card className="p-4">
            <div className="grid grid-cols-2 gap-2">
              {recipe.ingredients.map((ing, index) => {
                const hasIngredient = fridgeItemNames.some(
                  name => name.toLowerCase().includes(ing.toLowerCase()) ||
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

        {/* Instructions */}
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
          {recipesWithMatch.map((recipe) => (
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
          ))}
        </div>
      )}
    </div>
  )
}
