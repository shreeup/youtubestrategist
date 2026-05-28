// import { NextResponse } from "next/server";

// export async function GET() {
//   return NextResponse.json({ status: "ok" });
// }
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const channelCount = await prisma.channel.count();

  return NextResponse.json({ status: "ok", channelCount });
}
