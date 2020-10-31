using System.Collections.Generic;
using System.Threading.Tasks;
using API.Dtos;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class LikesController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly ILikesRepository _likesRepository;
        public LikesController(IUserRepository userRepository, ILikesRepository likesRepository)
        {
            _likesRepository = likesRepository;
            _userRepository = userRepository;
        }

        [HttpPost("{username}")]
        public async Task<ActionResult> AddLike(string username){
            var sourceUserId=User.GetUserId();
            var likedUser=await _userRepository.GetUserByUsernameAsync(username);
            var sourseUser=await _likesRepository.GetUsersWithLikes(sourceUserId);

            if(likedUser==null) return NotFound();
            if(sourseUser.UserName==username) return BadRequest("Can't Like Yourself");

            var userLike=await _likesRepository.GetUserLike(sourceUserId,likedUser.Id);

            if(userLike!=null) return BadRequest("Already Liked");

            userLike=new UserLike{
                SourceUserId=sourceUserId,
                LikedUserId=likedUser.Id
            };

            sourseUser.LikedUsers.Add(userLike);

            if(await _userRepository.SaveAllAsync()) return Ok();

            return BadRequest("IUser Like Failed");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LikeDto>>> GetUserLikes(string prdeicate){
            var users= await _likesRepository.GetUserLikes(prdeicate,User.GetUserId());
            return Ok(users);
        }
    }
}