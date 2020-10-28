using API.Entities;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using API.Interfaces;
using API.Dtos;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using API.Extensions;
using System.Linq;
using API.Helpers;

namespace API.Controllers
{
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
        public UsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService)
        {
            _photoService = photoService;
            _mapper = mapper;
            _userRepository = userRepository;
        }

        [HttpGet]

        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery]UserParams userParams)
        {   
            var currentUser=await _userRepository.GetUserByUsernameAsync(User.GetUserName());
            userParams.CurrentUserName=currentUser.UserName;
            if(string.IsNullOrEmpty(userParams.Gender)){
                userParams.Gender=currentUser.Gender=="male"?"female":"male";
            }
            var users=await _userRepository.GetMembersAsync(userParams);
            Response.AddPaginationHeader(users.CurrentPage,users.PageSize,users.TotalCount,users.TotalPages);
            return Ok(users);
        }
        //api/users/id
        [HttpGet("{id}")]
        public async Task<ActionResult<MemberDto>> GetUserById(int id)
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            var userToReturn = _mapper.Map<MemberDto>(user);
            return Ok(userToReturn);
        }

        [HttpGet("name={username}",Name="GetUser")]
        public async Task<ActionResult<MemberDto>> GetUserByName(string username)
        {
            return await _userRepository.GetMemberAsync(username);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto updateDto)
        {
            var username = User.GetUserName();//extension method
            var user = await _userRepository.GetUserByUsernameAsync(username);
            _mapper.Map(updateDto, user);

            _userRepository.Update(user);

            if (await _userRepository.SaveAllAsync()) return NoContent();
            return BadRequest("Failed To Update");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUserName());
            var result=await _photoService.AddPhotoAsync(file);

            if(result.Error!=null) return BadRequest(result.Error.Message);
            
            var photo=new Photo{
                Url=result.SecureUrl.AbsoluteUri,
                PublicId=result.PublicId
            };

            if(user.Photos.Count==0){
                photo.IsMain=true;
            }

            user.Photos.Add(photo);
            if(await _userRepository.SaveAllAsync()){
                return CreatedAtRoute("GetUser",new{GetUserByName=user.UserName},_mapper.Map<PhotoDto>(photo));
            }

            return BadRequest("Unable to Add Photo");
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId){
            var user=await _userRepository.GetUserByUsernameAsync(User.GetUserName());
            var photo=user.Photos.FirstOrDefault(x=>x.Id==photoId);
            if(photo.IsMain) return BadRequest("Already Selected as Main Photo");
            var currentMain=user.Photos.FirstOrDefault(x=>x.IsMain);
            if(currentMain!=null) currentMain.IsMain=false;
            photo.IsMain=true;

            if(await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed To set as Main Photo");
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId){
            var user=await _userRepository.GetUserByUsernameAsync(User.GetUserName());
            var photo=user.Photos.FirstOrDefault(p=>p.Id==photoId);

            if(photo==null) return NotFound();
            if(photo.IsMain) return BadRequest("Can't delete Main Photo");
            if(photo.PublicId!=null){
                var res=await _photoService.DeletePhotoAsync(photo.PublicId);
                if(res.Error!=null) return BadRequest(res.Error.Message);        
            }

            user.Photos.Remove(photo);
            if(await _userRepository.SaveAllAsync()) return Ok();

            return BadRequest("Delitaion of Photo Failed");
        }
        
    }
}