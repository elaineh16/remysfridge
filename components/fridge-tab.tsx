"use client"

import { useState } from "react"
import { Leaf, TrendingDown, Plus, Minus, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { FridgeItem } from "@/lib/types"

interface FridgeTabProps {
  items: FridgeItem[]
  onUpdateItem: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
  wasteSaved: number
}

const CATEGORY_ORDER = ["Fruits", "Vegetables", "Proteins", "Dairy", "Grains", "Other"]

export function FridgeTab({ items, onUpdateItem, onRemoveItem, wasteSaved }: FridgeTabProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  const groupedItems = items.reduce((acc, item) => {
    const category = item.category || "Other"
    if (!acc[category]) acc[category] = []
    acc[category].push(item)
    return acc
  }, {} as Record<string, FridgeItem[]>)

  const sortedCategories = CATEGORY_ORDER.filter(cat => groupedItems[cat]?.length > 0)

  const totalItems = items.length
  const lowStockItems = items.filter(item => item.quantity <= 1).length

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
              <span className="text-xl">🧊</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalItems}</p>
              <p className="text-xs text-muted-foreground">Items in fridge</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/20">
              <Leaf className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-success">${wasteSaved.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">Waste avoided</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Low Stock Warning */}
      {lowStockItems > 0 && (
        <Card className="p-4 bg-warning/10 border-warning/30">
          <div className="flex items-center gap-3">
            <TrendingDown className="h-5 w-5 text-warning" />
            <div>
              <p className="font-medium text-foreground">
                {lowStockItems} item{lowStockItems > 1 ? "s" : ""} running low
              </p>
              <p className="text-sm text-muted-foreground">
                Consider adding these to your next shopping trip
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {items.length === 0 && (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <span className="text-3xl">🧊</span>
            </div>
            <div>
              <p className="text-lg font-medium text-foreground">Your fridge is empty</p>
              <p className="text-sm text-muted-foreground">
                Scan a receipt to add items
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Items Grid by Category */}
      {sortedCategories.map((category) => (
        <div key={category}>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
            {category}
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {groupedItems[category].map((item) => {
              const isSelected = selectedItem === item.id
              return (
                <div
                  key={item.id}
                  className="relative cursor-pointer"
                  onClick={() => setSelectedItem(isSelected ? null : item.id)}
                >
                  <Card
                    className={`relative overflow-hidden transition-all duration-200 ${
                      item.quantity <= 1
                        ? "border-warning bg-warning/10"
                        : "bg-card hover:bg-muted"
                    } ${isSelected ? "ring-2 ring-primary" : ""}`}
                  >
                    {item.quantity <= 1 && (
                      <Badge 
                        className="absolute top-1.5 right-1.5 h-5 w-5 p-0 flex items-center justify-center bg-warning text-warning-foreground text-xs z-10"
                      >
                        !
                      </Badge>
                    )}
                    
                    {/* Item Content - Always Visible */}
                    <div className="flex flex-col items-center justify-center p-3 pt-4">
                      <span className="text-4xl sm:text-5xl">{item.emoji}</span>
                      <p className="text-xs font-medium text-foreground mt-2 text-center truncate w-full">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                    </div>

                    {/* Adjustment Controls - Show Below When Selected */}
                    <div 
                      className={`flex items-center justify-center gap-1 px-2 pb-2 transition-all duration-200 ${
                        isSelected ? "opacity-100 max-h-12" : "opacity-0 max-h-0 overflow-hidden"
                      }`}
                    >
                      <button
                        className="h-7 w-7 rounded-md bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          onUpdateItem(item.id, Math.max(0, item.quantity - 1))
                        }}
                      >
                        <Minus className="h-3.5 w-3.5 text-foreground" />
                      </button>
                      <button
                        className="h-7 w-7 rounded-md bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          onUpdateItem(item.id, item.quantity + 1)
                        }}
                      >
                        <Plus className="h-3.5 w-3.5 text-foreground" />
                      </button>
                      <button
                        className="h-7 w-7 rounded-md bg-destructive/20 flex items-center justify-center hover:bg-destructive/30 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          onRemoveItem(item.id)
                          setSelectedItem(null)
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </button>
                    </div>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
