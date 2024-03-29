// Next
import { NextRequest, NextResponse } from "next/server";
// Next Auth
import { getSession } from "@/lib/auth";
// Zod
import { postValidator } from "@/lib/validators/post";
import { z } from "zod";
// lib
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();

        const { subredditId, title, content } = postValidator.parse(body);

        const subscriptionExist = await db.subscription.findFirst({
            where: {
                subredditId,
                userId: session.user.id,
            },
        });

        if (!subscriptionExist) {
            return new NextResponse("Subscribe to create a post.", {
                status: 400,
            });
        }

        await db.post.create({
            data: {
                title,
                content,
                subredditId,
                authorId: session.user.id,
            },
        });

        return new NextResponse("OK", { status: 200 });

    } catch (error) {

        if (error instanceof z.ZodError) {
            return new NextResponse(error.message, { status: 422 });
        }

        return new NextResponse(
            "Could not post to subreddit, please try again later.",
            {
                status: 500,
            }
        );
    }
}
