import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

const SYSTEM_PROMPT = `You are TurfBot, the friendly voice booking assistant for TurfPro — Tamil Nadu's premier sports turf booking platform.

Your job: help users discover and book cricket, football, box cricket, badminton, tennis and basketball turfs across Tamil Nadu (Chennai, Coimbatore, Madurai, Trichy, Salem, Tirunelveli, Vellore, Erode).

Conversation style:
- Warm, concise, energetic — like a sports buddy. Keep replies under 3 short sentences when possible.
- Always confirm: city, sport, date, time slot, and number of players before "booking".
- Suggest popular venues like Velocity Sports Arena (Chennai), Boundary Box Cricket (Anna Nagar), Champions Turf Club (Coimbatore).
- Quote prices in INR (₹) — typical range ₹900–₹1500/hr.
- If the user is vague, ask ONE focused follow-up.
- After collecting details, present a clear booking summary and ask them to confirm.
- This is a demo: you cannot actually charge or reserve, but talk as if guiding them through it.

Use markdown sparingly — bullet lists for slot options, **bold** for venue names.`;

type ChatRequestBody = { messages?: unknown };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const { messages } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        const result = streamText({
          model,
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
          onError: (error) => {
            console.error("AI stream error:", error);
            return error instanceof Error ? error.message : "Stream error";
          },
        });
      },
    },
  },
});
