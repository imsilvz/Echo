using System;
using System.Linq;
using System.Text.Json;
using System.Diagnostics;
using System.Collections.Generic;

using Echo.Core.Enum.FFXIV;
using Echo.Core.Models.ChatTokens;
namespace Echo.Core.Models
{
    public class ChatMessageContent
    {
        public string Message { get; set; }
        public List<ChatLink> Links { get; set; }
        public List<ChatToken> Tokens { get; set; }

        private ChatSegmentToken _segment;
        public ChatMessageContent(ChatSegmentToken token)
        {
            this._segment = token;
            this.Message = "";
            this.Links = new List<ChatLink>();
            this.Tokens = token.GetTokens();
        }

        public ChatMessageContent ResolveContent(string StrCode)
        {
            ushort OpCode = ushort.Parse(StrCode, System.Globalization.NumberStyles.AllowHexSpecifier);
            switch(OpCode)
            {
                case ushort a when System.Enum.IsDefined(typeof(ChatType), a):
                    // Generic Parsing
                    var filtered = getFilteredChatTokens();
                    for(int i=0; i<filtered.Count; i++)
                    {
                        var token = filtered[i];
                        switch(token)
                        {
                            case ChatTextToken text:
                                Message += text.GetTokenValue();
                                break;
                            case ChatLinkToken link:
                                string linkText = link.GetTokenText();
                                if(linkText is null)
                                {
                                    // different handling?
                                }
                                else
                                {
                                    Links.Add(new ChatLink
                                    {
                                        UUID = $"ChatLink_{Guid.NewGuid()}",
                                        StartIndex = Message.Length,
                                        Length = linkText.Length,
                                        Content = linkText
                                    });
                                    Message += linkText;
                                }

                                List<string> tokenList = new List<string>();
                                foreach (var t in filtered)
                                {
                                    tokenList.Add(t.GetType().Name);
                                }

                                // check for server delimiter
                                // 001D:[Link(Arik Malaguld)]:[Link(Arik Malaguld)][Icon]Balmung gently pats [Link(Selenio Silbermann)][Icon]Coeurl.
                                if ((i+2) < filtered.Count)
                                {
                                    // there must be at least two more tokens!
                                    var serverDelim = filtered[i + 1];
                                    var serverTextToken = filtered[i + 2];
                                    if(serverDelim is ChatIconToken)
                                    {
                                        if(serverTextToken is ChatTextToken)
                                        {
                                            // looking good so far!
                                            // now we have to extract the servername from the text token
                                            string serverName = "";
                                            string remainderString = "";
                                            string rawServerString = ((ChatTextToken)serverTextToken).GetTokenValue();

                                            // i tried to be clever and only proved i am not
                                            foreach(var server in Constants.Servers)
                                            {
                                                if(rawServerString.StartsWith(server))
                                                {
                                                    serverName = server;
                                                    remainderString = rawServerString.Substring(server.Length);

                                                    Message += $" ({serverName})";
                                                    Message += remainderString;

                                                    // skip those tokens as they have already been processed
                                                    i += 2;
                                                    break;
                                                }
                                            }

                                        }
                                    }
                                }
                                break;
                            case ChatIconToken icon:
                                // TODO: figure out a way to display?
                                Message += " ";
                                break;
                            default:
                                throw new Exception();
                        }
                    }
                    break;
                default:
                    Debug.WriteLine($"{StrCode}: {this.ListTokens()}");
                    Debug.WriteLine(this._segment.BuildMessage());
                    Message = _segment.BuildMessage();
                    break;
            }
            return this;
        }

        public string ListTokens()
        {
            List<string> tokenList = new List<string>();
            foreach (var token in Tokens)
            {
                tokenList.Add(token.GetType().Name);
            }
            return JsonSerializer.Serialize(tokenList);
        }

        private List<ChatToken> getFilteredChatTokens()
        {
            // get chat tokens with generics filtered out
            List<ChatToken> lst = new List<ChatToken>();

            foreach(var token in Tokens)
            {
                if (token is GenericControlToken)
                    continue;
                lst.Add(token);
            }

            return lst;
        }
    }
}
