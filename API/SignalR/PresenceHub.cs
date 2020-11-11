using System;
using System.Threading.Tasks;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    [Authorize]
    public class PresenceHub : Hub
    {
        private readonly PresenceTracker _tracker;
        public PresenceHub(PresenceTracker tracker)
        {
            _tracker = tracker;
        }

        public override async Task OnConnectedAsync()
        {
            var isOnline=await _tracker.UserConnected(Context.User.GetUserName(),Context.ConnectionId);
            if(isOnline)
                await Clients.Others.SendAsync("UserIsOnline", Context.User.GetUserName());
             
            var curentUsers=await _tracker.GetOnlineUsers();
            await Clients.Caller.SendAsync("GetOnlineUsers",curentUsers);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var isOffLine=await _tracker.UserDisconnected(Context.User.GetUserName(),Context.ConnectionId);
            if(isOffLine)
                await Clients.Others.SendAsync("UserIsOffline", Context.User.GetUserName()); 

            await base.OnDisconnectedAsync(exception);
        }

        

    }
}