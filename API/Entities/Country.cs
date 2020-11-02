using System.Collections.Generic;
namespace API.Entities
{
    public class Country
    {
        public int Id { get; set; }
        public string ConutryName { get; set; }
        public  ICollection<State> States { get; set; }
    }
}
