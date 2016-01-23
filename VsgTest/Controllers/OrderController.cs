using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using VsgTest.Models;

namespace VsgTest.Controllers
{
    public class OrderController : ApiController
    {
        private DataContext db = new DataContext();

        // GET api/Order
        public IEnumerable<Order> GetOrders()
        {
            return db.Orders.AsEnumerable();
        }

        // GET api/Order/5
        public Order GetOrder(long id)
        {
            Order order = db.Orders.Find(id);
            if (order == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return order;
        }

        // PUT api/Order/5
        public HttpResponseMessage PutOrder(long id, Order order)
        {
            if (ModelState.IsValid && id == order.Id)
            {
                db.Entry(order).State = EntityState.Modified;

                try
                {
                    db.SaveChanges();
                }
                catch (DbUpdateConcurrencyException)
                {
                    return Request.CreateResponse(HttpStatusCode.NotFound);
                }

                return Request.CreateResponse(HttpStatusCode.OK);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }

        // POST api/Order
        public HttpResponseMessage PostOrder(Order order)
        {
            if (ModelState.IsValid)
            {
                db.Orders.Add(order);
                db.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, order);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = order.Id }));
                return response;
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }

        // DELETE api/Order/5
        public HttpResponseMessage DeleteOrder(long id)
        {
            Order order = db.Orders.Find(id);
            if (order == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            db.Orders.Remove(order);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            return Request.CreateResponse(HttpStatusCode.OK, order);
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}