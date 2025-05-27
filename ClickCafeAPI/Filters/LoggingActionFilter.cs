using Microsoft.AspNetCore.Mvc.Filters;
using Serilog;
using System.Diagnostics;
using System.Security.Claims;

public class LoggingActionFilter : IActionFilter
{
    private Stopwatch _stopwatch;
    private readonly bool _enabled;
    public LoggingActionFilter(IConfiguration configuration)
    {
        _enabled = configuration.GetValue<bool>("BusinessLogicLogging:Enabled");
    }

    public void OnActionExecuting(ActionExecutingContext context)
    {
        if (!_enabled) return;

        _stopwatch = Stopwatch.StartNew();
        var request = context.HttpContext.Request;
        var user = context.HttpContext.User;

        var userName = user.Identity?.Name ?? "Anonymous";
        var roles = user.Claims
            .Where(c => c.Type == ClaimTypes.Role)
            .Select(c => c.Value)
            .ToList();
        var controller = context.ActionDescriptor.RouteValues["controller"];
        var action = context.ActionDescriptor.RouteValues["action"];

        Log.Information("➡️ [Action Start] User: {User}, Roles: {Roles}, Method: {Controller}.{Action}, HTTP: {HttpMethod} {Path}",
            userName,
            string.Join(",", roles),
            controller,
            action,
            request.Method,
            request.Path);
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        if (!_enabled) return;
        _stopwatch.Stop();
        var request = context.HttpContext.Request;
        var response = context.HttpContext.Response;
        var controller = context.ActionDescriptor.RouteValues["controller"];
        var action = context.ActionDescriptor.RouteValues["action"];

        Log.Information("⬅️ [Action End] {Controller}.{Action} responded {StatusCode} in {Elapsed} ms for {HttpMethod} {Path}",
            controller,
            action,
            response.StatusCode,
            _stopwatch.ElapsedMilliseconds,
            request.Method,
            request.Path);
    }
}