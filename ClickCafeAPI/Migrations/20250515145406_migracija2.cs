using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClickCafeAPI.Migrations
{
    /// <inheritdoc />
    public partial class migracija2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Cafes_CafeId",
                table: "AspNetUsers");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Cafes_CafeId",
                table: "AspNetUsers",
                column: "CafeId",
                principalTable: "Cafes",
                principalColumn: "CafeId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Cafes_CafeId",
                table: "AspNetUsers");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Cafes_CafeId",
                table: "AspNetUsers",
                column: "CafeId",
                principalTable: "Cafes",
                principalColumn: "CafeId");
        }
    }
}
