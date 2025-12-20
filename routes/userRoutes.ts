import { Hono } from "hono";
import { UserService } from "../services/userService";

const userRoutes = new Hono();

userRoutes.get("/", async (c) => {
    const users = await UserService.getAllUsers();
    return c.json(users);
});

userRoutes.get("/:id", async (c) => {
    const id = c.req.param("id");
    try {
        const user = await UserService.getUserById(id);
        if (!user) return c.json({ error: "User not found" }, 404);
        return c.json(user);
    } catch (error: any) {
        return c.json({ error: error.message }, 400);
    }
});

userRoutes.post("/", async (c) => {
    try {
        const body = await c.req.json();
        const newUser = await UserService.createUser(body);
        return c.json(newUser, 201);
    } catch (error: any) {
        return c.json({ error: error.errors || error.message }, 400);
    }
});

export default userRoutes;
