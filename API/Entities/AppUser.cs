using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class AppUser:IdentityUser<int>
    {
      public string FirstName { get; set; }
      public string LastName { get; set; }
      public string Alias { get; set; }
      public DateTime DateOfBirth { get; set; }
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
      public string Country { get; set; }="India";
      public ICollection<Photo> Photos { get; set; }
      public DateTime LastActive { get; set; }=DateTime.Now;
      public DateTime CreatedDate { get; set; }=DateTime.Now;
      public ICollection<UserLike> LikedByUsers { get; set; }
      public ICollection<UserLike> LikedUsers { get; set; }
      public ICollection<Message> MessageSent { get; set; }
      public ICollection<Message> MessageReceived { get; set; }
       public ICollection<AppUserRole> UserRoles { get; set; }
    }
}