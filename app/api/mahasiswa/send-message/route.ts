import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";
import sendMessage from "@/utils/sendMessage";

export async function POST(req: NextRequest) {
  const messageSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 character long"),
    email: z.string().email("Invalid email format"),
    message: z.string().min(5, "Message must be at least 5 characters long"),
  });

  try {
    const body = await req.json();

    const parsedData = messageSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        { error: parsedData.error.errors },
        { status: 400 }
      );
    }

    const { name, email, message } = body;

    await sendMessage(name, email, message);

    return NextResponse.json({ message: "Message Success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
