using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Management_CreateBooking : System.Web.UI.Page {
    private static BookingManager bookingManager = BookingManager.Instance;
    protected void Page_Load(object sender, EventArgs e) {
        //Test();
        //CreateTag(@"{""Name"":""tag0"",""Description"":""tag00""}");
    }
    [WebMethod]
    public static bool CreateBooking(string jsonBooking, int customerId, string tagIds) {
        JavaScriptSerializer jss = new JavaScriptSerializer();
        Booking b = jss.Deserialize<Booking>(jsonBooking);
        return bookingManager.StoreBooking(b, customerId, tagIds);
    }

    [WebMethod]
    public static Customer CreateCustomer(string jsonCustomer) {
        JavaScriptSerializer jss = new JavaScriptSerializer();
        Customer c = jss.Deserialize<Customer>(jsonCustomer);
        return bookingManager.StoreCustomer(c);
    }

    [WebMethod]
    public static List<Customer> GetCustomers() {
        return bookingManager.GetCustomers();
    }

    [WebMethod]
    public static Customer GetCustomerById(int customerId) {
        return bookingManager.GetCustomerById(customerId);
    }

    [WebMethod]
    public static List<Tag> GetTags() {
        return bookingManager.GetTags();
    }

    [WebMethod]
    public static Tag CreateTag(string jsonTag) {
        JavaScriptSerializer jss = new JavaScriptSerializer();
        Tag t = jss.Deserialize<Tag>(jsonTag);
        return bookingManager.StoreTag(t);
    }

    [WebMethod]
    public static Tag GetTagById(int id) {
        return bookingManager.GetTagById(id);
    }

    [WebMethod]
    public static string Test() {
        Booking booking = new Booking() {
            StratDate = DateTime.Now,
            EstimatedDuration = 8.5,
            Description = "BlahBlahBlahBlah",
            BookingState = BookingState.INPROGRESS,
            Employee = new Employee() {
                Name = "claus",
                Phonenumber = 12354678,
                User = new User() {
                    Username = "test",
                    Password = "test",
                    Roles = "YOLO"
                }
            },
            Tags = new List<Tag>() { new Tag(){
                    Name= "tag0",
                    Description ="tag0"
                }, new Tag(){
                    Name= "tag1",
                    Description ="tag1"
                }   
            }
        };
        JavaScriptSerializer js = new JavaScriptSerializer();
        string s = @"{""Id"":0,""StratDate"":""\/Date(1416208314003)\/"",""EstimatedDuration"":8.5,""Description"":""BlahBlahBlahBlah"",""CustomerAddress"":""vej1"",""CustomerPhone"":12345678,""BookingState"":2}";
        Booking b = js.Deserialize<Booking>(s);
        string q = js.Serialize(booking);
        return js.Serialize(booking);
    }
}