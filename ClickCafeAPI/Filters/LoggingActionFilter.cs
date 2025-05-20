using Microsoft.AspNetCore.Mvc.Filters;
using Serilog;
using System.Diagnostics;

public class LoggingActionFilter : IActionFilter
{
    private Stopwatch _stopwatch;

    public void OnActionExecuting(ActionExecutingContext context)
    {
        _stopwatch = Stopwatch.StartNew();
        var request = context.HttpContext.Request;
        Log.Information("➡️ [Action Start] {method} {path}", request.Method, request.Path);
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        _stopwatch.Stop();
        var request = context.HttpContext.Request;
        var response = context.HttpContext.Response;
        Log.Information("⬅️ [Action End] {statusCode} for {method} {path} in {elapsed} ms",
            response.StatusCode,
            request.Method,
            request.Path,
            _stopwatch.ElapsedMilliseconds);
    }
}