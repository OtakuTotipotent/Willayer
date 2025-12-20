import connectDB from "./lib/db";
import { UserService } from "./services/userService";

await connectDB();
console.log("✅ Database connected successfully");

const server = Bun.serve({
    port: Number(process.env.PORT) || 3000,
    async fetch(request) {
        const url = new URL(request.url);

        if (url.pathname === "/") {
            return new Response("System Online. Database Connected. 🟢");
        }

        if (url.pathname === "/api/users") {
            try {
                if (request.method === "GET") {
                    const users = UserService.getAllUsers();
                    return Response.json(users);
                }
                if (request.method === "POST") {
                    const rawBody = await request.json();
                    const newUser = await UserService.createUser(rawBody);
                    return Response.json(newUser, { status: 201 });
                }
            } catch (error: any) {
                // Centralized error handling
                console.error(`Error at ${url.pathname}: `, error);
                return Response.json(
                    {
                        error:
                            error.errors ||
                            error.message ||
                            "Internal Server Error",
                    },
                    { status: error.name === "ZodError" ? 400 : 500 },
                );
            }
        }

        return new Response("404 Not found", { status: 404 });
    },
});

console.log("➡️ ", `Listening on http://localhost:${server.port}`);
