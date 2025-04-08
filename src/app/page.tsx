import { Button } from "@/components/ui/button";
import { Leaf, Sprout, Upload } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="responsive-container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">
              PlantID{" "}
              <span className="text-xs text-muted-foreground">
                by Abubakar T.S
              </span>
            </span>
          </Link>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden h-screen bg-green-50 py-20">
          <div className="responsive-container relative z-10">
            <div className="mx-auto max-w-[800px] space-y-8 text-center">
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2 text-sm font-medium text-green-600">
                  <Sprout className="h-4 w-4" />
                  <span>POWERED BY AI</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  Discover and Learn About
                  <span className="block text-green-600">Any Plant</span>
                </h1>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl">
                  Upload a photo and instantly get detailed information about
                  plants, and learn about their properties.
                </p>
              </div>
              <div className="flex justify-center gap-4">
                <Link href="/analyze">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    <Upload className="mr-2 h-5 w-5" />
                    Analyze Plant
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
