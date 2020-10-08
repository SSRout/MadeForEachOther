namespace API.Entities
{
    public class AppUser
    {
      public int Id { get; set; }
      public string UserName { get; set; }
      public byte[] PasswordHash {get;set;}
      public byte[] PasswordSalt { get; set; }
      public string FirstName { get; set; }
      public string LastName { get; set; }
      public string Alias { get; set; }
    }
}