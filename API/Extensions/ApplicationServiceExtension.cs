using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Services;
using API.SignalR;
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
        public static IServiceCollection AddAplicationServices(this IServiceCollection services,IConfiguration config)
        {
            services.AddSingleton<PresenceTracker>();
            services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
            services.AddScoped<ITokenService,TokenService>();
            services.AddScoped<IPhotoService,PhotoService>();
            services.AddScoped<IUnitOfWork,UnitOfWork>();
            services.AddScoped<LogUserActivity>();      
            services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);     
            services.AddDbContext<DataContext>(options =>
            {
                options.UseSqlServer(config.GetConnectionString("DefaultConnection"));
            });

            return services;
        }
    }
}