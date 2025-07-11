import { connectDB} from "@/db/dbconfig";
import User from "@/models/userModel";
import Scholar from "@/models/Scholar";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

connectDB();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { fullname, email, password, role } = reqBody; 

        // Check if user already exists
        const user = await User.findOne({ email });

        if (user) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        // Hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            fullname,
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            role,
        });

        const savedUser = await newUser.save();

        // Automatically create Scholar profile if role is "scholar"
        if (role === "scholar") {
            const existingScholar = await Scholar.findOne({ email: email.trim().toLowerCase() }); // <-- ensure lowercase
            if (!existingScholar) {
                await Scholar.create({
                    name: fullname,
                    email: email.trim().toLowerCase(), 
                    phone: "", 
                    department: "",
                    supervisor: "",
                    researchArea: "",
                    startDate: null,
                    expectedCompletion: null,
                    description: "",
                    milestones: [],
                });
            }
        }

        return NextResponse.json({
            message: "User created successfully",
            success: true,
            savedUser,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}