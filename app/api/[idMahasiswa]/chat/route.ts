import { verifyAccessToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/utils/pusher";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ idMahasiswa: string }> }
) {
  try {
    const { idMahasiswa } = await params;

    if (!idMahasiswa) {
      return NextResponse.json(
        { error: "Missing idMahasiswa parameter" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value || "";
    const decoded = await verifyAccessToken(accessToken);
    if (!decoded || decoded.id !== idMahasiswa) {
      return NextResponse.json(
        { error: "Unauthorized", decoded, idMahasiswa },
        { status: 401 }
      );
    }

    const chatRoom = await prisma.chatRoom.findUnique({
      where: {
        userId: decoded.id,
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(chatRoom?.messages || [], { status: 200 });
  } catch (error) {
    console.error("[GET_CHAT]: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ idMahasiswa: string }> }
) {
  try {
    const { idMahasiswa } = await params;

    if (!idMahasiswa) {
      return NextResponse.json(
        { error: "Missing idMahasiswa parameter" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value || "";
    const decoded = await verifyAccessToken(accessToken);
    if (!decoded || decoded.id !== idMahasiswa) {
      return NextResponse.json(
        { error: "Unauthorized", decoded, idMahasiswa },
        { status: 401 }
      );
    }

    const { message } = await req.json();
    if (!message) {
      return NextResponse.json(
        { messages: "message tidak boleh kosong" },
        { status: 401 }
      );
    }

    let chatRoom = await prisma.chatRoom.findUnique({
      where: {
        userId: decoded.id,
      },
    });

    if (!chatRoom) {
      const admin = await prisma.user.findFirst({
        where: { role: "ADMIN" },
      });

      if (!admin) {
        return NextResponse.json(
          { messages: "Admin not found" },
          { status: 500 }
        );
      }

      chatRoom = await prisma.chatRoom.create({
        data: {
          userId: decoded.id,
          adminId: admin.id,
        },
      });
    }

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

    await pusherServer.trigger(
      `chat-${chatRoom.adminId}`,
      "new-message",
      newMessage
    );
    await pusherServer.trigger(`chat-${decoded.id}`, "new-message", newMessage);

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("[POST_CHAT]: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
