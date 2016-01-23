using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace VsgTest.Models
{
    public class DataContext : DbContext
    {
        public DbSet<Order> Orders { get; set; }
    }
}