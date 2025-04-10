import bcrypt from "bcrypt";

export const login = async ({ connection, input }) => {
  const { username, email, password } = input;
  let [user] = [];
  if (username.length > 0) {
    [user] = await connection.query(
      `SELECT username, password, email, fullname, level, active, createdate, BIN_TO_UUID(_id) id
              FROM users WHERE username = ?;`,
      [username]
    );
  } else if (email.length > 0) {
    [user] = await connection.query(
      `SELECT username, password, email, fullname, level, active, createdate, BIN_TO_UUID(_id) id
              FROM users WHERE email = ?;`,
      [email]
    );
  }
  if (user.length === 0) {
    return { error: "Invalid user or password" };
  }
  // bcrypt.compare es asincrono y bcrypt.comparesync es sincrono
  const isInvalidPassword = await bcrypt.compare(password, user[0].password);
  if (!isInvalidPassword) {
    return { error: "Invalid user or password" };
  }
  return user[0];
};

export const getUsers = async ({ connection }) => {
  const [users] = await connection.query(
    "SELECT username, email, fullname, level, active, createdate, BIN_TO_UUID(_id) id FROM users;"
  );
  if (users.length === 0) return { error: "No users found" };
  return users;
};

export const getById = async ({ connection, id }) => {
  const [user] = await connection.query(
    `SELECT username, email, fullname, level, active, createdate, BIN_TO_UUID(_id) id
          FROM users WHERE _id = UUID_TO_BIN(?);`,
    [id]
  );
  if (user.length === 0) return { error: "User not found" };
  return user[0];
};

export const createUser = async ({ connection, input }) => {
  const { username, password, email, fullname } = input;
  const [user] = await connection.query(
    `SELECT username, email, fullname, level, active, createdate, BIN_TO_UUID(_id) id
          FROM users WHERE username = ?;`,
    [username]
  );
  if (user.length > 0) {
    return { error: "Username already exists" };
  }
  const [mail] = await connection.query(
    `SELECT username, email, fullname, level, active, createdate, BIN_TO_UUID(_id) id
            FROM users WHERE email = ?;`,
    [email]
  );
  if (mail.length > 0) {
    return { error: "Email already exists" };
  }
  const [uuidResult] = await connection.query("SELECT UUID() uuid;");
  const [{ uuid }] = uuidResult;
  const hashpassword = await bcrypt.hash(password, 10); // bcrypt.hash es asincrono y hashea el password
  try {
    await connection.query(
      `INSERT INTO users (_id, username, password, email, fullname)
          VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?);`,
      [username, hashpassword, email, fullname]
    );
  } catch (e) {
    return { error: "Error creating user" };
  }
  const [users] = await connection.query(
    `SELECT username, email, fullname, level, active, createdate, BIN_TO_UUID(_id) id
        FROM users WHERE _id = UUID_TO_BIN(?);`,
    [uuid]
  );
  return users[0];
};

export const chgPassUser = async ({ connection, id, input }) => {
  const { password } = input;
  try {
    const [user] = await connection.query(
      `SELECT username, email, fullname, level, active, createdate, BIN_TO_UUID(_id) id
            FROM users WHERE _id = UUID_TO_BIN(?);`,
      [id]
    );
    if (user.length === 0) return { error: "User not found" };
    const hashpassword = await bcrypt.hash(password, 10); // bcrypt.hash hashea el password
    await connection.query(
      `UPDATE users 
          SET password = ?, active = 1
          WHERE _id = UUID_TO_BIN(?);`,
      [hashpassword, id]
    );
    const [userUpd] = await connection.query(
      `SELECT username, email, fullname, level, active, createdate, BIN_TO_UUID(_id) id
            FROM users WHERE _id = UUID_TO_BIN(?);`,
      [id]
    );
    return userUpd[0];
  } catch (e) {
    return { error: "Error updating user" };
  }
};

export const updUser = async ({ connection, id, input }) => {
  const { fullname, level, active } = input;
  try {
    const [user] = await connection.query(
      `SELECT username, email, fullname, level, active, createdate, BIN_TO_UUID(_id) id
            FROM users WHERE _id = UUID_TO_BIN(?);`,
      [id]
    );
    if (user.length === 0) return { error: "User not found" };

    await connection.query(
      `UPDATE users 
          SET fullname = ?, level = ?, active = ?
          WHERE _id = UUID_TO_BIN(?);`,
      [fullname, level, active, id]
    );

    const [userUpd] = await connection.query(
      `SELECT username, email, fullname, level, active, createdate, BIN_TO_UUID(_id) id
            FROM users WHERE _id = UUID_TO_BIN(?);`,
      [id]
    );
    return userUpd[0];
  } catch (e) {
    return { error: "Error updating user" };
  }
};

export const deleteUser = async ({ connection, id }) => {
  try {
    const [user] = await connection.query(
      `SELECT username, email, fullname, level, active, createdate, BIN_TO_UUID(_id) id
              FROM users WHERE _id = UUID_TO_BIN(?);`,
      [id]
    );
    if (user.length === 0) return { error: "User not found" };
    await connection.query(`DELETE FROM users WHERE _id = UUID_TO_BIN(?);`, [
      id,
    ]);
    return { success: "User deleted successfully" };
  } catch (e) {
    return { error: "Error deleting users" };
  }
};
