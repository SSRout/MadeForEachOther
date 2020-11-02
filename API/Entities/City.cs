namespace API.Entities
{
    public class City
    {
        public int Id { get; set; }
        public string CityName { get; set; }
        public int StateId { get; set; }
        public  State State { get; set; }
    }
}