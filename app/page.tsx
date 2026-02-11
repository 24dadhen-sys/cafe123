"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Coffee, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Home() {
  const router = useRouter();
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTableSelect = (tableNumber: number) => {
    setSelectedTable(tableNumber);
    setLoading(true);

    // Small delay for better UX feedback
    setTimeout(() => {
      router.push(`/table/${tableNumber}`);
    }, 300);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-[128px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-[128px] translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="z-10 w-full max-w-2xl space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-4">
          <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-primary/20">
            <Coffee className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Sippin&apos;s Cafe
          </h1>
          <p className="text-muted-foreground text-lg">
            Experience the finest brew, right at your table.
          </p>
        </div>

        <Card className="border-border/50 shadow-xl backdrop-blur-sm bg-card/80">
          <CardHeader>
            <CardTitle className="text-center">Select Your Table</CardTitle>
            <CardDescription className="text-center">
              Choose your table number to start ordering
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Table Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mb-4">
              {Array.from({ length: 20 }, (_, i) => i + 1).map((tableNum) => (
                <Button
                  key={tableNum}
                  variant={selectedTable === tableNum ? "default" : "outline"}
                  className={`h-14 text-lg font-semibold transition-all ${selectedTable === tableNum
                    ? "ring-2 ring-primary ring-offset-2 scale-105"
                    : "hover:scale-105 hover:bg-primary/10"
                    }`}
                  onClick={() => handleTableSelect(tableNum)}
                  disabled={loading}
                >
                  {tableNum}
                </Button>
              ))}
            </div>

            {/* Status Message */}
            {loading && (
              <div className="text-center text-sm text-muted-foreground animate-pulse">
                Taking you to Table {selectedTable}...
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground pt-4">
          <p className="flex items-center justify-center gap-2 opacity-70">
            <UtensilsCrossed className="w-4 h-4" />
            Scanned a QR code? Select your table above
          </p>
        </div>
      </div>
    </main>
  );
}
