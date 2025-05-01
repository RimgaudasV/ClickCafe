# ClickCafé

Vilnius University, 3rd course Software Creation course, group project on creating coffe ordering app.

Team name: Programų sistemų karaliai.

# Database setup

1. Download and setup Microsoft SQL Server
2. Change SQL server name and oher configuration (if needed) in DefaultConnection string (ClickCafeAPI appsettings.json) and ClickCafeContextFactory

   
3. Update database:

   Go to Tools -> NuGet Package Manager -> NuGet Package Console. Write update-database command (Microsoft Visual Studio)
   
   Or
   
   dotnet ef database update in API project folder
