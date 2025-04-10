import crypto from "node:crypto";
import DBlocal from "db-local";
import bcrypt from "bcrypt";

const { Schema } = new DBlocal({ path: "./db" });

const User = Schema("Users", {
  id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  fullname: { type: String, required: true },
  level: { type: Number, required: true, default: 1 },
  active: { type: Number, required: true, default: 0 },
  createdate: { type: Date, required: true }
});

export class DbModel {
  static async login({ input }) {
    const { username, password } = input;

    const user = await User.find({ username });
    if (!user || user.length === 0) {
      return { error: "User does not exist" };
    }

    // bcrypt.compare es asincrono y bcrypt.comparesync es sincrono
    const isInvalidPassword = await bcrypt.compare(password, user[0].password);
    if (!isInvalidPassword) {
      return { error: "Invalid password" };
    }
    return user[0];
  }

  static async getUsers() {
    const users = await User.find();
    return users;
  }

  static async getById({ id }) {
    const user = await User.findOne({ id: id });
    if (!user) {
      return { error: "User does not exist" };
    }
    return user;
  }

  static async createUser({ input }) {
    const { username, password, email, fullname, level, active } = input;

    const user = await User.findOne({ username });
    if (user) {
      return { error: "User name already exists" };
    }

    const id = crypto.randomUUID();
    const hashpassword = await bcrypt.hash(password, 10); // bcrypt.hash es asincrono y hashea el password

    const newUser = await User.create({
      id: id,
      username: username,
      password: hashpassword,
      email: email,
      fullname: fullname,
      level: level,
      active: active,
      createdate: new Date().toISOString()
    });
    await newUser.save();
    return { id, username, email, fullname, level, active };
  }

  static async updUser({ id, input }) {
    const { fullname, level, active } = input;
    const updates = { fullname, level, active };
    const validUpdates = Object.keys(updates).some(key => updates[key] !== undefined && updates[key] !== null);
    if (!validUpdates) {
      return { error: "Invalid updates" };
    }
    const user = await User.findOne({ id: id });
    if (!user) {
      return { error: "User does not exist" };
    }

    const allowedUpdates = ["fullname", "level", "active"];
    for (const key of Object.keys(updates)) {
      if (allowedUpdates.includes(key) && updates[key] !== undefined && updates[key] !== null) {
        user[key] = updates[key];
      }
    }
    await user.save();

    return { message: "User updated successfully" };
  }

  static async chgPassUser({ id, input }) {
    const { password } = input;
    const user = await User.findOne({ id: id });
    if (!user) {
      return { error: "User does not exist" };
    }
    const hashpassword = await bcrypt.hash(password, 10); // bcrypt.hash es asincrono y hashea el password
    user.password = hashpassword;
    await user.save();
    return { message: "Password changed successfully" };
  }

  static async deleteUser({ id }) {
    const user = await User.findOne({ id: id });
    if (!user) {
      return { error: "User does not exist" };
    }
    await user.remove();
    return { message: "User deleted successfully" };
  }
}
