using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class LikesRepository : ILikesRepository
    {
        private readonly DataContext _context;
        public LikesRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<UserLike> GetUserLike(int sourceUserId, int likeUserId)
        {
            return await _context.Likes.FindAsync(sourceUserId,likeUserId);
        }

        public async Task<IEnumerable<LikeDto>> GetUserLikes(string predicet, int userid)
        {
            var users=_context.Users.OrderBy(u=>u.UserName).AsQueryable();
            var likes=_context.Likes.AsQueryable();

            if(predicet=="liked"){
                likes=likes.Where(likes=>likes.SourceUserId==userid);
                users=likes.Select(like=>like.LikedUser);
            }

            if(predicet=="likedBy"){
                likes=likes.Where(likes=>likes.LikedUserId==userid);
                users=likes.Select(like=>like.SourceUser);
            }

            return await users.Select(user=>new LikeDto{
                UserName=user.UserName,
                Alias=user.Alias,
                Age=user.DateOfBirth.CalculateAge(),
                PhotoUrl=user.Photos.FirstOrDefault(p=>p.IsMain).Url,
                City=user.City,
                Id=user.Id
            }).ToListAsync();
        }

        public async Task<AppUser> GetUsersWithLikes(int userId)
        {
            return await _context.Users
            .Include(x=>x.LikedUsers)
            .FirstOrDefaultAsync(u=>u.Id==userId);
        }
    }
}