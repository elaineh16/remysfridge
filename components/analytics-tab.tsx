"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { FridgeItem, ScannedItem } from "@/lib/types"

interface ReceiptRecord {
  id: string
  date: Date
  items: ScannedItem[]
  total: number
}

interface AnalyticsTabProps {
  receipts: ReceiptRecord[]
  wasteSaved: number
  fridgeItems: FridgeItem[]
}

function getMonthlySpend(receipts: ReceiptRecord[]) {
  const byMonth = new Map<string, number>()

  receipts.forEach((r) => {
    const d = new Date(r.date)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    byMonth.set(key, (byMonth.get(key) ?? 0) + r.total)
  })

  const months = Array.from(byMonth.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .slice(-6)

  return months.map(([key, total]) => {
    const [year, month] = key.split("-")
    const label = new Date(Number(year), Number(month) - 1).toLocaleString("default", {
      month: "short",
    })
    return { key, label, total }
  })
}

function getWasteBreakdown(receipts: ReceiptRecord[]) {
  const byItem = new Map<string, number>()

  receipts.forEach((r) => {
    r.items.forEach((item) => {
      const key = item.name
      const value = item.price * item.quantity * 0.3
      byItem.set(key, (byItem.get(key) ?? 0) + value)
    })
  })

  return Array.from(byItem.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6)
}

export function AnalyticsTab({ receipts, wasteSaved, fridgeItems }: AnalyticsTabProps) {
  const monthly = getMonthlySpend(receipts)
  const wasteByItem = getWasteBreakdown(receipts)

  const thisMonthKey = (() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  })()

  const thisMonthSpend =
    monthly.find((m) => m.key === thisMonthKey)?.total ?? 0
  const thisMonthWasteSaved =
    receipts
      .filter((r) => {
        const d = new Date(r.date)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
        return key === thisMonthKey
      })
      .reduce((sum, r) => sum + r.total * 0.3, 0) || 0

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* Waste Savings Headline */}
      <Card className="p-4 bg-success/10 border-success/40">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-success">
              Waste savings calculator
            </p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              You&apos;ve prevented{" "}
              <span className="text-success">
                ${thisMonthWasteSaved.toFixed(0)}
              </span>{" "}
              of food waste this month
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Based on roughly 30% of your grocery spend that would have gone
              uneaten without Remy.
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">All-time avoided</p>
            <p className="text-xl font-bold text-success">
              ${wasteSaved.toFixed(0)}
            </p>
          </div>
        </div>
      </Card>

      {/* Spend Analytics */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Spend analytics
            </p>
            <p className="text-xs text-muted-foreground">
              Grocery spend from your scanned receipts
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              This month
            </p>
            <p className="text-base font-semibold text-foreground">
              ${thisMonthSpend.toFixed(0)}
            </p>
          </div>
        </div>

        {monthly.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Scan a few receipts to see your monthly grocery spend.
          </p>
        ) : (
          <div className="flex items-end gap-3 h-32">
            {monthly.map((m) => {
              const max = Math.max(...monthly.map((x) => x.total))
              const height = max > 0 ? (m.total / max) * 100 : 0
              return (
                <div key={m.key} className="flex flex-col items-center gap-1 flex-1">
                  <div className="h-full flex items-end w-full">
                    <div
                      className={`w-full rounded-t-lg bg-primary/20 border border-primary/40 ${
                        m.key === thisMonthKey ? "bg-primary/60" : ""
                      }`}
                      style={{ height: `${Math.max(height, 8)}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{m.label}</span>
                  <span className="text-[11px] text-foreground">
                    ${m.total.toFixed(0)}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* Waste Savings Breakdown */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-foreground">
            Where you&apos;re saving the most
          </p>
          <Badge variant="outline" className="text-xs">
            Top items
          </Badge>
        </div>
        {wasteByItem.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            As you scan more receipts, we&apos;ll show which ingredients are
            saving you the most money.
          </p>
        ) : (
          <div className="space-y-2">
            {wasteByItem.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {item.name}
                  </p>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-success"
                      style={{
                        width: `${Math.min(
                          100,
                          (item.value / wasteByItem[0].value) * 100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
                <p className="text-sm font-semibold text-success whitespace-nowrap">
                  +${item.value.toFixed(0)}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

