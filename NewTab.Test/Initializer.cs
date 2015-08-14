using Microsoft.VisualStudio.TestTools.UnitTesting;
using ServiceStack.Data;
using ServiceStack.OrmLite;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.IO;
using System.IO.Compression;
using NewTab.Data.Models;
namespace NewTab.Test
{
    [TestClass]
    public class Initializer
    {
        [TestMethod]
        public void Database()
        {
            IDbConnectionFactory dbFactory =
                new OrmLiteConnectionFactory(ConfigurationManager.ConnectionStrings["db"].ConnectionString, MySqlDialect.Provider);

            using (IDbConnection db = dbFactory.Open())
            {
                db.DropAndCreateTable<SessionDetail>();
                db.DropAndCreateTable<UserInfo>();
                db.DropAndCreateTable<UserTrack>();
            }
        }
    }
}
