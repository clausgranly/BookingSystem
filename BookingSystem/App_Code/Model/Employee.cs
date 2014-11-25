using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for Employee
/// </summary>
public class Employee {
    public Employee() {
    }

    public int Id {
        get;
        set;
    }

    public string Name {
        get;
        set;
    }

    public int Phonenumber {
        get;
        set;
    }
    public List<Booking> Bookings {
        get;
        set;
    }

    public User User {
        get;
        set;
    }
}