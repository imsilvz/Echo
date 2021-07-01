using System;
using System.IO;
using System.Diagnostics;
using System.Collections.Generic;

using Echo.Core.Factory;
namespace Echo.Core.Models.ChatTokens
{
    public class ChatSegmentToken : ChatToken
    {
        // A ChatSegmentToken is zero or more ChatTokens
        public List<ChatToken> Tokens;
        public ChatSegmentToken(byte[] bytes) : base(bytes) 
        {
            Tokens = new List<ChatToken>();
        }

        public override bool Tokenize()
        {
            using(var s = new MemoryStream(Data))
            {
                using(var reader = new BinaryReader(s))
                {
                    // until we reach a control character assume we are reading text!
                    List<byte> tokenByteList = new List<byte>();
                    while (s.Position < s.Length)
                    {
                        byte b = reader.ReadByte();

                        // if we hit a control character
                        if(b == 0x02)
                        {
                            if(tokenByteList.Count > 0)
                            {
                                // we had text prior to this, store it in a text token!
                                byte[] tokenBytes = tokenByteList.ToArray();
                                tokenByteList.Clear();

                                ChatTextToken textToken = new ChatTextToken(tokenBytes);
                                if(!textToken.Tokenize())
                                    return false;
                                Tokens.Add(textToken);
                            }

                            // delegate to ControlTokenFactory
                            ChatToken token = (ChatToken) ControlTokenFactory.GetToken(reader);
                            if(token is not null)
                                Tokens.Add(token);
                        }
                        else
                        {
                            tokenByteList.Add(b);
                        }
                    }

                    // final iteration
                    if (tokenByteList.Count > 0)
                    {
                        // we had text prior to this, store it in a text token!
                        byte[] tokenBytes = tokenByteList.ToArray();
                        tokenByteList.Clear();

                        ChatTextToken textToken = new ChatTextToken(tokenBytes);
                        if (!textToken.Tokenize())
                        {
                            return false;
                        }
                        Tokens.Add(textToken);
                    }
                }
            }
            return true;
        }

        public override string BuildMessage()
        {
            string message = "";
            for(int idx=0; idx<Tokens.Count; idx++)
                message += Tokens[idx].BuildMessage();
            return message;
        }
    }
}
