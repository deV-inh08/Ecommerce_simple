using MongoDB.Driver;

namespace Catalog.API;

public class MongoContext
{
    public IMongoDatabase Database { get; }

    public MongoContext(IMongoClient client)
    {
        Database = client.GetDatabase("CatalogDb");
    }

    public IMongoCollection<Product> Products => Database.GetCollection<Product>("products");
}