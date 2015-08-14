using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NewTab.Data.Models
{
   public class UserInfo:DBEntity
    {
        public string ClientId { get; set; }
        public string ExtId { get; set; }
        public string ExtType { get; set; }
        public string Location { get; set; }
        public string OsVersion { get; set; }
        public string Platform { get; set; }
        public string BrowserName { get; set; }
        public string BrowserVersion { get; set; }
        public string SysId { get; set; }
        public string AppId { get; set; }
        public string Ip { get; set; }
    }
}
