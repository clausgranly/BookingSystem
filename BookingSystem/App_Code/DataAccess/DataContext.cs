using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for DataContext
/// </summary>
public class DataContext : DbContext {
    public DataContext()
        : base("EmployeeManagementConnectionString") {
        //Database.SetInitializer<DataContext>(new CreateDatabaseIfNotExists<DataContext>());
        Database.SetInitializer<DataContext>(new DropCreateDatabaseIfModelChanges<DataContext>());
        //Database.SetInitializer<DataContext>(new DropCreateDatabaseAlways<DataContext>());
        //Database.SetInitializer<DataContext>(new DataContext());
    }

    public DbSet<Booking> Bookings {
        get;
        set;
    }
    public DbSet<Tag> Tags {
        get;
        set;
    }
    public DbSet<User> Users {
        get;
        set;
    }
    public DbSet<Employee> Employees {
        get;
        set;
    }
}