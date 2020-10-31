using System.Collections.Generic;
using System.Threading.Tasks;
using API.Dtos;
using API.Entities;

namespace API.Interfaces
{
    public interface ILikesRepository
    {
        Task<UserLike> GetUserLike(int sourceUserId,int likeUserId);
        Task<AppUser> GetUsersWithLikes(int userId);
        Task<IEnumerable<LikeDto>> GetUserLikes(string predicet,int userid);
    }
}