import connectDB from "./lib/db";
import User from "./models/User";

await connectDB();
console.log("✅ Database connected successfully");

//! TESTING ONLY
try {
    const existingUser = await User.findOne({ email: "test@example.com" });
    if (!existingUser) {
        const newUser = await User.create({
            email: "test@example.com",
            name: "Test User",
            role: "admin",
        });
        console.log("👤 Created test user:", newUser.name);
    } else {
        console.log("👤 Test user already exists");
    }
} catch (error) {
    console.error("❌ Error creating user:", error);
}

const server = Bun.serve({
    port: 3000,
    async fetch(request) {
        const url = new URL(request.url);

        if (url.pathname === "/") {
            return new Response("System Online. Database Connected. 🟢");
        }

        if (url.pathname === "/api/users") {
            const users = await User.find({});
            return Response.json(users);
        }

        return new Response("404 Not found", { status: 404 });
    },
});

console.log("➡️ ", `Listening on http://localhost:${server.port}`);
