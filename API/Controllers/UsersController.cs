using API.Entities;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using API.Interfaces;
using API.Dtos;
using AutoMapper;
using System.Security.Claims;

namespace API.Controllers
{
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        public UsersController(IUserRepository userRepository, IMapper mapper)
        {
            _mapper = mapper;
            _userRepository = userRepository;
        }

        [HttpGet]

        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUser()
        {
            // var users = await _userRepository.GetUsersAsync();
            // var usersToReturn=_mapper.Map<IEnumerable<MemberDto>>(users);
            // return Ok(usersToReturn);
            return Ok(await _userRepository.GetMembersAsync());
        }
        //api/users/id
        [HttpGet("{id}")]
        public async Task<ActionResult<MemberDto>> GetUserById(int id)
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            var userToReturn=_mapper.Map<MemberDto>(user);
            return Ok(userToReturn);
        }

        [HttpGet("name={username}")]
        public async Task<ActionResult<MemberDto>> GetUserByName(string username)
        {
           // var user=await _userRepository.GetUserByUsernameAsync(name);
           // return Ok(_mapper.Map<MemberDto>(user));
           return await _userRepository.GetMemberAsync(username);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto updateDto){
            var username=User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user=await _userRepository.GetUserByUsernameAsync(username);
            _mapper.Map(updateDto,user);

            _userRepository.Update(user);

            if(await _userRepository.SaveAllAsync()) return NoContent();
            return BadRequest("Failed To Update");   
        }
    }
}