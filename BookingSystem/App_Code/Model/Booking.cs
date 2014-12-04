using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for Booking
/// </summary>
public class Booking {
    public Booking() {
        Tags = new List<Tag>();
        SchedueledStartDate = new DateTime(1753, 1, 1);
    }
    public int Id {
        get;
        set;
    }

    public string Name {
        get;
        set;
    }
    public DateTime StratDate {
        get;
        set;
    }

    public DateTime SchedueledStartDate {
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

    public string Address {
        get;
        set;
    }

    public Customer Customer {
        get;
        set;
    }
}