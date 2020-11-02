using System.Collections.Generic;

namespace API.Entities
{
    public class State
    {
        public int Id { get; set; }
        public string StateName { get; set; }
        public int CountryId { get; set; }

        public  Country Country { get; set; }
        public  ICollection<City> Cities { get; set; }
    }
}