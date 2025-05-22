import { NextResponse } from "next/server"
import { seedProducts } from "@/lib/seed-data"

export async function GET() {
  try {
    await seedProducts()
    return NextResponse.json({ success: true, message: "Database seeded successfully" })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ success: false, message: "Failed to seed database" }, { status: 500 })
  }
}
