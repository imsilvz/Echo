using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Echo.Core.Models.ChatTokens
{
    // Base Token Class
    public class ChatToken
    {
        public byte[] Data { get; set; }
        public int Length { get; set; }
        public string TokenType { get; set; }

        public ChatToken(byte[] bytes)
        {
            Data = bytes;
            Length = bytes.Length;
            TokenType = this.GetType().Name;
        }

        public virtual bool Tokenize() { return true; }
        public virtual string BuildMessage() { return ""; }
        public virtual List<ChatToken> GetTokens() 
        {
            List<ChatToken> lst = new List<ChatToken>();
            lst.Add(this);
            return lst;
        }
    }
}
