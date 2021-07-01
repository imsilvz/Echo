using System;
using System.IO;
using System.Diagnostics;

namespace Echo.Core.Models.ChatTokens
{
    public class ChatHeaderToken : ChatToken
    {
        // A ChatHeader is an 8 byte string
        public string OpCode { get; set; }
        public ChatHeaderToken(byte[] bytes) : base(bytes) { }

        public override bool Tokenize()
        {
            if (Data.Length == 8)
            {
                // Valid!
                byte[] opcode = new byte[2];
                Array.Copy(Data, 4, opcode, 0, 2);
                OpCode = BitConverter.ToInt16(opcode).ToString("X4");
                return true;
            }
            return false;
        }

        public override string BuildMessage()
        {
            return $"{this.OpCode}";
        }
    }
}
