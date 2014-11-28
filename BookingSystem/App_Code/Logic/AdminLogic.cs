using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for AdminLogic
/// </summary>
public class AdminLogic {
    private static object syncRoot = new Object();
    private static volatile AdminLogic instance;
    private AdminLogic() {

    }
    public static AdminLogic Instance {
        get {
            if (instance == null) {
                lock (syncRoot) {
                    if (instance == null) {
                        instance = new AdminLogic();
                    }
                }
            }
            return instance;
        }
    }

    public bool CreateEmployeeWithUser(Employee employee, User user) {
        using (DataContext ctx = new DataContext()) {
            try {
                employee.User = user;
                ctx.Employees.Add(employee);
                return ctx.SaveChanges() > 0;
            } catch (Exception e) {
                throw e;
            }
        }
    }
}