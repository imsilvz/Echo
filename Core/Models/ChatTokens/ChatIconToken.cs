using System;
using System.IO;
using System.Diagnostics;
using System.Collections.Generic;

namespace Echo.Core.Models.ChatTokens
{
    class ChatIconToken : ChatToken, IControlToken
    {
        // A ChatServerToken is a server delimiter followed by a string terminated by either 1F or 20
        public ChatIconToken(byte[] bytes) : base(bytes) { }

        public override bool Tokenize()
        {
            // index 2 is the length of this token
            int idx = 2;
            int tokenLength = idx + Data[idx] + 1;
            byte[] tokenData = new byte[tokenLength];
            Array.Copy(Data, 0, tokenData, 0, tokenLength);
            this.Data = tokenData;
            this.Length = tokenLength;
            return true;
        }

        public override string BuildMessage()
        {
            return "[Icon]";
        }
    }
}
