using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Admin_AdminCode : System.Web.UI.Page {
    private static AdminLogic adminLogic = AdminLogic.Instance;
    protected void Page_Load(object sender, EventArgs e) {

    }

    [WebMethod]
    public static bool CreateEmployee(string jsonEmployee, string jsonUser) {
        JavaScriptSerializer jss = new JavaScriptSerializer();
        Employee e = jss.Deserialize<Employee>(jsonEmployee);
        User u = jss.Deserialize<User>(jsonUser);
        return adminLogic.CreateEmployeeWithUser(e,u);
    }
}