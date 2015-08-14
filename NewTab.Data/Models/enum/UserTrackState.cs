using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NewTab.Data.Models
{
    public enum UserTrackState
    {
        LandingPage = 1,
        DownloadRequest = 2,
        InstallInit = 3,
        InstallStart = 4,
        InstallComplete = 5,
        InstallFail = 6
    }
}
