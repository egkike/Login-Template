import bcrypt from "bcrypt";

export const login = async ({ pool, input }) => {
  const { username, email, password } = input;
  let user = [];
  if (username.length > 0) {
    const result = await pool.query(
      `SELECT username, password, email, fullname, level, active, createdate, id
         FROM users WHERE username = $1;`,
      [username]
    );
    user = result.rows;
  } else if (email.length > 0) {
    const result = await pool.query(
      `SELECT username, password, email, fullname, level, active, createdate, id
         FROM users WHERE email = $1;`,
      [email]
    );
    user = result.rows;
  }
  if (user.length === 0) {
    return { error: "Invalid user or password" };
  }
  const isInvalidPassword = await bcrypt.compare(password, user[0].password);
  if (!isInvalidPassword) {
    return { error: "Invalid user or password" };
  }
  return user[0];
};

export const getUsers = async ({ pool }) => {
  const result = await pool.query(
    "SELECT username, email, fullname, level, active, createdate, id FROM users;"
  );
  const users = result.rows;
  if (users.length === 0) return { error: "No users found" };
  return users;
};

export const getById = async ({ pool, id }) => {
  const result = await pool.query(
    `SELECT username, email, fullname, level, active, createdate, id
     FROM users WHERE id = $1;`,
    [id]
  );
  const user = result.rows;
  if (user.length === 0) return { error: "User not found" };
  return user[0];
};

export const createUser = async ({ pool, input }) => {
  const { username, password, email, fullname } = input;
  const userResult = await pool.query(
    `SELECT username, email, fullname, level, active, createdate, id
       FROM users WHERE username = $1;`,
    [username]
  );
  if (userResult.rows.length > 0) {
    return { error: "Username already exists" };
  }
  const mailResult = await pool.query(
    `SELECT username, email, fullname, level, active, createdate, id
       FROM users WHERE email = $1;`,
    [email]
  );
  if (mailResult.rows.length > 0) {
    return { error: "Email already exists" };
  }
  const hashpassword = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      `INSERT INTO users (username, password, email, fullname)
         VALUES ($1, $2, $3, $4) RETURNING id, username, email, fullname, level, active, createdate;`,
      [username, hashpassword, email, fullname]
    );
    return result.rows[0];
  } catch (e) {
    return { error: "Error creating user" };
  }
};

export const chgPassUser = async ({ pool, id, input }) => {
  const { password } = input;
  try {
    const userResult = await pool.query(
      `SELECT username, email, fullname, level, active, createdate, id
         FROM users WHERE id = $1;`,
      [id]
    );
    if (userResult.rows.length === 0) return { error: "User not found" };
    const hashpassword = await bcrypt.hash(password, 10);
    await pool.query(
      `UPDATE users 
         SET password = $1, active = 1
         WHERE id = $2;`,
      [hashpassword, id]
    );
    const result = await pool.query(
      `SELECT username, email, fullname, level, active, createdate, id
         FROM users WHERE id = $1;`,
      [id]
    );
    return result.rows[0];
  } catch (e) {
    return { error: "Error updating user" };
  }
};

export const updUser = async ({ pool, id, input }) => {
  const { fullname, level, active } = input;
  try {
    const userResult = await pool.query(
      `SELECT username, email, fullname, level, active, createdate, id
       FROM users WHERE id = $1;`,
      [id]
    );
    if (userResult.rows.length === 0) return { error: "User not found" };

    await pool.query(
      `UPDATE users 
       SET fullname = $1, level = $2, active = $3
       WHERE id = $4;`,
      [fullname, level, active, id]
    );

    const result = await pool.query(
      `SELECT username, email, fullname, level, active, createdate, id
       FROM users WHERE id = $1;`,
      [id]
    );
    return result.rows[0];
  } catch (e) {
    return { error: "Error updating user" };
  }
};

export const deleteUser = async ({ pool, id }) => {
  try {
    const userResult = await pool.query(
      `SELECT username, email, fullname, level, active, createdate, id
       FROM users WHERE id = $1;`,
      [id]
    );
    if (userResult.rows.length === 0) return { error: "User not found" };
    await pool.query(`DELETE FROM users WHERE id = $1;`, [id]);
    return { success: "User deleted successfully" };
  } catch (e) {
    return { error: "Error deleting user" };
  }
};
