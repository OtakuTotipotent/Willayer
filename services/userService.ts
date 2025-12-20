import User from "../models/User";
import { UserCreateSchema, type UserCreateInput } from "../schemas/userSchema";

export class UserService {
    static async createUser(data: unknown) {
        const validatedData = UserCreateSchema.parse(data);
        const newUser = await User.create(validatedData);

        return newUser;
    }

    static async getAllUsers() {
        return await User.find({});
    }

    static async getUserById(id: string) {
        return await User.findById(id);
    }
}
