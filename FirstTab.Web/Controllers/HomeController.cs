using NewTab.Data.Models;
using ServiceStack.Data;
using ServiceStack.OrmLite;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FirstTab.Web.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/

        public ActionResult Index()
        {

            return View();
        }

        private static long InsertInDB<T>(IDbConnectionFactory dbFactory, T data)
        {
            using (IDbConnection db = dbFactory.Open())
            {
                return db.Insert<T>(data, selectIdentity: true);
            }
        }

        public ActionResult LandingPage()
        {
            //Insert into SessionDetails
            SessionDetail session = new SessionDetail();
            session.SessionCode = Guid.NewGuid().ToString();
            session.CompleteRequestUri = Request.Url.ToString();
            session.RefereralUrl = Request.UrlReferrer != null ? Request.UrlReferrer.ToString() : null;
            session.RequestDate = DateTime.Now;
            session.UserAgent = Request.UserAgent != null ? Request.UserAgent.ToString() : null;
            session.IPAddress = Request.UserHostAddress;

            IDbConnectionFactory dbFactory = new OrmLiteConnectionFactory(ConfigurationManager.ConnectionStrings["db"].ConnectionString, MySqlDialect.Provider);

            long sessionId = InsertInDB<SessionDetail>(dbFactory, session);

            //Insert into tracking
            UserTrack userTrack = new UserTrack();
            userTrack.UpdatedDate = DateTime.Now;
            userTrack.SessionDetailId = Convert.ToInt32(sessionId);
            userTrack.State = UserTrackState.LandingPage;
            InsertInDB<UserTrack>(dbFactory, userTrack);
            return View();
        }

    }
}
