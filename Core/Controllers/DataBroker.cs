using System;
using System.Text.Json;
using System.Diagnostics;
using System.Collections.Generic;

using Echo.Core.Models;
using Echo.SharlayanWrappers;

using Sharlayan;
using Sharlayan.Core;
using Sharlayan.Enums;
using Sharlayan.Models;
using Sharlayan.Models.ReadResults;
namespace Echo.Core.Controllers
{
    public class DataBroker
    {
        private static Lazy<DataBroker> _instance = new Lazy<DataBroker>(() => new DataBroker());
        public static DataBroker Instance => _instance.Value;

        private ActorItem _lastPlayerData;
        private TargetInfo _lastTargetData;
        private List<ChatMessage> _chatlog;
        private int _chatlogOffset = 0;

        public DataBroker() { }

        public void Initialize()
        {
            SetupEventHost();
            _chatlog = new List<ChatMessage>();
        }

        public string QueryChat()
        {
            var messages = _chatlog;

            // get offset
            var len = messages.Count;
            ChatMessage[] update = new ChatMessage[len - _chatlogOffset];
            messages.CopyTo(_chatlogOffset, update, 0, update.Length);
            _chatlogOffset += update.Length;

            // serialize
            return JsonSerializer.Serialize(update);
        }

        public string QueryPlayer()
        {
            var data = new PlayerData();

            if(_lastPlayerData is not null)
            {
                data.ID = _lastPlayerData.ID;
                data.Name = _lastPlayerData.Name;

                var currentTarget = _lastTargetData.CurrentTarget;
                if (currentTarget is not null)
                {
                    data.TargetID = currentTarget.ID;
                    data.TargetName = currentTarget.Name;
                    data.TargetType = currentTarget.Type;
                }
            }
            return JsonSerializer.Serialize(data);
        }

        private void SetupEventHost()
        {
            EventHost.Instance.OnNewChatLogItem += this.SharlayanEvent_OnChatUpdate;
            EventHost.Instance.OnNewCurrentUser += this.SharlayanEvent_OnPlayerUpdate;
            EventHost.Instance.OnNewTargetInfo += this.SharlayanEvent_OnTargetUpdate;
        }

        private void SharlayanEvent_OnChatUpdate(object? sender, MemoryHandler memoryHandler, ChatLogItem chatLogItem)
        {
            byte[] bytes = chatLogItem.Bytes;
            var chatMessage = new ChatMessage(bytes);

            if(chatMessage.Tokenize())
            {
                _chatlog.Add(chatMessage.Resolve());
            }
            else
            {
                Debug.WriteLine("ERROR TOKENIZING CHAT MESSAGE");
                string hex1 = BitConverter.ToString(bytes)
                    .Replace("-", string.Empty);
                Debug.WriteLine($"DATA: {hex1}");
            }
        }

        private void SharlayanEvent_OnPlayerUpdate(object? sender, MemoryHandler memoryHandler, ActorItem actorItem)
        {
            _lastPlayerData = actorItem;
        }

        private void SharlayanEvent_OnTargetUpdate(object? sender, MemoryHandler memoryHandler, TargetInfo targetInfo)
        {
            _lastTargetData = targetInfo;
        }
    }
}
