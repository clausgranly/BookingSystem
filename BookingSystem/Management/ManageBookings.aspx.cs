using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Management_ManageBookings : System.Web.UI.Page {
    private static EmployeeLogic employeeLogic = EmployeeLogic.Instance;
    private static BookingManager bookingManager = BookingManager.Instance;
    protected void Page_Load(object sender, EventArgs e) {
        List<Employee> l = GetEmployees();
        if (1 > l.Count) {

        }
    }

    [WebMethod]
    public static List<Booking> GetBookingsByDate(DateTime date) {
        return bookingManager.GetBookingsByDate(date);
    }

    [WebMethod]
    public static List<Employee> GetEmployees() {
        return employeeLogic.GetEmployees();
    }

    [WebMethod]
    public static bool PlanBooking(DateTime scheduledDate, int bookingId, int employeeId) {
        TimeSpan ts = new TimeSpan(1, 0, 0);
        scheduledDate += ts;
        return bookingManager.PlanBooking(scheduledDate, bookingId, employeeId);
    }
}