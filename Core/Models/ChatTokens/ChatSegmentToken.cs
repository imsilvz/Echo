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
                            if(b == 0x1F) {
                                break;
                            }
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

                    // clean up excess bytes[]
                    long endPos = s.Position;
                    byte[] arr = new byte[s.Position - 1];
                    s.Seek(0, SeekOrigin.Begin);
                    Array.Copy(Data, arr, arr.Length);
                    Data = arr;
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

        public override List<ChatToken> GetTokens()
        {
            List<ChatToken> lst = new List<ChatToken>();
            foreach(var token in Tokens)
            {
                List<ChatToken> tokenLst = token.GetTokens();
                foreach(var child in tokenLst)
                {
                    lst.Add(child);
                }
            }
            return lst;
        }
    }
}
