import {connectDB} from "@/db/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connectDB()

export async function POST(request: NextRequest){
    try {
    
       
       
        const response =  NextResponse.json({
            message: "Logout successful",
            success: true,
           
        })

        response.cookies.set("token", "", {httpOnly: true, expires: new Date(0)})

        return response
        
    } catch (error) {
        return NextResponse.json({error: "Something went wrong"}, {status: 500})

    }
}