using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.Entity;
using System.Web.Script.Serialization;

public partial class _Default : System.Web.UI.Page {
    private static BookingManager bookingManager = BookingManager.Instance;

    protected void Page_Load(object sender, EventArgs e) {

    }
    protected void Button1_Click(object sender, EventArgs e) {
        //using (DataContext ctx = new DataContext()) {
        //Tag t = new Tag() {
        //    Name = "Tag1",
        //    Description = "Tag1"
        //};
        //ctx.Tags.Add(t);
        //Booking booking = new Booking() {
        //    StratDate = DateTime.Now,
        //    EstimatedDuration = 8.5,
        //    CustomerAddress = "eamv",
        //    CustomerPhone = 12345678,
        //    Description = "eamv",
        //};
        //ctx.Bookings.Add(booking);
        //Employee employee = new Employee() {
        //    Name = "cor",
        //    Phonenumber = 1234,
        //    User = new User {
        //        Username = "cor",
        //        Password = "cor",
        //        Roles = "manager",
        //    }
        //};
        //ctx.Employees.Add(employee);
        //    ctx.SaveChanges();
        //    Label1.Text = "Done";
        //}


        //using (DataContext ctx = new DataContext()) {
        //    //Booking booking = ctx.Bookings.Where(b => b.Id == 2).FirstOrDefault();
        //    Booking booking = ctx.Bookings
        //        .Where(b => b.Id == 2)
        //        .Include(b => b.Tags)
        //        .Include(b => b.Employee)
        //        .FirstOrDefault();

        //    Tag tag = ctx.Tags.Where(t => t.Name == "tag2").FirstOrDefault();
        //    Label1.Text = tag.Name;
        //    //booking.AddTag(tag);
        //    Label1.Text = booking.CustomerAddress + " Tags: " + booking.User.Username;
        //    //ctx.SaveChanges();
        //}

        //using (DataContext ctx = new DataContext()) {
        //    User user = new User() {
        //        Username = "test2",
        //        Password = "test2",
        //        Roles = "employee"
        //    };
        //    ctx.Users.Add(user);
        //    Booking booking = ctx.Bookings.Where(b => b.Id == 2).FirstOrDefault();
        //    booking.User = user;
        //    ctx.SaveChanges();
        //}

        //using (DataContext ctx = new DataContext()) {
        //    string tagIds = "1;2";
        //    Booking booking = new Booking() {
        //        StratDate = DateTime.Now,
        //        EstimatedDuration = 8.5,
        //        Description = "eamv",
        //    };
        //    string[] ids = tagIds.Split(';');
        //    foreach (string s in ids) {
        //        int id = Convert.ToInt32(s);
        //        booking.Tags.Add(BookingManager.Instance.GetTagById(id));
        //    }
        //    ctx.Bookings.Add(booking);
        //    if (ctx.SaveChanges() > 0) {
        //        Label1.Text = "Done";
        //    }
        //}
        List<Booking> bs = bookingManager.GetBookingsByDate(DateTime.Now);
        JavaScriptSerializer jss = new JavaScriptSerializer();
        string json = jss.Serialize(bookingManager.GetBookingsWithEmployeeId());
        Label1.Text = json;
    }
}