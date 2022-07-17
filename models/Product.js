const db = require("../config/connection");

class Product {
  constructor() {
    this.offset = 10;
  }

  getAll({ category, sort, page }) {
    let orderBy = "ORDER BY ";
    let where = category ? `WHERE category_id = ${parseInt(category)}` : "";

    let offset = page
      ? `OFFSET ${this.offset * page - this.offset} LIMIT ${this.offset + 1}`
      : "";

    switch (sort) {
      case "date":
        orderBy += "product_date DESC";
        break;
      case "price":
        orderBy += "price";
        break;
      case "rating":
        orderBy += "rating DESC";
        break;
      default:
        orderBy += "id";
        break;
    }

    const query = `SELECT products.*,
      COALESCE(AVG(reviews.rating), 0)::NUMERIC(2,1) AS rating 
      FROM products
      LEFT JOIN reviews ON products.id = reviews.product_id 
      ${where}
      GROUP BY (products.id) ${orderBy} ${offset}`;

    return db.query(query);
  }

  getOne({ id }) {
    const query = `SELECT products.*, 
      COALESCE(AVG(reviews.rating), 0)::NUMERIC(2,1) AS rating 
      FROM products
      LEFT JOIN reviews ON products.id = reviews.product_id
      WHERE products.id = $1
      GROUP BY (products.id)`;

    return db.query(query, [id]);
  }

  create({ name, description, price, quantity, category_id }) {
    return db.query(
      `INSERT INTO products (name, description, price, quantity, category_id) 
    VALUES ($1, $2, $3, $4, $5) RETURNING *, 0 AS rating`,
      [name, description, price, quantity, category_id]
    );
  }

  update({ name, description, price, quantity, category_id, id }) {
    return db.query(
      `UPDATE products SET name = $1, description = $2, price = $3,
    quantity = $4, category_id = $5 WHERE id = $6`,
      [name, description, price, quantity, category_id, id]
    );
  }

  updateQuantity({ quantity, id }) {
    return db.query("UPDATE products SET quantity = $1 WHERE id = $2", [
      quantity,
      id,
    ]);
  }

  delete({ id }) {
    return db.query("DELETE FROM products WHERE id = $1", [id]);
  }
}

module.exports = new Product();
