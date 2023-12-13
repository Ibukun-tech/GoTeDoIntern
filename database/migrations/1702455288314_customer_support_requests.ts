import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "customer_support_requests";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table.string("first_name");
      table.string("last_name");
      table.string("email_address");
      table.string("title");
      table.string("text");
      table.string("attached_url");
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
