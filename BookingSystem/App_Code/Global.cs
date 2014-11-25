﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;

/// <summary>
/// Summary description for Global
/// </summary>
public class Global : System.Web.HttpApplication {
    public Global() {
        //
        // TODO: Add constructor logic here
        //
    }
    void Application_Start(object sender, EventArgs e) {
        // Code that runs on application startup

    }

    void Application_End(object sender, EventArgs e) {
        //  Code that runs on application shutdown

    }

    void Application_Error(object sender, EventArgs e) {
        // Code that runs when an unhandled error occurs

    }

    void Session_Start(object sender, EventArgs e) {
        // Code that runs when a new session is started

    }

    void Session_End(object sender, EventArgs e) {
        // Code that runs when a session ends. 
        // Note: The Session_End event is raised only when the sessionstate mode
        // is set to InProc in the Web.config file. If session mode is set to StateServer 
        // or SQLServer, the event is not raised.

    }

    protected void FormsAuthentication_OnAuthenticate(Object sender, FormsAuthenticationEventArgs e) {
        if (FormsAuthentication.CookiesSupported == true) {
            if (Request.Cookies[FormsAuthentication.FormsCookieName] != null) {
                try {
                    //let us take out the username now                
                    string username = FormsAuthentication.Decrypt(Request.Cookies[FormsAuthentication.FormsCookieName].Value).Name;

                    //let us extract the roles from our own custom cookie
                    string roles;
                    using (DataContext ctx = new DataContext()) {
                        roles = ctx.Users.Where(u => u.Username == username).First().Roles;
                    }
                    //Let us set the Pricipal with our user specific details
                    e.User = new System.Security.Principal.GenericPrincipal(
                      new System.Security.Principal.GenericIdentity(username, "Forms"), roles.Split(';'));
                } catch (Exception) {
                    //somehting went wrong
                }
            }
        }
    }
}