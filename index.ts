import connectDB from "./lib/db";
import User, { type IUser } from "./models/User";

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
                console.log(request);
                try {
                    let body = (await request.json()) as IUser;
                    console.log(body);
                    const newUser = await User.create(body);
                    console.log(newUser);
                    return Response.json(newUser, { status: 201 });
                } catch (error: any) {
                    console.log(`Error: ${error}`);
                    return Response.json(
                        { error: error.message },
                        { status: 400 },
                    );
                }
            }
        }

        return new Response("404 Not found", { status: 404 });
    },
});

console.log("➡️ ", `Listening on http://localhost:${server.port}`);
