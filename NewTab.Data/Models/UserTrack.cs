using ServiceStack.DataAnnotations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NewTab.Data.Models
{
    public class UserTrack : DBEntity
    {
        [References(typeof(SessionDetail))]
        public int SessionDetailId { get; set; }

        [Reference]
        public SessionDetail SessionDetail { get; set; }

        [References(typeof(UserInfo))]
        public int? UserId { get; set; }

        [Reference]
        public UserInfo User { get; set; }

        public UserTrackState State { get; set; }

        public DateTime UpdatedDate { get; set; }

        public string Message { get; set; }
    }
}
