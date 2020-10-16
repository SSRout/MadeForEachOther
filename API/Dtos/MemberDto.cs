using System;
using System.Collections.Generic;

namespace API.Dtos
{
    public class MemberDto
    {
      public int Id { get; set; }
      public string Username { get; set; }
      public string Firstname { get; set; }
      public string Lastname { get; set; }
      public string Alias { get; set; }
      public DateTime DateOfBirth { get; set; }
       public int Age { get; set; }
      public string ContactNo { get; set; }
      public string EmailId { get; set; }
      public string Gender { get; set; }
      public string Biodata { get; set; }
      public string LookingFor { get; set; }
      public string Interests { get; set; }
      public string Religion { get; set; }
      public string Cast { get; set; }
      public string City { get; set; }
      public string State { get; set; }
      public string Country { get; set; }
      public ICollection<PhotoDto> Photos { get; set; }
      public string PhotoUrl { get; set; }
      public DateTime LastActive { get; set; }
      public DateTime CreatedDate { get; set; }

    }
}