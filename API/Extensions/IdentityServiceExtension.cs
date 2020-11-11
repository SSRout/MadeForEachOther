using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace API.Extensions
{
    public static class IdentityServiceExtension
    {
         /// <summary>AddIdentityService is a Custom Extension Method of IServiceCollection .
         /// <para>Takes <see cref="IConfiguration"/>type as Parameter.</para>
         /// <seealso cref="API.Extensions"/>
         /// </summary>
        public static IServiceCollection AddIdentityService(this IServiceCollection services,IConfiguration config){

           services.AddIdentityCore<AppUser>(opt=>{ 
               opt.Password.RequireNonAlphanumeric=false;
           })
           .AddRoles<AppRole>()
           .AddRoleManager<RoleManager<AppRole>>()
           .AddSignInManager<SignInManager<AppUser>>()
           .AddRoleValidator<RoleValidator<AppRole>>()
           .AddEntityFrameworkStores<DataContext>();

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options=>
            {
                options.TokenValidationParameters=new TokenValidationParameters{
                    ValidateIssuerSigningKey=true,
                    IssuerSigningKey=new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["MySecurityKey"])),
                    ValidateIssuer=false,
                    ValidateAudience=false,
                };

                options.Events=new JwtBearerEvents{
                    OnMessageReceived=context=>{
                        var accesssToken=context.Request.Query["access_token"];
                        var path=context.HttpContext.Request.Path;
                        if(!string.IsNullOrEmpty(accesssToken) && path.StartsWithSegments("/hubs")){
                            context.Token=accesssToken;
                        }
                        return Task.CompletedTask;
                    }
                };
            });
            
             services.AddAuthorization(opt=>{
                 opt.AddPolicy("RequireAdminRole",policy=>policy.RequireRole("Admin"));
                 opt.AddPolicy("ModeratePhotoRole",policy=>policy.RequireRole("Admin","Moderator"));
             });

            return services;
        }


    }
}