using HttpLogViewer.Api.Models;
using HttpLogViwer.DAL.Repositories;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace HttpLogViewer.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container
            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowLocalhost", builder =>
                {
                    builder.WithOrigins("http://localhost:3000") // Update with your React app's URL
                           .AllowAnyMethod()
                           .AllowAnyHeader()
                           .AllowCredentials();
                });
            });

            // Load AppSettings from configuration
            builder.Services.Configure<AppSettings>(builder.Configuration.GetSection("AppSettings"));

            // Register AppSettings as a singleton
            builder.Services.AddSingleton(resolver => resolver.GetRequiredService<IOptions<AppSettings>>().Value);

            // Add MongoDB service
            builder.Services.AddSingleton<IMongoDatabase>(provider =>
            {
                var settings = provider.GetRequiredService<AppSettings>();
                var mongoUrl = new MongoUrl(settings.MongoConnectionString);
                var client = new MongoClient(settings.MongoConnectionString);
                return client.GetDatabase(mongoUrl.DatabaseName);
            });

            // Register HttpTrackingRepository with collection name
            builder.Services.AddTransient<HttpTrackingRepository>(provider =>
            {
                var database = provider.GetRequiredService<IMongoDatabase>();
                var settings = provider.GetRequiredService<AppSettings>();
                return new HttpTrackingRepository(database, settings.HttpLogsCollectionName);
            });

            var app = builder.Build();

            app.UseCors("AllowLocalhost");

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}