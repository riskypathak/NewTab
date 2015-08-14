using ServiceStack.DataAnnotations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NewTab.Data.Models
{
    public class SessionDetail : DBEntity
    {
        public string SessionCode { get; set; }

        public string FingerPrint { get; set; } //This will be used later to track user. This should be foreign key to User table

        public string CompleteRequestUri { get; set; }

        public string RefereralUrl { get; set; }

        public string IPAddress { get; set; }

        public string UserAgent { get; set; }

        public DateTime RequestDate { get; set; }

        public bool IsValid { get; set; }
    }
}
