using API.Data;
using API.Entities;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
namespace API.Controllers
{
    public class UsersController : BaseController
    {
        private readonly DataContext _context;
        public UsersController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppUser>>> GetUser(){
            return await _context.Users.ToListAsync();
        }
        //api/users/id
        [HttpGet("{id}")]
        public async Task<ActionResult<AppUser>> GetUserById(int id){
           return await _context.Users.FindAsync(id);
        }
    }
}