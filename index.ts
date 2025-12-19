import connectDB from "./lib/db";
import User from "./models/User";
import { UserCreateSchema } from "./schemas/userSchema";

try {
    await connectDB();
    console.log("✅ Database connected successfully");
} catch (error) {
    console.log(`Error while connecting to database.\n${error}`);
}

const server = Bun.serve({
    port: 3000,
    async fetch(request) {
        const url = new URL(request.url);

        if (url.pathname === "/") {
            return new Response("System Online. Database Connected. 🟢");
        }

        if (url.pathname === "/api/users") {
            if (request.method === "GET") {
                const users = await User.find({});
                return Response.json(users);
            }
            if (request.method === "POST") {
                try {
                    const rawBody = await request.json();
                    const validatedBody = UserCreateSchema.parse(rawBody);
                    const newUser = await User.create(validatedBody);
                    return Response.json(newUser, { status: 201 });
                } catch (error: any) {
                    return Response.json(
                        {
                            error: error.errors || error.message,
                        },
                        { status: 400 },
                    );
                }
            }
        }

        return new Response("404 Not found", { status: 404 });
    },
});

console.log("➡️ ", `Listening on http://localhost:${server.port}`);
