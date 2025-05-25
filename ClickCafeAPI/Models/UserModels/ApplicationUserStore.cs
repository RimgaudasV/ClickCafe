using ClickCafeAPI.Context;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ClickCafeAPI.Models.UserModels
{
    public class ApplicationUserStore : UserStore<User, IdentityRole, ClickCafeContext, string>
    {
        public ApplicationUserStore(ClickCafeContext context, IdentityErrorDescriber describer = null)
            : base(context, describer) { }

        public override async Task<IdentityResult> UpdateAsync(User user, CancellationToken cancellationToken = default)
        {
            Context.Entry(user).Property(u => u.CafeId).IsModified = true;
            return await base.UpdateAsync(user, cancellationToken);
        }
    }
}
