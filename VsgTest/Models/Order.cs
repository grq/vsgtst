using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VsgTest.Models
{
    public class Order
    {
        public Int64 Id { get; set; }

        public string Name { get; set; }

        public OrderStatus Status { get; set; }

        public DateTime Date { get; set; }
    }
}