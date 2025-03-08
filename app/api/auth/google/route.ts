import url from "@/lib/google";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.redirect(url);
}
