using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for Booking
/// </summary>
public class Booking {
    //private List<Tag> tags;
    public Booking() {
        Tags = new List<Tag>();
    }
    public int Id {
        get;
        set;
    }
    public DateTime StratDate {
        get;
        set;
    }
    public double EstimatedDuration {
        get;
        set;
    }
    public string Description {
        get;
        set;
    }
    public string CustomerAddress {
        get;
        set;
    }
    public int CustomerPhone {
        get;
        set;
    }

    public BookingState BookingState {
        get;
        set;
    }

    public Employee Employee {
        get;
        set;
    }
    public List<Tag> Tags {
        get;
        set;
    }
    //public void AddTag(Tag tag) {
    //    tags.Add(tag);
    //}
}