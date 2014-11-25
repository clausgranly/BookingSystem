using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for User
/// </summary>
public class User {
    public User() {
    }

    [Key, ForeignKey("Employee")]
    public int Id {
        get;
        set;
    }

    public string Username {
        get;
        set;
    }

    public string Password {
        get;
        set;
    }

    public string Roles {
        get;
        set;
    }
    public Employee Employee {
        get;
        set;
    }
}