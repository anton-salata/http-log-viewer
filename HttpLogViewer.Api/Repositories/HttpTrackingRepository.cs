using HttpLogViewer.Api.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace HttpLogViewer.Api.Repositories
{
    public class HttpTrackingRepository : MongoRepository<HttpLogRecord>
    {
        public HttpTrackingRepository(IMongoDatabase database, IOptions<AppSettings> settings) : base(database, settings.Value.HttpLogsCollectionName)
        {
        }

        public async Task<IEnumerable<HttpLogRecord>> GetFilteredAsync(string uri, string method, string statusCode, string reasonPhrase)
        {
            var filterBuilder = Builders<HttpLogRecord>.Filter;
            var filter = filterBuilder.Empty;

            if (!string.IsNullOrEmpty(uri))
            {
                filter &= filterBuilder.Eq(record => record.Uri, uri);
            }

            if (!string.IsNullOrEmpty(method))
            {
                filter &= filterBuilder.Eq(record => record.Method, method);
            }

            if (!string.IsNullOrEmpty(statusCode))
            {
                filter &= filterBuilder.Eq(record => record.StatusCode, statusCode);
            }

            if (!string.IsNullOrEmpty(reasonPhrase))
            {
                filter &= filterBuilder.Eq(record => record.ReasonPhrase, reasonPhrase);
            }

            return await _collection.Find(filter).ToListAsync();
        }
    }
}
