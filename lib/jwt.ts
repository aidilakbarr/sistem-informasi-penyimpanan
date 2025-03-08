import * as jwt from "jose";

const secretKey = new TextEncoder().encode(process.env.SECRET_KEY);
const secretRefreshKey = new TextEncoder().encode(
  process.env.SECRET_REFRESH_TOKEN_KEY
);

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

if (!secretKey) {
  throw new Error("Secret key tidak di temukan");
}

if (!secretRefreshKey) {
  throw new Error("Secret key tidak di temukan");
}

const createAccessToken = async (user: User) => {
  const payload = {
    id: user.id,
    username: user.name,
    email: user.email,
    role: user.role,
  };
  return await new jwt.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30m")
    .sign(secretKey);
};

const createRefreshToken = async (user: User) => {
  const payload = {
    id: user.id,
    username: user.name,
    email: user.email,
    role: user.role,
  };

  return await new jwt.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secretRefreshKey);
};

const verifyAccessToken = async (token: string) => {
  try {
    const { payload } = await jwt.jwtVerify(token, secretKey);

    return payload;
  } catch (error) {
    console.error("[VERIFY_ACCESS_TOKEN: ]", error.message);
    return null;
  }
};

const verifyRefreshToken = async (token: string) => {
  try {
    const { payload } = await jwt.jwtVerify(token, secretRefreshKey);
    return payload;
  } catch (error) {
    console.error("[VERIFY_REFRESH_TOKEN: ]", error.message);
    return null;
  }
};

export {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
