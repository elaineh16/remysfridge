"use client"

import { useState, useCallback } from "react"
import { Camera, Refrigerator, ChefHat, BarChart3 } from "lucide-react"
import { ReceiptScanTab } from "@/components/receipt-scan-tab"
import { FridgeTab } from "@/components/fridge-tab"
import { RecipesTab } from "@/components/recipes-tab"
import { AnalyticsTab } from "@/components/analytics-tab"
import type { FridgeItem, ScannedItem } from "@/lib/types"

type Tab = "scan" | "fridge" | "recipes" | "analytics"

type ReceiptRecord = {
  id: string
  date: Date
  items: ScannedItem[]
  total: number
}

const INITIAL_FRIDGE_ITEMS: FridgeItem[] = [
  { id: "init-1", name: "Bananas", emoji: "🍌", quantity: 1, category: "Fruits", dateAdded: new Date() },
  { id: "init-2", name: "Carrots", emoji: "🥕", quantity: 1, category: "Vegetables", dateAdded: new Date() },
  { id: "init-3", name: "Tomatoes", emoji: "🍅", quantity: 1, category: "Vegetables", dateAdded: new Date() },
  { id: "init-4", name: "Onions", emoji: "🧅", quantity: 1, category: "Vegetables", dateAdded: new Date() },
  { id: "init-5", name: "Broccoli", emoji: "🥦", quantity: 1, category: "Vegetables", dateAdded: new Date() },
  { id: "init-6", name: "Lemons", emoji: "🍋", quantity: 1, category: "Fruits", dateAdded: new Date() },
  { id: "init-7", name: "Garlic", emoji: "🧄", quantity: 1, category: "Vegetables", dateAdded: new Date() },
  { id: "init-8", name: "Eggs", emoji: "🥚", quantity: 1, category: "Proteins", dateAdded: new Date() },
  { id: "init-9", name: "Cheddar", emoji: "🧀", quantity: 1, category: "Dairy", dateAdded: new Date() },
  { id: "init-10", name: "Milk", emoji: "🥛", quantity: 1, category: "Dairy", dateAdded: new Date() },
  { id: "init-11", name: "Chickpeas", emoji: "🫙", quantity: 1, category: "Grains", dateAdded: new Date() },
  { id: "init-12", name: "Bread", emoji: "🍞", quantity: 1, category: "Grains", dateAdded: new Date() },
]

const EMOJI_CATEGORY_MAP: Record<string, FridgeItem["category"]> = {
  "🍌": "Fruits",
  "🍊": "Fruits",
  "🍎": "Fruits",
  "🍋": "Fruits",
  "🍅": "Vegetables",
  "🥕": "Vegetables",
  "🥦": "Vegetables",
  "🧅": "Vegetables",
  "🧄": "Vegetables",
  "🥬": "Vegetables",
  "🥑": "Vegetables",
  "🥚": "Proteins",
  "🍗": "Proteins",
  "🧀": "Dairy",
  "🥛": "Dairy",
  "🍞": "Grains",
  "🫙": "Grains",
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("scan")
  const [fridgeItems, setFridgeItems] = useState<FridgeItem[]>(INITIAL_FRIDGE_ITEMS)
  const [wasteSaved, setWasteSaved] = useState(47.50)
  const [receipts, setReceipts] = useState<ReceiptRecord[]>([])

  const handleAddToFridge = useCallback((items: ScannedItem[]) => {
    const newItems: FridgeItem[] = items.map(item => ({
      id: `fridge-${Date.now()}-${item.id}`,
      name: item.name,
      emoji: item.emoji,
      quantity: item.quantity,
      category: EMOJI_CATEGORY_MAP[item.emoji] || "Other",
      dateAdded: new Date(),
    }))

    setFridgeItems((prev: FridgeItem[]) => {
      const merged = [...prev]
      newItems.forEach(newItem => {
        const existing = merged.find((m) => m.name.toLowerCase() === newItem.name.toLowerCase())
        if (existing) {
          existing.quantity += newItem.quantity
        } else {
          merged.push(newItem)
        }
      })
      return merged
    })

    // Add to waste saved (simulating value) and record receipt
    const totalValue = items.reduce((sum: number, item: ScannedItem) => sum + item.price * item.quantity, 0)
    const receipt: ReceiptRecord = {
      id: `receipt-${Date.now()}`,
      date: new Date(),
      items,
      total: totalValue,
    }
    setReceipts((prev) => [...prev, receipt])
    setWasteSaved((prev: number) => prev + totalValue * 0.3)

    setActiveTab("fridge")
  }, [])

  const handleUpdateItem = useCallback((id: string, quantity: number) => {
    setFridgeItems((prev: FridgeItem[]) =>
      quantity <= 0
        ? prev.filter((item: FridgeItem) => item.id !== id)
        : prev.map((item: FridgeItem) =>
            item.id === id ? { ...item, quantity } : item,
          )
    )
  }, [])

  const handleRemoveItem = useCallback((id: string) => {
    setFridgeItems((prev: FridgeItem[]) => prev.filter((item: FridgeItem) => item.id !== id))
  }, [])

  const tabs = [
    { id: "scan" as const, label: "Receipt scan", icon: Camera },
    { id: "fridge" as const, label: "My fridge", icon: Refrigerator },
    { id: "recipes" as const, label: "Recipes", icon: ChefHat },
    { id: "analytics" as const, label: "Analytics", icon: BarChart3 },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🧊</span>
              <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Remy's Fridge</h1>
            </div>
            <div className="flex items-center gap-2 text-sm bg-primary/10 px-3 py-1.5 rounded-full">
              <span className="text-muted-foreground font-medium">Saved</span>
              <span className="font-bold text-primary">${wasteSaved.toFixed(0)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6">
        {activeTab === "scan" && (
          <ReceiptScanTab onAddToFridge={handleAddToFridge} />
        )}
        {activeTab === "fridge" && (
          <FridgeTab
            items={fridgeItems}
            onUpdateItem={handleUpdateItem}
            onRemoveItem={handleRemoveItem}
            wasteSaved={wasteSaved}
          />
        )}
        {activeTab === "recipes" && (
          <RecipesTab fridgeItems={fridgeItems} />
        )}
        {activeTab === "analytics" && (
          <AnalyticsTab
            receipts={receipts}
            wasteSaved={wasteSaved}
            fridgeItems={fridgeItems}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-border shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="max-w-lg mx-auto px-4">
          <div className="flex items-center justify-around py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className={`p-2.5 rounded-2xl transition-all ${isActive ? "bg-primary/15 shadow-sm" : ""}`}>
                    <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className={`text-xs ${isActive ? "font-bold" : "font-medium"}`}>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
        {/* Safe area for mobile */}
        <div className="h-safe-area-inset-bottom bg-white" />
      </nav>
    </div>
  )
}
