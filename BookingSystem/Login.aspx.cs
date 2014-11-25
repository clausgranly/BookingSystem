using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Login : System.Web.UI.Page {
    protected void Page_Load(object sender, EventArgs e) {

    }

    protected void Button1_Click(object sender, EventArgs e) {
        using (DataContext ctx = new DataContext()) {
            //User user = new User() {
            //    Username = "user1",
            //    Password = "user1",
            //    Roles = "manager"
            //};
            //ctx.Users.Add(user);
            //ctx.SaveChanges();

            //user = new User() {
            //    Username = "user2",
            //    Password = "user2",
            //    Roles = "employee"
            //};
            //ctx.Users.Add(user);
            //ctx.SaveChanges();


            Label1.Text = ValidateLogin("user1", "user1").ToString();
        }
    }
    [WebMethod]
    public static bool ValidateLogin(string username, string password) {
        if (IsValidUser(username, password)) {
            FormsAuthentication.SetAuthCookie(username, false);
            return true;
        }
        return false;
    }

    private static bool IsValidUser(string username, string password) {
        using (DataContext ctx = new DataContext()) {
            List<User> users = ctx.Users.Where(u => u.Username == username && u.Password == password).ToList<User>();
            if (users.Count > 0) {
                return true;
            }
        }
        return false;
    }
}