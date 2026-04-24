const isProd = true; // FORCE TRUE on Render

export const accessCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
    maxAge: 15 * 60 * 1000,
};

export const refreshCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};