using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AdminController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        public AdminController(UserManager<AppUser> userManager)
        {
            _userManager = userManager;

        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("users-with-roles")]
        public async Task<ActionResult> GetUsersWithRoles()
        {
            var users=await _userManager.Users
            .Include(r=>r.UserRoles)
            .ThenInclude(r=>r.Role)
            .OrderBy(u=>u.UserName)
            .Select(u=>new{
                u.Id,
                userName=u.UserName,
                Roles=u.UserRoles.Select(r=>r.Role.Name).ToList()
            })
            .ToListAsync();
            
            return Ok(users);
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpGet("photos-to-moderate")]
        public  ActionResult GetPhotosForModeration()
        {
            return Ok("Admin or Moderator can see This");
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("edit-roles/{username}")]
        public async Task<ActionResult> EditRole(string username,[FromQuery] string roles)
        {
            var selectedRole=roles.Split(",").ToArray();
            var user=await _userManager.FindByNameAsync(username);
            
            if(user==null) return NotFound("User Not Found");

            var userRoles=await _userManager.GetRolesAsync(user);
            var result=await _userManager.AddToRolesAsync(user,selectedRole.Except(userRoles));
            
            if(!result.Succeeded) return BadRequest("Failed to add Role");

            result=await _userManager.RemoveFromRolesAsync(user,userRoles.Except(selectedRole));

            if(!result.Succeeded) return BadRequest("Failed to Remove Role");

            return Ok(await _userManager.GetRolesAsync(user));
        }
    }
}