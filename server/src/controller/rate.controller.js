import { db } from "../db";
import { sockserver } from "../index";

function rateConvertor(data) {
  return {
    id: data.id,
    amount: data.amount,
    origin: {
      id: data.originid,
      title: data.origintitle,
    },
    dest: {
      id: data.destination_id,
      title: data.destination_title,
    },
  };
}

export const createRate = async (req, res, next) => {
  try {
    const from = Number(req.body.from);
    const to = Number(req.body.to);
    const amount = Number(req.body.amount);
    if (from == to) throw new Error("something went wrong");
    if (isNaN(from) || isNaN(to) || isNaN(amount))
      throw new Error("bad request: bad data");

    await db.query(
      `INSERT INTO Rate (origin,destination,amount,last_amount)
      VALUES ($1,$2,$3,$4)
      ;`,
      [from, to, amount, amount]
    );

    res.send("ok");
  } catch (error) {
    throw error;
  }
};

export const singleRateByCur = async (req, res, next) => {
  try {
    console.log("request recieved");
    const from = Number(req.body.from);
    const to = Number(req.body.to);

    if (isNaN(from) || isNaN(to)) throw new Error("bad request: bad data");

    console.log("x");
    const { rows } = await db.query(
      `
      SELECT r.id as id, r.amount as amount, oc.id as originId, oc.title as originTitle, dc.id as destination_id, dc.title as destination_Title
      FROM public.Rate r
      JOIN public.Currency oc
      ON  r.origin = oc.id
      JOIN public.Currency dc
      ON r.destination = dc.id
      WHERE (r.origin = $1)
      AND   (r.destination = $2)
      `,
      [from, to]
    );

    if (rows.length == 0)
      return res.json({
        result: null,
      });

    const [rate] = rows.map(rateConvertor);

    console.log("r : ", rate);
    res.json({
      result: rate,
    });
  } catch (error) {
    console.log("error : ", error);
    throw error;
  }
};

export const allRate = async (req, res, next) => {
  try {
    const page = Number(req.params.page) || 0;
    const limit = Number(req.params.limit) || 10;

    const [
      { rows },
      {
        rows: [{ count }],
      },
    ] = await Promise.all([
      db.query(
        `
        SELECT r.id as id, r.amount as amount, oc.id as originId, oc.title as originTitle, dc.id as destination_id, dc.title as destination_Title
        FROM public.Rate r
        JOIN public.Currency oc
        ON  r.origin = oc.id
        JOIN public.Currency dc
        ON r.destination = dc.id
        ORDER BY id OFFSET $1 ROWS FETCH NEXT $2 ROWS ONLY
        `,
        [page * limit, limit]
      ),
      db.query(
        `
          SELECT count(id)
          FROM public.Rate
        `
      ),
    ]);

    const result = rows.map(rateConvertor);

    res.json({
      result,
      count,
    });
    return;
  } catch (error) {
    throw error;
  }
};

export const editRate = async (req, res, next) => {
  try {
    const amount = Number(req.body.amount);
    const id = Number(req.params.id);
    if (isNaN(id) || isNaN(amount)) {
      throw new BadRequestException("Not a Number!");
    }

    const { rows } = await db.query(
      `
      SELECT * FROM Rate
      WHERE id = $1
      `,
      [id]
    );
    const thisRate = {
      ...rows[0],
      amount,
      lastAmount: Number(rows[0].amount),
    };

    if (!rows.length)
      throw new BadRequestException("there is no rate with this id");

    await db.query(
      `
      UPDATE Rate
      SET amount = $2, last_amount=$3
      WHERE id = $1
      `,
      [id, amount, Number(rows[0].amount)]
    );

    // publish
    sockserver.clients.forEach((client) => {
      client.send(
        JSON.stringify({
          msg: "editRate",
          data: thisRate,
        })
      );
    });

    res.send("ok");
  } catch (error) {
    throw error;
  }
};
