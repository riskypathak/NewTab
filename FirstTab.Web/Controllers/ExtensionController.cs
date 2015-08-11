//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Net;
//using System.Net.Http;
//using System.Web.Http;

using ServiceStack.Data;
using ServiceStack.OrmLite;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Xml.Linq;


namespace FirstTab.Web.Controllers
{
    // [RoutePrefix("api/Extension")]
    public class ExtensionController : ApiController
    {
        [HttpPost(), Route("api/SaveExtensionInfo")]
        public void SaveExtensionInfo([FromBody] string xmlString)
        {

            IDbConnectionFactory dbFactory =
              new OrmLiteConnectionFactory(ConfigurationManager.ConnectionStrings["db"].ConnectionString, MySqlDialect.Provider);

            using (IDbConnection db = dbFactory.Open())
            {
                var doc = XDocument.Parse(xmlString);
                var dataNode = doc.Root.Elements("data").Elements("ext_install_stats_request").Elements("client_info");
                Models.ExtensionInfo items = (from r in dataNode
                                              select new Models.ExtensionInfo()
                                              {
                                                  AppId = r.Element("appid").Value.ToString(),
                                                  BrowserName = r.Element("bname").Value.ToString(),
                                                  BrowserVersion = r.Element("bver").Value.ToString(),
                                                  ClientId = r.Element("clid").Value.ToString(),
                                                  ExtId = r.Element("extid").Value.ToString(),
                                                  ExtType = r.Element("extype").Value.ToString(),
                                                  // Id = (string)r.Element("linksclicked"),
                                                  // Ip = (string)r.Element("linksclicked"),
                                                  // Location = (string)r.Element("linksclicked"),
                                                  OsVersion = r.Element("osver").Value.ToString(),
                                                  Platform = r.Element("ostype").Value.ToString(),
                                                  SysId = r.Element("sysid").Value.ToString()
                                              }).FirstOrDefault();
                Models.ExtensionInfo model = new Models.ExtensionInfo();
                db.Insert<Models.ExtensionInfo>(items);

            }
        }
    }
}
