import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "customer_support_requests";
  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
