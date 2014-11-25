using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for Tag
/// </summary>
public class Tag {
    //private List<Booking> bookings; 
    public Tag() {
        //bookings = new List<Booking>();
    }
    public int Id {
        get;
        set;
    }
    public string Name {
        get;
        set;
    }
    public string Description {
        get;
        set;
    }

    //public void addBooking(Booking booking) {
    //    bookings.Add(booking);
    //}

    //public void RemoveBooking(Booking booking) {
    //    bookings.Remove(booking);
    //}

    public List<Booking> Bookings {
        get;
        set;
    }

}