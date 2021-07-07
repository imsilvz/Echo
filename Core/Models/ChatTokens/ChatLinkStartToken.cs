using System;
using System.Diagnostics;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Echo.Core.Models.ChatTokens
{
    public class ChatLinkStartToken : ChatToken
    {
        public bool Delimited { get; set; }
        public ChatLinkStartToken(byte[] bytes) : base(bytes) { }

        public override bool Tokenize()
        {
            byte[] initialData = Data;
            int idx = 2;
            int tokenLength = idx + Data[idx] + 1;
            byte[] tokenData = new byte[tokenLength];
            string hex = BitConverter.ToString(initialData)
                .Replace("-", string.Empty);
            Array.Copy(Data, 0, tokenData, 0, tokenLength);
            this.Data = tokenData;
            this.Length = tokenLength;

            // 
            Delimited = false;
            for(int i=0; i<Data.Length; i++)
            {
                if(Data[i] == 0xFF)
                {
                    Delimited = true;
                    break;
                }
            }
            return true;
        }
    }
}
