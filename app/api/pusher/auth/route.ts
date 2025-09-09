import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/jwt";
import { pusherServer } from "@/utils/pusher";

type DecodedToken = {
  id: string;
  name: string;
  role: string;
};

export async function POST(req: Request) {
  const text = await req.text();
  const params = new URLSearchParams(text);
  const socket_id = params.get("socket_id") || "";
  const channel_name = params.get("channel_name") || "";

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";
  const decoded = (await verifyAccessToken(accessToken)) as DecodedToken;

  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const presenceData = {
    user_id: decoded.id,
    user_info: {
      name: decoded.name,
      role: decoded.role,
    },
  };

  const auth = pusherServer.authorizeChannel(
    socket_id,
    channel_name,
    presenceData
  );

  return NextResponse.json(auth);
}
