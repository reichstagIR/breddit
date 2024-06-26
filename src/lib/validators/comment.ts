import { z } from "zod";

export const commentValidator = z.object({
    postId: z.string(),
    text: z.string(),
    replayToId: z.string().optional(),
});

export type commentRequest = z.infer<typeof commentValidator>;
