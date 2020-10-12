using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController] 
    [Route("api/[controller]")]
    public class BuggyController:ControllerBase
    {
        private readonly DataContext _context;
        public BuggyController(DataContext context)
        {
            _context = context;         
        }

        [HttpGet("auth")]
        public ActionResult<string> GetSecret(){
            return "Secret Text";
        }

        [HttpGet("not-found")]
        public ActionResult<AppUser> GetNotFound(){
            var res=_context.Users.Find(-1);
            if(res==null) return NotFound();
            return Ok(res);
        }

        [HttpGet("server-error")]
        public ActionResult<string> GetServerError(){
           var res=_context.Users.Find(-1);
           var resToReturn=res.ToString();
           return resToReturn;
        }

        [HttpGet("bad-request")]
        public ActionResult<string> GetBadRequest(){
            return BadRequest("This is a Bad Request");
        }  
    }
}