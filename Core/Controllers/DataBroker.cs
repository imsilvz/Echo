using System;
using System.Text.Json;
using System.Diagnostics;
using System.Collections.Generic;

using Echo.Core.Models;
using Echo.Core.JSON;

using Sharlayan;
using Sharlayan.Core;
using Sharlayan.Enums;
using Sharlayan.Models;
using Sharlayan.Models.ReadResults;
namespace Echo.Controllers
{
    public class DataBroker
    {
        ProcessModel _processModel;
        MemoryHandler _memoryHandler;

        private int _prevChatIndex = 0;
        private int _prevChatOffset = 0;
        public DataBroker()
        {
            Process[] processes = Process.GetProcessesByName("ffxiv_dx11");
            if(processes.Length >= 1)
            {
                bool useLocalCache = false;
                string patchVersion = "latest";
                GameRegion gameRegion = GameRegion.Global;
                GameLanguage gameLanguage = GameLanguage.English;

                Process process = processes[0];
                _processModel = new ProcessModel
                {
                    Process = process
                };

                SharlayanConfiguration configuration = new SharlayanConfiguration
                {
                    ProcessModel = _processModel,
                    GameLanguage = gameLanguage,
                    GameRegion = gameRegion,
                    PatchVersion = patchVersion,
                    UseLocalCache = useLocalCache
                };

                _memoryHandler = SharlayanMemoryManager.Instance.AddHandler(configuration);
            }
        }

        ~DataBroker()
        {
            SharlayanMemoryManager.Instance.RemoveHandler(_processModel.ProcessID);
        }

        public bool Connect()
        {
            return false;
        }

        public string QueryChat()
        {
            if (_memoryHandler.Reader.CanGetChatLog())
            {
                var chatLog = _memoryHandler.Reader.GetChatLog(
                    _prevChatIndex,
                    _prevChatOffset
                );

                if(!chatLog.ChatLogItems.IsEmpty)
                {
                    var items = chatLog.ChatLogItems.ToArray();
                    _prevChatIndex = chatLog.PreviousArrayIndex;
                    _prevChatOffset = chatLog.PreviousOffset;

                    // TODO: associate chat message with actor ID
                    var cleanedMessages = new List<ChatMessage>();
                    var cleanedItems = new List<CleanedChatLogItem>();
                    foreach(var item in items)
                    {
                        var chatMessage = new ChatMessage(item.Bytes);
                        if (chatMessage.Tokenize()) 
                        {
                            cleanedMessages.Add(chatMessage);
                            // do something!
                            //Debug.WriteLine(JsonSerializer.Serialize(chatMessage));
                        }
                        else
                        {
                            Debug.WriteLine("ERROR PARSING CHAT MESSAGE");
                            string hex1 = BitConverter.ToString(item.Bytes)
                                .Replace("-", string.Empty);
                            Debug.WriteLine($"DATA: {hex1}");
                        }
                        var cleanedItem = new CleanedChatLogItem(item);
                        cleanedItems.Add(cleanedItem);
                    }

                    var serializeOptions = new JsonSerializerOptions
                    {
                        WriteIndented = true,
                        Converters =
                        {
                            new CleanedChatLogConverter()
                        }
                    };

                    var text = JsonSerializer.Serialize<List<CleanedChatLogItem>>(cleanedItems, serializeOptions);
                    return text;
                }
            }
            return "[]";
        }

        public string QueryPlayer()
        {
            if (_memoryHandler.Reader.CanGetCurrentUser())
            {
                PlayerData data = new PlayerData();
                var currentUser = _memoryHandler.Reader.GetCurrentPlayer();
                var userEntity = currentUser.Entity;

                if(userEntity is not null)
                {
                    data.ID = userEntity.ID;
                    data.Name = userEntity.Name;

                    if (_memoryHandler.Reader.CanGetTargetInfo())
                    {
                        var targetResult = _memoryHandler.Reader.GetTargetInfo();
                        if (targetResult.TargetsFound)
                        {
                            var targetInfo = targetResult.TargetInfo;
                            if (targetInfo.CurrentTarget is not null)
                            {
                                data.TargetID = targetInfo.CurrentTarget.ID;
                                data.TargetType = targetInfo.CurrentTarget.Type;
                                data.TargetName = targetInfo.CurrentTarget.Name;
                            }
                        }
                    }
                    return JsonSerializer.Serialize(data);
                }
            }
            return "[]";
        }

        public string Ping()
        {
            return QueryChat();
        }
    }
}
