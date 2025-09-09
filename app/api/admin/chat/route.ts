import { verifyAccessToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/utils/pusher";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value || "";
    const decoded = await verifyAccessToken(accessToken);
    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized", decoded },
        { status: 401 }
      );
    }

    const chatRoom = await prisma.chatRoom.findMany({
      where: {
        adminId: decoded.id as string,
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          include: { sender: { select: { id: true, name: true, role: true } } },
        },
      },
    });

    if (!chatRoom) {
      return NextResponse.json({ messages: "Forbidden" }, { status: 403 });
    }

    const allMessages = chatRoom.flatMap((room) => room.messages);

    return NextResponse.json(allMessages, { status: 200 });
  } catch (error) {
    console.error("[GET_CHAT]: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value || "";
    const decoded = await verifyAccessToken(accessToken);

    console.log({ decoded });

    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized", decoded },
        { status: 401 }
      );
    }

    const { idMahasiswa, message } = await req.json();
    if (!message || !idMahasiswa) {
      return NextResponse.json({ messages: "Unauthorized" }, { status: 401 });
    }

    const chatRoom = await prisma.chatRoom.findUnique({
      where: {
        userId: idMahasiswa,
      },
    });

    if (!chatRoom || chatRoom.adminId !== decoded.id)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const newMessage = await prisma.chatMessage.create({
      data: {
        message,
        senderId: decoded.id,
        roomId: chatRoom.id,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    await pusherServer.trigger(`chat-${decoded.id}`, "new-message", newMessage);
    await pusherServer.trigger(
      `chat-${idMahasiswa}`,
      "new-message",
      newMessage
    );

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("[POST_CHAT]: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
