using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
/// <summary>
/// Summary description for BookingManager
/// </summary>
public class BookingManager {
    private static object syncRoot = new Object();
    private static volatile BookingManager instance;
    private BookingManager() {
    }
    public static BookingManager Instance {
        get {
            if (instance == null) {
                lock (syncRoot) {
                    if (instance == null) {
                        instance = new BookingManager();
                    }
                }
            }
            return instance;
        }
    }

    public bool StoreBooking(Booking booking, int customerId, string tagIds) {
        using (DataContext ctx = new DataContext()) {
            booking.BookingState = BookingState.UNPLANNED;
            try {
                string[] ids = tagIds.Split(';');
                foreach (string s in ids) {
                    int id = Convert.ToInt32(s);
                    booking.Tags.Add(GetTagById(id, ctx));
                }
                booking.Customer = GetCustomerById(customerId, ctx);
                ctx.Bookings.Add(booking);
                return ctx.SaveChanges() > 0;
            } catch (Exception e) {
                throw e;
            }
        }
    }

    public List<Tag> GetTags() {
        using (DataContext ctx = new DataContext()) {
            try {
                return ctx.Tags.OrderByDescending(t => t.Bookings.Count).ToList();
                //return ctx.Tags.ToList();
            } catch (Exception e) {
                throw e;
            }
        }
    }

    public Tag StoreTag(Tag tag) {
        using (DataContext ctx = new DataContext()) {
            try {
                ctx.Tags.Add(tag);
                ctx.SaveChanges();
                return tag;
            } catch (Exception e) {
                throw e;
            }
        }
    }


    public Tag GetTagById(int id) {
        using (DataContext ctx = new DataContext()) {
            try {
                return GetTagById(id, ctx);
            } catch (Exception e) {
                throw e;
            }
        }
    }

    public Customer StoreCustomer(Customer customer) {
        using (DataContext ctx = new DataContext()) {
            try {
                ctx.Customers.Add(customer);
                ctx.SaveChanges();
                return customer;
            } catch (Exception e) {
                throw e;
            }
        }
    }

    public List<Customer> GetCustomers() {
        using (DataContext ctx = new DataContext()) {
            try {
                return ctx.Customers.OrderBy(c => c.Name).ToList();
            } catch (Exception e) {
                throw e;
            }
        }
    }

    public Customer GetCustomerById(int id) {
        using (DataContext ctx = new DataContext()) {
            try {
                return GetCustomerById(id, ctx);
            } catch (Exception e) {
                throw e;
            }
        }
    }

    public List<Booking> GetBookingsByDate(DateTime date) {
        using (DataContext ctx = new DataContext()) {
            try {
                return ctx.Bookings.ToList();
            } catch (Exception e) {
                throw e;
            }
        }
    }

    public object[] GetBookingsWithEmployeeId() {
        using (DataContext ctx = new DataContext()) {
            try {
                List<Booking> bl = ctx.Bookings.Include(b => b.Employee).ToList();
                object[] list = new object[bl.Count];
                int i = 0;
                foreach (Booking booking in bl) {
                    object[] array = new object[2];
                    if (booking.Employee != null) {
                        array[0] = booking.Employee.Id;
                        booking.Employee = null;
                    } else {
                        array[0] = -1;
                    }
                    array[1] = booking;
                    list[i] = array;
                    i++;
                }
                return list;
            } catch (Exception e) {
                throw e;
            }
        }
    }

    public bool PlanBooking(DateTime scheduledDate, int bookingId, int employeeId) {
        using (DataContext ctx = new DataContext()) {
            try {
                Booking booking = ctx.Bookings.Where(b => b.Id == bookingId).FirstOrDefault();
                booking.SchedueledStartDate = scheduledDate;
                booking.BookingState = BookingState.PLANNED;
                Employee employee = ctx.Employees.Where(e => e.Id == employeeId).FirstOrDefault();
                booking.Employee = employee;
                //employee.Bookings.Add(booking);
                return ctx.SaveChanges() > 0;
            } catch (Exception e) {
                throw e;
            }
        }
    }

    public bool UnBookBooking(int bookingId) {
        using (DataContext ctx = new DataContext()) {
            try {
                Booking booking = ctx.Bookings.Where(b => b.Id == bookingId).FirstOrDefault();
                booking.Employee = null;
                booking.BookingState = BookingState.UNPLANNED;
                booking.SchedueledStartDate = new DateTime(1753, 1, 1);
                return ctx.SaveChanges() > 0;
            } catch (Exception e) {
                throw e;
            }
        }
    }

    private Tag GetTagById(int id, DataContext ctx) {
        try {
            return ctx.Tags.Where(t => t.Id == id).FirstOrDefault();
        } catch (Exception e) {
            throw e;
        }
    }

    private Customer GetCustomerById(int id, DataContext ctx) {
        try {
            return ctx.Customers.Where(c => c.Id == id).FirstOrDefault();
        } catch (Exception e) {
            throw e;
        }
    }
}