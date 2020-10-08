using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
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
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options=>
            {
                options.TokenValidationParameters=new TokenValidationParameters{
                    ValidateIssuerSigningKey=true,
                    IssuerSigningKey=new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["MySecurityKey"])),
                    ValidateIssuer=false,
                    ValidateAudience=false,
                };
            });
            return services;
        }

    }
}