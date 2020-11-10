using API.Entities;
using API.Dtos;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using API.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using AutoMapper;


namespace API.Controllers
{
    [AllowAnonymous]
    public class AccountController : BaseApiController
    {
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, ITokenService tokenService, IMapper mapper)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _mapper = mapper;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.Username)) return BadRequest("User Exists");
            var user = _mapper.Map<AppUser>(registerDto);

            user.UserName = registerDto.Username.ToLower();

            user.Alias = registerDto.Username;

            var result=await _userManager.CreateAsync(user,registerDto.Password);

            if(!result.Succeeded) return BadRequest(result.Errors);

            var roleResult=await _userManager.AddToRoleAsync(user,"Member");

            if(!roleResult.Succeeded) return BadRequest("Failed To Add Role");

            return new UserDto
            {
                UserName = user.UserName,
                Token =await _tokenService.CreateToken(user),
                Alias = user.Alias ?? user.UserName,
                Gender = user.Gender
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.Users.Include(p => p.Photos)
            .SingleOrDefaultAsync(x => x.UserName.ToLower() == loginDto.UserName.ToLower());//eager loading

            if (user == null) return Unauthorized("Inavlid Username");

            var result=await _signInManager.CheckPasswordSignInAsync(user,loginDto.Password,false);

            if(!result.Succeeded) return Unauthorized();

            return new UserDto
            {
                UserName = user.UserName,
                Token =await _tokenService.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                Alias = user.Alias ?? user.UserName,
                Gender = user.Gender
            };

        }
        private async Task<bool> UserExists(string username)
        {
            return await _userManager.Users.AnyAsync(x => x.UserName == username.ToLower());
        }
    }
}