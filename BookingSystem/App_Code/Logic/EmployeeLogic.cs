using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for EmployeeLogic
/// </summary>
public class EmployeeLogic {
    private static object syncRoot = new Object();
    private static volatile EmployeeLogic instance;
    private EmployeeLogic() {

    }
    public static EmployeeLogic Instance {
        get {
            if (instance == null) {
                lock (syncRoot) {
                    if (instance == null) {
                        instance = new EmployeeLogic();
                    }
                }
            }
            return instance;
        }
    }

    public List<Employee> GetEmployees() {
        using (DataContext ctx = new DataContext()) {
            try {
                return ctx.Employees.Where(e => e.User.Roles.Contains("employee")).ToList();
            } catch (Exception e) {
                throw e;
            }
        }
    }
}