export interface ScannedItem {
  id: string
  name: string
  emoji: string
  price: number
  quantity: number
  selected: boolean
}

export interface FridgeItem {
  id: string
  name: string
  emoji: string
  quantity: number
  category: "Fruits" | "Vegetables" | "Proteins" | "Dairy" | "Grains" | "Other"
  dateAdded: Date
}

export interface Recipe {
  id: string
  name: string
  emoji: string
  cookTime: number
  calories: number
  difficulty: "Easy" | "Medium" | "Hard"
  ingredients: string[]
  instructions: string[]
  image: string
}
