import mongoose, { Schema, Document, Model } from "mongoose";

// Helper Interface
export interface IUser extends Document {
    email: string;
    name: string;
    role: "user" | "admin";
    createdAt: Date;
}

// Mongoose schema
const UserSchema: Schema<IUser> = new Schema(
    {
        email: {
            type: String,
            required: [true, "Please provide an email"],
            unique: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please provide a valid email",
            ],
        },
        name: {
            type: String,
            required: [true, "Please provide a name"],
            maxlength: [60, "Name cannot be more than 60 characters"],
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
    },
    {
        timestamps: true, // auto creation/update
    },
);

// Models Singleton (Serverless/Hot Reload)
const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
