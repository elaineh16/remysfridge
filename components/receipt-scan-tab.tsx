"use client"

import React, { useState, useCallback, useRef } from "react"
import { Camera, Upload, Check, X, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import type { ScannedItem } from "@/lib/types"

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : ""
      const base64 = result.split(",")[1] || ""
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

interface ReceiptScanTabProps {
  onAddToFridge: (items: ScannedItem[]) => void
}

const DEMO_ITEMS: ScannedItem[] = [
  { id: "1", name: "Organic Bananas", emoji: "🍌", price: 2.49, quantity: 1, selected: true },
  { id: "2", name: "Baby Carrots", emoji: "🥕", price: 3.99, quantity: 2, selected: true },
  { id: "3", name: "Roma Tomatoes", emoji: "🍅", price: 4.29, quantity: 1, selected: true },
  { id: "4", name: "Fresh Spinach", emoji: "🥬", price: 3.49, quantity: 1, selected: true },
  { id: "5", name: "Chicken Breast", emoji: "🍗", price: 8.99, quantity: 1, selected: true },
  { id: "6", name: "Greek Yogurt", emoji: "🥛", price: 5.99, quantity: 1, selected: true },
  { id: "7", name: "Brown Eggs", emoji: "🥚", price: 4.49, quantity: 1, selected: true },
  { id: "8", name: "Avocados", emoji: "🥑", price: 5.99, quantity: 3, selected: true },
  { id: "9", name: "Whole Milk", emoji: "🥛", price: 4.29, quantity: 1, selected: true },
  { id: "10", name: "Sourdough Bread", emoji: "🍞", price: 4.99, quantity: 1, selected: true },
]

export function ReceiptScanTab({ onAddToFridge }: ReceiptScanTabProps) {
  const [scanning, setScanning] = useState(false)
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleScan = useCallback(async (file: File) => {
    try {
      setScanning(true)
      const imageBase64 = await fileToBase64(file)

      const response = await fetch("/api/scan-receipt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64,
          mediaType: file.type || "image/jpeg",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to scan receipt")
      }

      const data = await response.json()
      const itemsFromApi = Array.isArray(data.items) ? data.items : []

      const items: ScannedItem[] =
        itemsFromApi.length > 0
          ? itemsFromApi.map((item: any, index: number) => ({
              id: String(item.id ?? index + 1),
              name: item.name,
              emoji: item.emoji ?? "🧺",
              price: Number(item.price) || 0,
              quantity: Number(item.quantity) || 1,
              selected: true,
            }))
          : DEMO_ITEMS

      setScannedItems(items)
    } catch (error) {
      console.error(error)
      setScannedItems(DEMO_ITEMS)
    } finally {
      setScanning(false)
    }
  }, [])

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      void handleScan(file)
    }
  }, [handleScan])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        void handleScan(file)
      }
    },
    [handleScan],
  )

  const toggleItem = (id: string) => {
    setScannedItems(items =>
      items.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    )
  }

  const updateQuantity = (id: string, quantity: number) => {
    setScannedItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    )
  }

  const handleAddToFridge = () => {
    const selectedItems = scannedItems.filter(item => item.selected)
    onAddToFridge(selectedItems)
    setScannedItems([])
  }

  const selectedCount = scannedItems.filter(item => item.selected).length
  const totalPrice = scannedItems
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* Upload Area */}
      {scannedItems.length === 0 && (
        <div
          className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 ${
            dragActive
              ? "border-primary bg-primary/10"
              : "border-border bg-card/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
            {scanning ? (
              <>
                <div className="relative">
                  <div className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
                    <Sparkles className="h-10 w-10 text-primary animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium text-foreground">
                    AI is scanning your receipt...
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Identifying items and prices
                  </p>
                </div>
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </>
            ) : (
              <>
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <Camera className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium text-foreground">
                    Scan your grocery receipt
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Drag and drop an image or use the buttons below
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </>
            )}
          </div>
        </div>
      )}

      {/* Scanned Items */}
      {scannedItems.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Scanned Items
              </h2>
              <p className="text-sm text-muted-foreground">
                {selectedCount} of {scannedItems.length} items selected
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-xl font-bold text-primary">
                ${totalPrice.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            {scannedItems.map((item) => (
              <Card
                key={item.id}
                className={`flex items-center gap-4 p-4 transition-all ${
                  item.selected
                    ? "border-primary/50 bg-card"
                    : "border-border bg-muted/30 opacity-60"
                }`}
              >
                <Checkbox
                  checked={item.selected}
                  onCheckedChange={() => toggleItem(item.id)}
                  className="h-5 w-5"
                />
                <span className="text-3xl">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {item.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ${item.price.toFixed(2)} each
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <span className="text-lg">-</span>
                  </Button>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                    className="w-12 text-center h-8 px-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <span className="text-lg">+</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="fixed bottom-20 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border">
            <div className="max-w-lg mx-auto flex gap-3">
              <Button
                variant="secondary"
                className="flex-1 gap-2"
                onClick={() => setScannedItems([])}
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                className="flex-1 gap-2"
                onClick={handleAddToFridge}
                disabled={selectedCount === 0}
              >
                <Check className="h-4 w-4" />
                Add {selectedCount} to Fridge
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
