using System;
using System.Text.Json;
using System.Diagnostics;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Echo.Core.Enum.FFXIV;
using Echo.Core.Models.ChatTokens;
namespace Echo.Core.Models
{
    public class ChatMessageSource
    {
        public bool IsBattle { get; set; }
        public bool IsSystem { get; set; }
        public string SourcePlayer { get; set; }
        public string SourceServer { get; set; }
        public List<ChatToken> Tokens { get; set; }

        private ChatSegmentToken _segment;
        public ChatMessageSource(ChatSegmentToken token)
        {
            this._segment = token;
            this.Tokens = token.GetTokens();

            this.IsBattle = false;
            this.IsSystem = false;
        }

        public ChatMessageSource ResolveSource(string StrCode)
        {
            ushort OpCode = ushort.Parse(StrCode, System.Globalization.NumberStyles.AllowHexSpecifier);
            switch (OpCode)
            {
                // STANDARD CHAT
                case ushort typ when System.Enum.IsDefined(typeof(StandardChatType), typ):
                    // [ChatLinkToken OR ChatTextToken, (ChatIconToken), (ChatTextToken)]
                    // [PlayerName, N/A, ServerName]
                    ChatToken nameToken;
                    ChatToken serverToken;
                    switch (Tokens.Count)
                    {
                        case 1:
                            // All that is present is the name
                            nameToken = Tokens[0];
                            if(nameToken is ChatTextToken)
                            {
                                SourcePlayer = ((ChatTextToken)nameToken).GetTokenValue();
                            }
                            else if(nameToken is ChatLinkToken)
                            {
                                SourcePlayer = ((ChatLinkToken)nameToken).GetTokenText();
                            }
                            break;
                        case 3:
                            // Name / Icon / Server
                            serverToken = Tokens[2];
                            SourceServer = ((ChatTextToken)serverToken).GetTokenValue();
                            goto case 1;
                        default:
                            // Unknown Behavior!
                            Debug.WriteLine(this.ListTokens());
                            throw new ApplicationException("Unexpected Token Count!");
                    }
                    break;

                // SPECIAL CHAT
                case ushort typ when System.Enum.IsDefined(typeof(SpecialChatType), typ):
                    // messages in Novice Network have an extra icon preceding the chat link
                    Debug.WriteLine(this.ListTokens());
                    break;

                // BATTLE CHATLOG
                case ushort typ when System.Enum.IsDefined(typeof(BattleChatType), typ):
                    this.IsBattle = true;
                    break;

                // SYSTEM MESSAGES
                case ushort typ when System.Enum.IsDefined(typeof(SystemChatType), typ):
                    this.IsSystem = true;
                    break;
                default:
                    break;
            }
            return this;
        }

        public string ListTokens()
        {
            List<string> tokenList = new List<string>();
            foreach(var token in Tokens)
            {
                tokenList.Add(token.GetType().Name);
            }
            return JsonSerializer.Serialize(tokenList);
        }
    }
}
