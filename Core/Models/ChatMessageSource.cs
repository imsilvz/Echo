using System;
using System.Text.Json;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Echo.Core.Models.ChatTokens;
namespace Echo.Core.Models
{
    public class ChatMessageSource
    {
        public string SourcePlayer { get; set; }
        public string SourceServer { get; set; }
        public List<ChatToken> Tokens { get; set; }

        private ChatSegmentToken _segment;
        public ChatMessageSource(ChatSegmentToken token)
        {
            this._segment = token;
            this.Tokens = token.GetTokens();
        }

        public ChatMessageSource ResolveSource(string OpCode)
        {
            switch(OpCode)
            {
                case "000A": // SAY
                case "000B": // SHOUT
                case "000C": // TELL (Outgoing)
                case "000D": // TELL (Incoming)
                case "001C": // EMOTE
                case "001D": // ANIMATED EMOTE
                case "001E": // YELL
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
                            throw new ApplicationException("Unexpected Token Count!");
                    }
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
