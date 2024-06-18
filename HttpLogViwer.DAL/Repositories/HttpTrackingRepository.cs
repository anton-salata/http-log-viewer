using HttpLogViwer.DAL.Models;
using MongoDB.Driver;

namespace HttpLogViwer.DAL.Repositories
{
    public class HttpTrackingRepository : MongoRepository<HttpLogRecord>
    {
        public HttpTrackingRepository(IMongoDatabase database, string httpLogsCollectionName)
            : base(database, httpLogsCollectionName)
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
