using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.Text.Json;
using System.Collections.Generic;
using API.Entities;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Identity;
using System.Linq;

namespace API.Data
{
    public class Seed
    {
        public static async Task SeedUser(UserManager<AppUser> userManager,RoleManager<AppRole> roleManager){
            if(await userManager.Users.AnyAsync()) return;

            var userData=await File.ReadAllTextAsync("Data/UserSeedData.json");

            var users=JsonSerializer.Deserialize<List<AppUser>>(userData);

            if(userData==null) return;

            var roles=new List<AppRole>{
                new AppRole{Name="Admin"},
                new AppRole{Name="Moderator"},
                new AppRole{Name="Member"}
            };

            foreach(var role in roles){
                await roleManager.CreateAsync(role);
            }

            foreach(var user in users){
               user.Photos.First().IsApproved = true;
               user.UserName=user.UserName.ToLower();
               await  userManager.CreateAsync(user,"P@ssw0rd");
               await userManager.AddToRoleAsync(user,"Member");
            }

            var admin=new AppUser{
                UserName="admin"
            };

            await userManager.CreateAsync(admin,"P@ssw0rd");
            await userManager.AddToRolesAsync(admin,new[] {"Admin","Moderator"});
        }
    }
}