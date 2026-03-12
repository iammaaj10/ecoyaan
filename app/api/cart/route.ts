import { NextResponse } from "next/server"
import { cartData } from "@/data/cartData"

export async function GET() {
  await new Promise(r => setTimeout(r, 60))
  return NextResponse.json(cartData)
}