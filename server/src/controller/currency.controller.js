import { db } from "../db";

export const createCurrency = async (req, res, next) => {
  try {
    await db.query(
      `INSERT INTO Currency (Title)
      VALUES ($1)
      ;`,
      [req.body.title]
    );
    res.send("ok");
  } catch (error) {
    throw error;
  }
};

export const editCurrency = async (req, res, next) => {
  try {
    const id = req.params.id;
    const title = req.body.title;

    await db.query(
      `
      UPDATE Currency
      SET title = $2
      WHERE id = $1
      `,
      [id, title]
    );

    res.send("ok");
  } catch (error) {
    throw error;
  }
};

export const allCurrency = async (req, res, next) => {
  try {
    const page = req.params.page || 0;
    const limit = req.params.limit || 10;

    const [
      { rows },
      {
        rows: [{ count }],
      },
    ] = await Promise.all([
      db.query(
        `
        SELECT c.id as id, c.title as title
        FROM public.Currency c
        ORDER BY id OFFSET $1 ROWS FETCH NEXT $2 ROWS ONLY
      `,
        [page * limit, limit]
      ),
      db.query(
        `
      SELECT count(id)
      FROM public.Currency
      `
      ),
    ]);

    res.json({
      currencies: rows,
      count,
    });
  } catch (error) {
    throw error;
  }
};
