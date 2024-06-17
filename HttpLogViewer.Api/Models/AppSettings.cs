using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HttpLogViewer.Api.Models
{
    public class AppSettings
    {
        public string MongoConnectionString { get; set; }
        public string HttpLogsCollectionName { get; set; }
    }
}
