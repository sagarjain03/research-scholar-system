import { connectDB } from "@/db/dbconfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { DecodedToken } from "@/types/decodedToken";
connectDB();

export async function POST(request: NextRequest) {
    try {
        if (request.headers.get("content-type") !== "application/json") {
            return NextResponse.json({ error: "Invalid Content-Type header, expected application/json" }, { status: 400 });
        }
        const reqBody = await request.json();
        const { email, password } = reqBody;

        //check if user exists
        const user = await User.findOne({ email });
        console.log("User found:", user);

        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
        }

        //check if password is correct
        const isMatch = await bcryptjs.compare(password, user.password);
        console.log("Password match:", isMatch);

        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
        }

        // JWT_SECRET check
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return NextResponse.json({ error: "JWT secret not set" }, { status: 500 });
        }

        const tokendata: DecodedToken = {
            id: user._id.toString(),
            username: user.fullname,
            email: user.email,
        };

        const token = jwt.sign(tokendata, jwtSecret, { expiresIn: "1d" });

        // Remove password from user object before sending
        const userObj = user.toObject();
        delete userObj.password;

        const response = new NextResponse(
            JSON.stringify({
                message: "Login successful",
                success: true,
                user: {
                    ...userObj,
                    role: user.role
                }
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" }
            }
        );

        response.cookies.set("token", token, { httpOnly: true });

        return response;

    } catch (error: any) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}