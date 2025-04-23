// src / app / api / updateUserImageUrl / route.ts;
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { userId, imageUrl } = await request.json();

    // Validate input
    if (!userId || !imageUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    // Attempt to find the user before update
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { imageUrl: true },
    });

    if (!existingUser) {
      console.error(`###User not found with clerkId: ${userId}`);
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // Perform the update
    const updatedUser = await prisma.user.update({
      where: { clerkId: userId },
      data: { imageUrl: imageUrl },
      select: { clerkId: true, imageUrl: true },
    });

    return NextResponse.json({
      success: true,
      message: "User image updated successfully",
      user: {
        clerkId: updatedUser.clerkId,
        imageUrl: updatedUser.imageUrl,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
