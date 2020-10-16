using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Services;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace API.Extensions
{
    public static class ApplicationServiceExtension
    {
         /// <summary>AddAplicationServices is a Custom Extension Method of IServiceCollection .
         /// <para>Takes <see cref="IConfiguration"/>type as Parameter.</para>
         /// <seealso cref="API.Extensions"/>
         /// </summary>
        public static IServiceCollection AddAplicationServices(this IServiceCollection services,IConfiguration config){
            
            services.AddScoped<ITokenService,TokenService>();
            services.AddScoped<IUserRepository,UserRepository>();
            services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);
            services.AddDbContext<DataContext>(options =>
            {
                options.UseSqlServer(config.GetConnectionString("DefaultConnection"));
            });

            return services;
        }
    }
}