using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public MessageRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public void AddMessage(Message message)
        {
            _context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            _context.Messages.Remove(message);
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FindAsync(id);
        }

        public async Task<PagedList<MessageDto>> GetMessageForUser(MessageParams messageParams)
        {
            var query = _context.Messages.OrderByDescending(m => m.MesageSent).AsQueryable();

            query = messageParams.Container switch
            {
                "Inbox" => query.Where(u => u.Recipient.UserName == messageParams.UserName),
                "Outbox" => query.Where(u => u.Sender.UserName == messageParams.UserName),
                _ => query.Where(u => u.Recipient.UserName == messageParams.UserName && u.DateRead == null)
            };

            var messages=query.ProjectTo<MessageDto>(_mapper.ConfigurationProvider);
            return await PagedList<MessageDto>.CreateAsync(messages,messageParams.PageNumber,messageParams.PageSize);
        }

        public async Task<IEnumerable<MessageDto>> GetMessageThread(string currentUserName, string recipientName)
        {
           var meassages =await _context.Messages
           .Include(u=>u.Sender).ThenInclude(p=>p.Photos)
           .Include(u=>u.Recipient).ThenInclude(p=>p.Photos)
           .Where(
               m=>m.Recipient.UserName==currentUserName && m.Sender.UserName==recipientName
              || m.Recipient.UserName==recipientName && m.Sender.UserName==currentUserName
              ).OrderBy(m=>m.MesageSent).ToListAsync(); 

           var unreadMessages=meassages.Where(m=>m.DateRead==null && m.Recipient.UserName==currentUserName).ToList();

           if(unreadMessages.Any()){
               foreach(var message in unreadMessages){
                   message.DateRead=DateTime.Now;
               }
               await _context.SaveChangesAsync();
           }

           return _mapper.Map<IEnumerable<MessageDto>>(meassages);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}